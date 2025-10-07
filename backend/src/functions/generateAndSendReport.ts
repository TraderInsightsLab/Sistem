import { databaseService } from '../services/database';
import { pdfGenerationService } from '../services/pdfGeneration';
import { emailService } from '../services/email';

export const generateAndSendReportHandler = async (sessionId: string) => {
  try {
    console.log(`Generating report for session: ${sessionId}`);

    // Get test session with results
    const session = await databaseService.getTestSession(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (!session.fullReportData) {
      throw new Error(`No analysis results found for session: ${sessionId}`);
    }

    if (session.paymentStatus !== 'paid') {
      throw new Error(`Payment not completed for session: ${sessionId}`);
    }

    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await pdfGenerationService.generateReport({
      sessionId,
      userContext: session.userContext,
      analysisResults: session.fullReportData,
      generatedAt: new Date()
    });

    // Send email with PDF attachment
    console.log('Sending email with report...');
    await emailService.sendReport({
      to: session.userContext.email,
      sessionId,
      archetype: session.fullReportData.archetype.name,
      pdfBuffer
    });

    // Update report status
    await databaseService.updateReportStatus(sessionId, 'sent');

    // Log analytics
    await databaseService.logAnalytics('report_sent', {
      sessionId,
      userEmail: session.userContext.email,
      archetype: session.fullReportData.archetype.name,
      timestamp: Date.now()
    });

    console.log(`Report successfully sent for session: ${sessionId}`);

  } catch (error) {
    console.error('Error generating and sending report:', error);
    
    // Update report status to indicate error
    try {
      await databaseService.updateReportStatus(sessionId, 'pending');
      
      // Log error analytics
      await databaseService.logAnalytics('report_error', {
        sessionId,
        error: error.message,
        timestamp: Date.now()
      });
    } catch (logError) {
      console.error('Error logging report failure:', logError);
    }
    
    throw error;
  }
};