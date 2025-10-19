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
  initializeTest: (userContext: UserContext) => Promise<boolean>;
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
  // Initial state - try to load from sessionStorage
  sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('test_sessionId') : null,
  userContext: typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('test_userContext') || 'null') : null,
  currentQuestionIndex: typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('test_currentIndex') || '0') : 0,
  questions: typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('test_questions') || JSON.stringify(allQuestions)) : allQuestions,
  answers: typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('test_answers') || '[]') : [],
  isLoading: false,
  isCompleted: false,
  teaserData: null,
  paymentStatus: 'pending',

  // Initialize test with user context
  initializeTest: async (userContext: UserContext) => {
    set({ isLoading: true });
    
    console.log('🔍 Initializing test with Vercel API...');
    console.log('User context:', userContext);
    
    try {
      // Call Vercel API to create test session
      const response = await fetch('/api/startTest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userContext }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to start test: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Questions received:', data.questions.length);
      console.log('First question:', data.questions[0]);
      
      const newState = {
        sessionId: data.sessionId,
        userContext,
        questions: data.questions,
        currentQuestionIndex: 0,
        answers: [],
        isLoading: false,
      };
      
      // Save to sessionStorage for persistence across page reloads
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('test_sessionId', data.sessionId);
        sessionStorage.setItem('test_userContext', JSON.stringify(userContext));
        sessionStorage.setItem('test_questions', JSON.stringify(data.questions));
        sessionStorage.setItem('test_currentIndex', '0');
        sessionStorage.setItem('test_answers', '[]');
        
        console.log('💾 Saved to sessionStorage');
      }
      
      set(newState);
      
      console.log('✅ Test initialized successfully');
      
      return true;
      
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
      // Call Vercel API to save answer
      const response = await fetch('/api/saveAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          questionId: answer.questionId,
          answer: answer.answer,
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
      
      // Update sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('test_answers', JSON.stringify(updatedAnswers));
      }
      
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
      const newIndex = currentQuestionIndex + 1;
      set({ currentQuestionIndex: newIndex });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('test_currentIndex', newIndex.toString());
      }
    }
  },

  // Navigate to previous question
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      set({ currentQuestionIndex: newIndex });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('test_currentIndex', newIndex.toString());
      }
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
      // Call Vercel API to process results
      const response = await fetch('/api/processResults', {
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
        teaserData: {
          archetype: data.analysis.traderType,
          mainStrength: data.analysis.strengthsWeaknesses.strengths[0] || 'Analytical thinking'
        },
        isLoading: false,
      });
      
      // Redirect to results page using router
      window.location.href = '/results';
      
    } catch (error) {
      console.error('Error completing test:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Reset test to initial state
  resetTest: () => {
    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('test_sessionId');
      sessionStorage.removeItem('test_userContext');
      sessionStorage.removeItem('test_questions');
      sessionStorage.removeItem('test_currentIndex');
      sessionStorage.removeItem('test_answers');
    }
    
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