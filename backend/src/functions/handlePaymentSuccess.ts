import { Request, Response } from 'express';
import { stripeService } from '../services/stripe';
import { databaseService } from '../services/database';

export const handlePaymentSuccessHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received Stripe webhook');
    
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      console.error('No Stripe signature found');
      res.status(400).json({
        success: false,
        error: {
          message: 'No signature provided',
          code: 'MISSING_SIGNATURE'
        }
      });
      return;
    }

    // Verify webhook signature
    const isValid = await stripeService.verifyWebhookSignature(req.body, signature);
    if (!isValid) {
      console.error('Invalid webhook signature');
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid signature',
          code: 'INVALID_SIGNATURE'
        }
      });
      return;
    }

    // Process webhook event
    const event = await stripeService.handleWebhookEvent(req.body, signature);
    
    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object!);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object!);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object!);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error handling webhook:', error);
    
    // Still return 200 to prevent Stripe retries for coding errors
    res.status(200).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
};

// Handle successful checkout session
async function handleCheckoutCompleted(session: any) {
  try {
    const sessionId = session.client_reference_id || session.metadata?.sessionId;
    
    if (!sessionId) {
      console.error('No session ID found in checkout session');
      return;
    }

    console.log(`Checkout completed for session: ${sessionId}`);

    // Update payment status
    await databaseService.updatePaymentStatus(sessionId, 'completed');

    // Log analytics
    await databaseService.logAnalytics('payment_completed', {
      sessionId,
      stripeSessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      timestamp: Date.now()
    });

    // The Firestore trigger will handle report generation
    console.log(`Payment processing completed for session: ${sessionId}`);

  } catch (error) {
    console.error('Error handling checkout completion:', error);
    throw error;
  }
}

// Handle successful payment intent
async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const sessionId = paymentIntent.metadata?.sessionId;
    
    if (!sessionId) {
      console.log('No session ID in payment intent metadata');
      return;
    }

    console.log(`Payment succeeded for session: ${sessionId}`);

    // Ensure payment status is updated
    await databaseService.updatePaymentStatus(sessionId, 'completed');

    // Log additional analytics
    await databaseService.logAnalytics('payment_intent_succeeded', {
      sessionId,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: any) {
  try {
    const sessionId = paymentIntent.metadata?.sessionId;
    
    if (!sessionId) {
      console.log('No session ID in payment intent metadata');
      return;
    }

    console.log(`Payment failed for session: ${sessionId}`);

    // Update payment status
    await databaseService.updatePaymentStatus(sessionId, 'failed');

    // Log analytics
    await databaseService.logAnalytics('payment_failed', {
      sessionId,
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}