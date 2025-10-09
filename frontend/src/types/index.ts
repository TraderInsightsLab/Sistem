// Shared types pentru TraderInsightsLab Frontend

export interface UserContext {
  email: string;
  age: number;
  experience: 'incepator' | 'intermediar' | 'avansat';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced'; // legacy support
  capitalDisponibil: number;
  obiectiveTrading: string[];
  strategiiPreferate: string[];
  motivatieParticipare: string;
  riskTolerance?: 'low' | 'medium' | 'high';
  tradingGoals?: string[];
  preferredMarkets?: string[];
}

export interface TestAnswer {
  questionId: string;
  answer: string | number | string[];
  timestamp: number;
}

export interface TestQuestion {
  id: string;
  section: 'autoportret' | 'scenarii' | 'cognitive';
  type: 'single-choice' | 'multiple-choice' | 'scale' | 'cognitive-game';
  question: string;
  options?: Array<{
    id: string;
    text: string;
    value: number;
  }>;
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  gameConfig?: {
    type: 'risk-assessment' | 'decision-timing' | 'emotional-control';
    parameters: Record<string, any>;
  };
}

export interface TestSession {
  id: string;
  userContext: UserContext;
  answers: TestAnswer[];
  currentSection: 'autoportret' | 'scenarii' | 'cognitive' | 'completed';
  currentQuestionIndex: number;
  startedAt: number;
  completedAt?: number;
  status: 'in-progress' | 'completed' | 'paid' | 'analyzed';
  paymentStatus?: 'pending' | 'completed' | 'failed';
  analysisResults?: {
    profile: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    tradingStyle: string;
    riskTolerance: 'low' | 'medium' | 'high';
    confidence: number;
  };
}

export interface CognitiveGameResult {
  gameType: 'reaction' | 'pattern' | 'memory' | 'decision';
  score: number;
  duration: number;
  accuracy?: number;
  reactions?: number[];
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}