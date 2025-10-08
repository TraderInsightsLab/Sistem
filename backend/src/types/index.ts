// Shared types pentru TraderInsightsLab Backend

export interface UserContext {
  email: string;
  age: number;
  experience: 'incepator' | 'intermediar' | 'avansat';
  capitalDisponibil: number;
  obiectiveTrading: string[];
  strategiiPreferate: string[];
  motivatieParticipare: string;
}

export interface TestAnswer {
  questionId: string;
  answer: string | number | string[];
  timestamp: number;
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

export interface PaymentSession {
  id: string;
  testSessionId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
  completedAt?: number;
}

export interface AnalysisResult {
  profile: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  tradingStyle: string;
  riskTolerance: 'low' | 'medium' | 'high';
  confidence: number;
  detailedAnalysis: {
    psychologicalProfile: string;
    riskAssessment: string;
    tradingRecommendations: string;
    emotionalIntelligence: string;
    decisionMaking: string;
  };
}

export interface AIAnalysisInput {
  userContext: UserContext;
  answers: TestAnswer[];
  sessionMetadata: {
    totalTime: number;
    sections: {
      autoportret: { timeSpent: number; questionsAnswered: number };
      scenarii: { timeSpent: number; questionsAnswered: number };
      cognitive: { timeSpent: number; questionsAnswered: number };
    };
  };
}

export interface AIAnalysisResult {
  analysisResults: AnalysisResult;
  confidence: number;
  processingTime: number;
}