import { Request, Response } from 'express';
import * as Joi from 'joi';
import { databaseService } from '../services/database';
import { UserContext } from '../types';
// import { allQuestions } from '../shared/questions';

const userContextSchema = Joi.object({
  email: Joi.string().email().required(),
  experienceLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  age: Joi.number().integer().min(18).max(100).required(),
  tradingGoals: Joi.array().items(Joi.string()).required(),
  riskTolerance: Joi.string().valid('low', 'medium', 'high').required(),
  preferredMarkets: Joi.array().items(Joi.string()).required()
});

export const startTestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting new test session');
    
    // Validate request body
    const { error, value } = userContextSchema.validate(req.body.userContext);
    if (error) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid user context data',
          code: 'VALIDATION_ERROR',
          details: error.details
        }
      });
      return;
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
    let questionsToSend = [
      {
        id: 'auto_1',
        section: 'autoportret',
        type: 'scale',
        question: 'Cât de disciplinat te consideri în general în viața ta?',
        options: [
          { id: '1', text: 'Deloc disciplinat', value: 1 },
          { id: '2', text: 'Puțin disciplinat', value: 2 },
          { id: '3', text: 'Moderat disciplinat', value: 3 },
          { id: '4', text: 'Destul de disciplinat', value: 4 },
          { id: '5', text: 'Foarte disciplinat', value: 5 }
        ]
      },
      {
        id: 'cognitive_1',
        section: 'cognitive',
        type: 'cognitive-game',
        question: 'Test de control emoțional',
        gameConfig: {
          type: 'emotional-control',
          duration: 60,
          events: [
            { message: 'Ai pierdut -15% dintr-o investiție importantă', type: 'loss', severity: 'high' },
            { message: 'Piața se prăbușește cu -8% astăzi', type: 'market', severity: 'high' }
          ]
        }
      }
    ];
    
    // For beginners, we might skip some advanced questions
    if (userContext.experienceLevel === 'beginner') {
      questionsToSend = questionsToSend.filter((q: any) => {
        // Include all questions for now, but this can be customized
        return true;
      });
    }

    console.log(`Test session created: ${sessionId}`);

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        questions: questionsToSend.map((q: any) => ({
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