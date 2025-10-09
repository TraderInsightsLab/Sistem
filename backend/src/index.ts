import * as functions from 'firebase-functions/v1';
import express, { Request, Response } from 'express';
import cors from 'cors';

// Import all our function handlers
import { startTestHandler } from './functions/startTest';
import { saveAnswerHandler } from './functions/saveAnswer';
import { processResultsHandler } from './functions/processResults';
import { handlePaymentSuccessHandler } from './functions/handlePaymentSuccess';
import { generateAndSendReportHandler } from './functions/generateAndSendReport';

// Configure express app
const app = express();

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://traderinsightslab.web.app',
    'https://traderinsightslab.firebaseapp.com',
    'https://trader-insights-lab.web.app',
    'https://trader-insights-lab.firebaseapp.com'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'TraderInsightsLab Backend'
  });
});

// API Routes
app.post('/startTest', startTestHandler);
app.post('/saveAnswer', saveAnswerHandler);
app.post('/processResults', processResultsHandler);
app.post('/generateReport', generateAndSendReportHandler);

// Stripe webhook endpoint (requires raw body)
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), handlePaymentSuccessHandler);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR'
    }
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND'
    }
  });
});

// Export the main API function
export const api = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB',
    invoker: 'public'
  })
  .https
  .onRequest(app);

// Export individual functions for direct invocation if needed
export const processTestResults = functions
  .region('us-central1')
  .runWith({
    timeoutSeconds: 300,
    memory: '1GB'
  })
  .firestore
  .document('testSessions/{sessionId}')
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const before = change.before.data();
    
    // Trigger report generation when payment is completed
    if (before.paymentStatus !== 'paid' && after.paymentStatus === 'paid') {
      await generateAndSendReportHandler(context.params.sessionId);
    }
  });

export const cleanupSessions = functions
  .region('us-central1')
  .pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Cleanup old incomplete sessions (older than 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Implementation will be added when we create the cleanup utility
    console.log('Running cleanup job for sessions older than 7 days');
  });