import { Request, Response } from 'express';
import { databaseService } from '../services/database';
import { UserContext } from '../types';

export const startTestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting new test session');
    
    const userContext = req.body.userContext as UserContext;
    if (!userContext || !userContext.email || !userContext.age) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid user context data', code: 'VALIDATION_ERROR' }
      });
      return;
    }

    // Create new test session in database
    const sessionId = await databaseService.createTestSession({
      userContext,
      answers: [],
      startedAt: Date.now(),
      currentSection: 'autoportret',
      currentQuestionIndex: 0,
      status: 'in-progress',
      paymentStatus: 'pending',
      reportStatus: 'pending'
    });

    console.log(`New test session created with ID: ${sessionId}`);

    res.status(200).json({
      success: true,
      data: {
        sessionId: sessionId,
        message: 'Test session created successfully'
      }
    });

  } catch (error) {
    console.error('Error creating test session:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create test session',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};