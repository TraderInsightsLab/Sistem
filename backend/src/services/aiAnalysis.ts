import { VertexAI } from '@google-cloud/vertexai';
import { AIAnalysisInput, AIAnalysisResult, AnalysisResult } from '../types';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.VERTEX_AI_PROJECT_ID!,
  location: process.env.VERTEX_AI_LOCATION!
});

const model = vertexAI.preview.getGenerativeModel({
  model: process.env.VERTEX_AI_MODEL_ID || 'gemini-pro',
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.3,
    topP: 0.8,
  },
});

export class AIAnalysisService {
  
  async analyzeProfile(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    try {
      // Prepare the prompt for analysis
      const prompt = this.buildAnalysisPrompt(input);
      
      // Call Vertex AI
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse the JSON response
      const analysis = JSON.parse(text);
      
      // Validate and structure the response
      return this.validateAnalysisResult(analysis);
      
    } catch (error) {
      console.error('Error in AI analysis:', error);
      
      // Return fallback analysis
      return this.getFallbackAnalysis(input);
    }
  }
  
  private buildAnalysisPrompt(input: AIAnalysisInput): string {
    const { userContext, answers, sessionMetadata } = input;
    
    return `
You are an expert trading psychologist. Analyze the following user data and provide a comprehensive psychological profile for trading.

USER CONTEXT:
- Experience Level: ${userContext.experienceLevel}
- Age: ${userContext.age}
- Risk Tolerance: ${userContext.riskTolerance}
- Trading Goals: ${userContext.tradingGoals.join(', ')}
- Preferred Markets: ${userContext.preferredMarkets.join(', ')}

TEST ANSWERS:
${this.formatAnswersForPrompt(answers)}

SESSION DATA:
- Total Time: ${sessionMetadata.totalTime}ms
- Section Performance: ${JSON.stringify(sessionMetadata.sections)}

ANALYSIS REQUIREMENTS:
Please provide a JSON response with the following structure:

{
  "archetype": {
    "name": "One of: Analytical Trader, Intuitive Trader, Conservative Investor, Aggressive Speculator, Emotional Trader, Disciplined Trader",
    "description": "Detailed description of this archetype",
    "characteristics": ["trait1", "trait2", "trait3"]
  },
  "strengths": [
    {
      "category": "Strength category",
      "description": "Detailed description",
      "score": 85
    }
  ],
  "weaknesses": [
    {
      "category": "Weakness category", 
      "description": "Detailed description",
      "risk": "low|medium|high",
      "recommendations": ["recommendation1", "recommendation2"]
    }
  ],
  "gapAnalysis": {
    "perception": "How they see themselves",
    "reality": "What the test reveals",
    "blindSpots": ["blindspot1", "blindspot2"]
  },
  "tradingRecommendations": {
    "optimalStyle": "Day trading, Swing trading, Position trading, etc.",
    "timeframe": "Recommended timeframe",
    "riskManagement": ["rule1", "rule2"],
    "developmentPlan": [
      {
        "phase": "Phase name",
        "duration": "timeframe",
        "actions": ["action1", "action2"]
      }
    ]
  },
  "emotionalProfile": {
    "riskTolerance": 75,
    "stressResponse": "Description",
    "decisionMaking": "Description",
    "discipline": 80
  }
}

Focus on:
1. Identifying gaps between self-perception and demonstrated behavior
2. Providing actionable, specific recommendations
3. Analyzing emotional patterns and decision-making styles
4. Considering the Romanian trading context and mentality

Respond ONLY with valid JSON, no additional text.
    `;
  }
  
  private formatAnswersForPrompt(answers: any[]): string {
    return answers.map(answer => {
      const gameResults = answer.gameResults ? 
        `Game Results: ${JSON.stringify(answer.gameResults)}` : '';
      
      return `Question ${answer.questionId}: ${answer.answer} (Response time: ${answer.responseTime}ms) ${gameResults}`;
    }).join('\n');
  }
  
  private validateAnalysisResult(analysis: any): AIAnalysisResult {
    // Basic validation and default values
    return {
      archetype: {
        name: analysis.archetype?.name || 'Analytical Trader',
        description: analysis.archetype?.description || 'Profile în curs de analiză',
        characteristics: analysis.archetype?.characteristics || ['Metodic', 'Precaut', 'Analitic']
      },
      strengths: analysis.strengths || [
        {
          category: 'Gândire analitică',
          description: 'Abordare sistematică a deciziilor',
          score: 75
        }
      ],
      weaknesses: analysis.weaknesses || [
        {
          category: 'Presiune de timp',
          description: 'Performanța scade sub presiunea timpului',
          risk: 'medium' as const,
          recommendations: ['Practică luarea deciziilor rapide', 'Dezvoltă planuri de trading clare']
        }
      ],
      gapAnalysis: {
        perception: analysis.gapAnalysis?.perception || 'Percepție în curs de analiză',
        reality: analysis.gapAnalysis?.reality || 'Realitate demonstrată în test',
        blindSpots: analysis.gapAnalysis?.blindSpots || ['Punct orb identificat în analiză']
      },
      tradingRecommendations: {
        optimalStyle: analysis.tradingRecommendations?.optimalStyle || 'Swing Trading',
        timeframe: analysis.tradingRecommendations?.timeframe || '1-7 zile',
        riskManagement: analysis.tradingRecommendations?.riskManagement || [
          'Folosește stop-loss pentru toate pozițiile',
          'Nu risca mai mult de 2% din portofoliu per tranzacție'
        ],
        developmentPlan: analysis.tradingRecommendations?.developmentPlan || [
          {
            phase: 'Fundamente',
            duration: '1-2 luni',
            actions: ['Studiază analiza tehnică', 'Practică pe cont demo']
          }
        ]
      },
      emotionalProfile: {
        riskTolerance: analysis.emotionalProfile?.riskTolerance || 65,
        stressResponse: analysis.emotionalProfile?.stressResponse || 'Moderat',
        decisionMaking: analysis.emotionalProfile?.decisionMaking || 'Analitic',
        discipline: analysis.emotionalProfile?.discipline || 70
      }
    };
  }
  
  private getFallbackAnalysis(input: AIAnalysisInput): AIAnalysisResult {
    // Provide a basic analysis based on user context when AI fails
    const { userContext } = input;
    
    let archetype = 'Analytical Trader';
    if (userContext.riskTolerance === 'high') {
      archetype = 'Aggressive Speculator';
    } else if (userContext.riskTolerance === 'low') {
      archetype = 'Conservative Investor';
    }
    
    return {
      archetype: {
        name: archetype,
        description: 'Profil determinat pe baza preferințelor declarate și comportamentului observat în test.',
        characteristics: ['Sistematic', 'Precaut', 'Orientat spre date']
      },
      strengths: [
        {
          category: 'Abordare metodică',
          description: 'Demonstrezi o abordare sistematică în luarea deciziilor',
          score: 75
        }
      ],
      weaknesses: [
        {
          category: 'Adaptabilitate',
          description: 'Poți avea dificultăți în adaptarea rapidă la schimbări de piață',
          risk: 'medium' as const,
          recommendations: [
            'Practică simulări cu condiții de piață volatile',
            'Dezvoltă planuri alternative pentru diferite scenarii'
          ]
        }
      ],
      gapAnalysis: {
        perception: 'Te consideri o persoană disciplinată și rațională',
        reality: 'Testul confirmă multe dintre aceste caracteristici',
        blindSpots: ['Posibilă subestimare a impactului emoțiilor în decizii']
      },
      tradingRecommendations: {
        optimalStyle: userContext.riskTolerance === 'high' ? 'Day Trading' : 'Swing Trading',
        timeframe: userContext.riskTolerance === 'high' ? 'Intraday' : '1-5 zile',
        riskManagement: [
          'Setează stop-loss automat pentru toate pozițiile',
          'Nu depăși 2-3% risc per tranzacție',
          'Ține un jurnal de trading pentru analiza performanței'
        ],
        developmentPlan: [
          {
            phase: 'Consolidare',
            duration: '1-3 luni',
            actions: [
              'Studiază principiile analizei tehnice',
              'Practică pe cont demo minim 50 de tranzacții',
              'Dezvoltă un plan de trading personalizat'
            ]
          }
        ]
      },
      emotionalProfile: {
        riskTolerance: userContext.riskTolerance === 'high' ? 80 : userContext.riskTolerance === 'low' ? 40 : 65,
        stressResponse: 'Calm sub presiune moderată',
        decisionMaking: 'Preferă analiza înainte de acțiune',
        discipline: 75
      }
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();