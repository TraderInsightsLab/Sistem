import { create } from 'zustand';
import { UserContext, TestAnswer, TestSession, TestQuestion } from '../types';
import { allQuestions } from '../data/questions';

interface TestState {
  // Current test session
  sessionId: string | null;
  userContext: UserContext | null;
  currentQuestionIndex: number;
  questions: TestQuestion[];
  answers: TestAnswer[];
  
  // Test progress
  isLoading: boolean;
  isCompleted: boolean;
  
  // Test results
  teaserData: {
    archetype: string;
    mainStrength: string;
  } | null;
  
  // Payment state
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  
  // Actions
  initializeTest: (userContext: UserContext) => Promise<void>;
  saveAnswer: (answer: TestAnswer) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeTest: () => Promise<void>;
  resetTest: () => void;
  
  // Utility getters
  getCurrentQuestion: () => TestQuestion | null;
  getProgress: () => number;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

export const useTestStore = create<TestState>((set, get) => ({
  // Initial state
  sessionId: null,
  userContext: null,
  currentQuestionIndex: 0,
  questions: allQuestions,
  answers: [],
  isLoading: false,
  isCompleted: false,
  teaserData: null,
  paymentStatus: 'pending',

  // Initialize test with user context
  initializeTest: async (userContext: UserContext) => {
    set({ isLoading: true });
    
    console.log('🔍 DEBUG Frontend:');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('User context:', userContext);
    
    try {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/startTest`;
      console.log('Full URL:', fullUrl);
      
      // Call backend API to create test session
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userContext }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to start test: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      set({
        sessionId: data.data.sessionId,
        userContext,
        questions: data.data.questions || allQuestions,
        currentQuestionIndex: 0,
        answers: [],
        isLoading: false,
      });
      
      console.log('✅ Test initialized successfully, redirecting to /test');
      // Redirect to test page
      window.location.href = '/test';
      
    } catch (error) {
      console.error('Error initializing test:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Save answer to current question
  saveAnswer: async (answer: TestAnswer) => {
    const { sessionId, answers } = get();
    
    if (!sessionId) {
      throw new Error('No active test session');
    }
    
    set({ isLoading: true });
    
    try {
      // Call backend API to save answer
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/saveAnswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          answer,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save answer');
      }
      
      // Update local state
      const updatedAnswers = [...answers, answer];
      set({
        answers: updatedAnswers,
        isLoading: false,
      });
      
    } catch (error) {
      console.error('Error saving answer:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Navigate to next question
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  // Navigate to previous question
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  // Complete the test and get results
  completeTest: async () => {
    const { sessionId } = get();
    
    if (!sessionId) {
      throw new Error('No active test session');
    }
    
    set({ isLoading: true });
    
    try {
      // Call backend API to process results
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/processResults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process results');
      }
      
      const data = await response.json();
      
      set({
        isCompleted: true,
        teaserData: data.teaser,
        isLoading: false,
      });
      
      // Redirect to results page
      window.location.href = '/results';
      
    } catch (error) {
      console.error('Error completing test:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Reset test to initial state
  resetTest: () => {
    set({
      sessionId: null,
      userContext: null,
      currentQuestionIndex: 0,
      questions: allQuestions,
      answers: [],
      isLoading: false,
      isCompleted: false,
      teaserData: null,
      paymentStatus: 'pending',
    });
  },

  // Utility functions
  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    return questions[currentQuestionIndex] || null;
  },

  getProgress: () => {
    const { currentQuestionIndex, questions } = get();
    return questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;
  },

  canGoNext: () => {
    const { currentQuestionIndex, questions, answers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return false;
    
    // Check if current question has been answered
    const hasAnswer = answers.some(answer => answer.questionId === currentQuestion.id);
    return hasAnswer && currentQuestionIndex < questions.length - 1;
  },

  canGoPrevious: () => {
    const { currentQuestionIndex } = get();
    return currentQuestionIndex > 0;
  },
}));