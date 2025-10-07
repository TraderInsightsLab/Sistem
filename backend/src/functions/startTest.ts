import { Request, Response } from 'express';
import { databaseService } from '../services/database';
import { allQuestions } from '../../../shared/questions';
import { UserContext } from '../../../shared/types';
import * as Joi from 'joi';

// Validation schema for user context
const userContextSchema = Joi.object({
  email: Joi.string().email().required(),
  experienceLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  age: Joi.number().integer().min(18).max(100).required(),
  tradingGoals: Joi.array().items(Joi.string()).required(),
  riskTolerance: Joi.string().valid('low', 'medium', 'high').required(),
  preferredMarkets: Joi.array().items(Joi.string()).required()
});

export const startTestHandler = async (req: Request, res: Response) => {
  try {
    console.log('Starting new test session');
    
    // Validate request body
    const { error, value } = userContextSchema.validate(req.body.userContext);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid user context data',
          code: 'VALIDATION_ERROR',
          details: error.details
        }
      });
    }

    const userContext: UserContext = value;

    // Create new test session in database
    const sessionId = await databaseService.createTestSession({
      userContext,
      answers: [],
      startedAt: Date.now(),
      paymentStatus: 'pending',
      reportStatus: 'pending'
    });

    // Log analytics
    await databaseService.logAnalytics('test_started', {
      sessionId,
      userContext: {
        experienceLevel: userContext.experienceLevel,
        age: userContext.age,
        riskTolerance: userContext.riskTolerance
      },
      timestamp: Date.now()
    });

    // Filter questions based on experience level if needed
    let questions = allQuestions;
    
    // For beginners, we might skip some advanced questions
    if (userContext.experienceLevel === 'beginner') {
      questions = allQuestions.filter(q => {
        // Include all questions for now, but this can be customized
        return true;
      });
    }

    console.log(`Test session created: ${sessionId}`);

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        questions: questions.map(q => ({
          id: q.id,
          section: q.section,
          type: q.type,
          question: q.question,
          options: q.options,
          gameConfig: q.gameConfig
        }))
      }
    });

  } catch (error) {
    console.error('Error starting test:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to start test session',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};