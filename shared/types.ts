// Shared TypeScript types for TraderInsightsLab

export interface UserContext {
  email: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  age: number;
  tradingGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  preferredMarkets: string[];
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
  gameConfig?: {
    type: 'risk-assessment' | 'decision-timing' | 'emotional-control';
    parameters: Record<string, any>;
  };
}

export interface TestAnswer {
  questionId: string;
  answer: string | number | string[];
  timestamp: number;
  responseTime: number;
  gameResults?: {
    score: number;
    metrics: Record<string, number>;
  };
}

export interface TestSession {
  id: string;
  userContext: UserContext;
  answers: TestAnswer[];
  startedAt: number;
  completedAt?: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  reportStatus: 'pending' | 'generated' | 'sent';
  fullReportData?: AIAnalysisResult;
  teaserData?: {
    archetype: string;
    mainStrength: string;
  };
}

export interface AIAnalysisInput {
  userContext: UserContext;
  answers: TestAnswer[];
  sessionMetadata: {
    totalTime: number;
    sections: {
      [key: string]: {
        timeSpent: number;
        questionsAnswered: number;
      };
    };
  };
}

export interface AIAnalysisResult {
  archetype: {
    name: string;
    description: string;
    characteristics: string[];
  };
  strengths: Array<{
    category: string;
    description: string;
    score: number;
  }>;
  weaknesses: Array<{
    category: string;
    description: string;
    risk: 'low' | 'medium' | 'high';
    recommendations: string[];
  }>;
  gapAnalysis: {
    perception: string;
    reality: string;
    blindSpots: string[];
  };
  tradingRecommendations: {
    optimalStyle: string;
    timeframe: string;
    riskManagement: string[];
    developmentPlan: Array<{
      phase: string;
      duration: string;
      actions: string[];
    }>;
  };
  emotionalProfile: {
    riskTolerance: number;
    stressResponse: string;
    decisionMaking: string;
    discipline: number;
  };
}

export interface PaymentSession {
  sessionId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface StartTestResponse {
  sessionId: string;
  questions: TestQuestion[];
}

export interface SaveAnswerRequest {
  sessionId: string;
  answer: TestAnswer;
}

export interface ProcessResultsResponse {
  teaser: {
    archetype: string;
    mainStrength: string;
  };
  paymentUrl: string;
}

// Environment configuration
export interface Config {
  apiUrl: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  sendGridApiKey: string;
  vertexAiProjectId: string;
  vertexAiLocation: string;
  vertexAiModelId: string;
}