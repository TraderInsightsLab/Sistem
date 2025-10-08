import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { TestSession, PaymentSession } from '../types';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.VERTEX_AI_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: `${process.env.VERTEX_AI_PROJECT_ID}.appspot.com`
  });
}

export const db = getFirestore();
export const storage = getStorage();

// Database service class
export class DatabaseService {
  
  // Test Session operations
  async createTestSession(session: Omit<TestSession, 'id'>): Promise<string> {
    const docRef = await db.collection('testSessions').add({
      ...session,
      startedAt: Date.now(),
      paymentStatus: 'pending',
      reportStatus: 'pending'
    });
    return docRef.id;
  }

  async getTestSession(sessionId: string): Promise<TestSession | null> {
    const doc = await db.collection('testSessions').doc(sessionId).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    } as TestSession;
  }

  async updateTestSession(sessionId: string, data: Partial<TestSession>): Promise<void> {
    await db.collection('testSessions').doc(sessionId).update(data);
  }

  async saveAnswer(sessionId: string, answer: any): Promise<void> {
    const sessionRef = db.collection('testSessions').doc(sessionId);
    
    await db.runTransaction(async (transaction) => {
      const sessionDoc = await transaction.get(sessionRef);
      if (!sessionDoc.exists) {
        throw new Error('Session not found');
      }
      
      const currentAnswers = sessionDoc.data()?.answers || [];
      const updatedAnswers = [...currentAnswers, answer];
      
      transaction.update(sessionRef, { answers: updatedAnswers });
    });
  }

  async completeTestSession(sessionId: string, analysisResult: any): Promise<void> {
    await this.updateTestSession(sessionId, {
      completedAt: Date.now(),
      analysisResults: analysisResult,
      status: 'completed'
    });
  }

  // Payment Session operations
  async createPaymentSession(payment: Omit<PaymentSession, 'createdAt'>): Promise<void> {
    await db.collection('paymentSessions').doc(payment.id).set({
      ...payment,
      createdAt: Date.now()
    });
  }

  async updatePaymentStatus(sessionId: string, status: PaymentSession['status']): Promise<void> {
    await db.collection('paymentSessions').doc(sessionId).update({ status });
    
    // Also update the test session payment status
    await this.updateTestSession(sessionId, { 
      paymentStatus: status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : 'pending'
    });
  }

  async getPaymentSession(sessionId: string): Promise<PaymentSession | null> {
    const doc = await db.collection('paymentSessions').doc(sessionId).get();
    if (!doc.exists) return null;
    
    return doc.data() as PaymentSession;
  }

  // Analytics operations
  async logAnalytics(event: string, data: any): Promise<void> {
    await db.collection('analytics').add({
      event,
      data,
      timestamp: Date.now()
    });
  }

  // Utility methods
  async getSessionsByEmail(email: string, limit: number = 10): Promise<TestSession[]> {
    const snapshot = await db.collection('testSessions')
      .where('userContext.email', '==', email)
      .orderBy('startedAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TestSession[];
  }

  async getCompletedSessions(limit: number = 100): Promise<TestSession[]> {
    const snapshot = await db.collection('testSessions')
      .where('paymentStatus', '==', 'paid')
      .where('completedAt', '>', 0)
      .orderBy('completedAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TestSession[];
  }
}

export const databaseService = new DatabaseService();