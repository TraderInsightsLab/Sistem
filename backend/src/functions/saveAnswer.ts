import { Request, Response } from 'express';
import { databaseService } from '../services/database';
import { TestAnswer } from '../../../shared/types';
import * as Joi from 'joi';

// Validation schema for save answer request
const saveAnswerSchema = Joi.object({
  sessionId: Joi.string().required(),
  answer: Joi.object({
    questionId: Joi.string().required(),
    answer: Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.array().items(Joi.string())
    ).required(),
    timestamp: Joi.number().required(),
    responseTime: Joi.number().required(),
    gameResults: Joi.object({
      score: Joi.number(),
      metrics: Joi.object()
    }).optional()
  }).required()
});

export const saveAnswerHandler = async (req: Request, res: Response) => {
  try {
    console.log('Saving answer for session');
    
    // Validate request body
    const { error, value } = saveAnswerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid answer data',
          code: 'VALIDATION_ERROR',
          details: error.details
        }
      });
    }

    const { sessionId, answer } = value;

    // Verify session exists
    const session = await databaseService.getTestSession(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Test session not found',
          code: 'SESSION_NOT_FOUND'
        }
      });
    }

    // Check if session is still active (not completed and not paid)
    if (session.completedAt) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Test session is already completed',
          code: 'SESSION_COMPLETED'
        }
      });
    }

    // Save the answer
    await databaseService.saveAnswer(sessionId, answer);

    // Log analytics for answer patterns
    await databaseService.logAnalytics('answer_saved', {
      sessionId,
      questionId: answer.questionId,
      responseTime: answer.responseTime,
      hasGameResults: !!answer.gameResults,
      timestamp: Date.now()
    });

    console.log(`Answer saved for session ${sessionId}, question ${answer.questionId}`);

    res.status(200).json({
      success: true,
      data: {
        message: 'Answer saved successfully'
      }
    });

  } catch (error) {
    console.error('Error saving answer:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to save answer',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};