import { Request, Response } from 'express';
import { databaseService } from '../services/database';
import { UserContext } from '../types';

export const startTestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting new test session - v2.0 with updated questions');
    
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

    // Hardcoded questions array to avoid cache issues
    const questions = [
      {
        id: 'auto_1',
        section: 'autoportret',
        type: 'scale',
        question: 'Cât de confortabil te simți atunci când iei decizii rapide sub presiune?',
        scaleMin: 1,
        scaleMax: 7,
        scaleLabels: { min: 'Foarte incomod', max: 'Foarte confortabil' }
      },
      {
        id: 'auto_2',
        section: 'autoportret',
        type: 'single-choice',
        question: 'Când faci o investiție care înregistrează o pierdere de 10%, prima ta reacție este:',
        options: [
          { id: 'a', text: 'Vând imediat pentru a limita pierderile', value: 2 },
          { id: 'b', text: 'Aștept și analizez situația', value: 4 },
          { id: 'c', text: 'Investesc mai mult pentru a reduce prețul mediu', value: 1 },
          { id: 'd', text: 'Îmi recalculez strategia complet', value: 5 },
          { id: 'e', text: 'Consult alte surse pentru a lua o decizie', value: 3 }
        ]
      },
      {
        id: 'auto_3',
        section: 'autoportret',
        type: 'scale',
        question: 'Cât de mult îți place să analizezi grafice și indicatori tehnici?',
        scaleMin: 1,
        scaleMax: 7,
        scaleLabels: { min: 'Deloc', max: 'Foarte mult' }
      },
      {
        id: 'scen_1',
        section: 'scenarii',
        type: 'single-choice',
        question: 'Ai o poziție profitabilă de +15%. Piața începe să se corecteze. Ce faci?',
        options: [
          { id: 'a', text: 'Vând 50% din poziție pentru a securiza profitul', value: 4 },
          { id: 'b', text: 'Vând totul - profitul e profit', value: 3 },
          { id: 'c', text: 'Țin poziția și pun stop-loss la +10%', value: 5 },
          { id: 'd', text: 'Țin poziția complet - trendul va continua', value: 2 },
          { id: 'e', text: 'Analizez volumul și momentum-ul înainte să decid', value: 5 }
        ]
      },
      {
        id: 'scen_2',
        section: 'scenarii',
        type: 'single-choice',
        question: 'Pierzi 3 trade-uri consecutive, fiecare cu -5%. Următoarea oportunitate pare excelentă. Ce faci?',
        options: [
          { id: 'a', text: 'Fac o pauză și analizez ce a mers greșit', value: 5 },
          { id: 'b', text: 'Reduc size-ul poziției la jumătate', value: 4 },
          { id: 'c', text: 'Tradez normal - pierderile fac parte din joc', value: 3 },
          { id: 'd', text: 'Măresc poziția pentru a recupera pierderile', value: 1 },
          { id: 'e', text: 'Schimb complet strategia', value: 2 }
        ]
      },
      {
        id: 'cog_1',
        section: 'cognitive',
        type: 'cognitive-game',
        question: 'Jocul Riscului Calculat',
        gameConfig: {
          type: 'risk-assessment',
          parameters: {
            initialAmount: 1000,
            rounds: 5,
            options: [
              { risk: 'low', potential: 5, loss: 2 },
              { risk: 'medium', potential: 15, loss: 8 },
              { risk: 'high', potential: 40, loss: 25 }
            ]
          }
        }
      },
      {
        id: 'cog_2',
        section: 'cognitive',
        type: 'cognitive-game',
        question: 'Testul Timpului de Decizie',
        gameConfig: {
          type: 'decision-timing',
          parameters: {
            scenarios: 8,
            timeLimit: 10,
            pressureIncrease: true
          }
        }
      },
      {
        id: 'cog_3',
        section: 'cognitive',
        type: 'cognitive-game',
        question: 'Controlul Emoțional',
        gameConfig: {
          type: 'emotional-control',
          parameters: {
            events: 8,
            stressTypes: ['market_crash', 'profit_euphoria', 'expert_criticism', 'missed_opportunity'],
            measureStability: true,
            emotionalRange: { min: 0, max: 100 },
            initialState: 50
          }
        }
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        sessionId: sessionId,
        questions: questions, // Return hardcoded questions
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