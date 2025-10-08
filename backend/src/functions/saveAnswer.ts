import { Request, Response } from 'express';
import { databaseService } from '../services/database';

// Validation schema for save answer request
const validateSaveAnswer = (data: any) => {
  if (!data.sessionId || typeof data.sessionId !== 'string') {
    throw new Error('Session ID is required');
  }
  if (!data.answer || !data.answer.questionId || !data.answer.answer || !data.answer.timestamp) {
    throw new Error('Answer data is incomplete');
  }
  return data;
};

export const saveAnswerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Saving answer for session');
    
    // Validate request body
    const data = validateSaveAnswer(req.body);
    const { sessionId, answer } = data;

    // Verify session exists
    const session = await databaseService.getTestSession(sessionId);
    if (!session) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Test session not found',
          code: 'SESSION_NOT_FOUND'
        }
      });
      return;
    }

    // Check if session is still active (not completed and not paid)
    if (session.completedAt) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Test session is already completed',
          code: 'SESSION_COMPLETED'
        }
      });
      return;
    }

    // Save the answer
    await databaseService.saveAnswer(sessionId, answer);

    // Log analytics for answer patterns
    await databaseService.logAnalytics('answer_saved', {
      sessionId,
      questionId: answer.questionId,
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