import { Request, Response } from 'express';
import { databaseService } from '../services/database';
import { aiAnalysisService } from '../services/aiAnalysis';
import { stripeService } from '../services/stripe';
import * as Joi from 'joi';

// Validation schema
const processResultsSchema = Joi.object({
  sessionId: Joi.string().required()
});

export const processResultsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Processing test results');
    
    // Validate request body
    const { error, value } = processResultsSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: error.details
        }
      });
      return;
    }

    const { sessionId } = value;

    // Get test session
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

    // Check if session has enough answers
    if (!session.answers || session.answers.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: 'No answers found for this session',
          code: 'NO_ANSWERS'
        }
      });
      return;
    }

    // Prepare data for AI analysis
    const analysisInput = {
      userContext: session.userContext,
      answers: session.answers,
      sessionMetadata: {
        totalTime: Date.now() - session.startedAt,
        sections: {
          autoportret: {
            timeSpent: 0, // Will be calculated from answer timestamps
            questionsAnswered: session.answers.filter(a => a.questionId.startsWith('auto_')).length
          },
          scenarii: {
            timeSpent: 0,
            questionsAnswered: session.answers.filter(a => a.questionId.startsWith('scen_')).length
          },
          cognitive: {
            timeSpent: 0,
            questionsAnswered: session.answers.filter(a => a.questionId.startsWith('cog_')).length
          }
        }
      }
    };

    // Get AI analysis
    console.log('Requesting AI analysis...');
    const aiResults = await aiAnalysisService.analyzeProfile(analysisInput);

    // Complete the test session with results
    await databaseService.completeTestSession(sessionId, aiResults);

    // Create Stripe payment session
    const paymentSession = await stripeService.createPaymentSession({
      sessionId,
      amount: 4900, // 49 RON in cents
      currency: 'ron',
      userEmail: session.userContext.email,
      metadata: {
        sessionId,
        archetype: aiResults.archetype.name
      }
    });

    // Log analytics
    await databaseService.logAnalytics('test_completed', {
      sessionId,
      archetype: aiResults.archetype.name,
      totalAnswers: session.answers.length,
      totalTime: analysisInput.sessionMetadata.totalTime,
      timestamp: Date.now()
    });

    console.log(`Test results processed for session ${sessionId}`);

    // Return teaser data and payment URL
    res.status(200).json({
      success: true,
      data: {
        teaser: {
          archetype: aiResults.archetype.name,
          mainStrength: aiResults.strengths[0]?.category || 'Analiză detaliată disponibilă'
        },
        paymentUrl: paymentSession.url,
        sessionId
      }
    });

  } catch (error) {
    console.error('Error processing results:', error);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process test results',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};