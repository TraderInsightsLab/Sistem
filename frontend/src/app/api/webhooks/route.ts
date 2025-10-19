import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { buffer } from 'micro';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ 
      error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` 
    });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const testSessionId = session.metadata?.testSessionId;

    if (!testSessionId) {
      console.error('No testSessionId in metadata');
      return res.status(400).json({ error: 'Missing testSessionId' });
    }

    try {
      // Actualizează payment session
      await supabase
        .from('payment_sessions')
        .update({
          status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id);

      // Actualizează test session
      await supabase
        .from('test_sessions')
        .update({
          payment_status: 'paid'
        })
        .eq('id', testSessionId);

      console.log(`Payment completed for session ${testSessionId}`);

      // TODO: Trigger email sending with PDF report
      // This will be implemented later with email service

    } catch (error) {
      console.error('Error processing payment:', error);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  }

  return res.status(200).json({ received: true });
}
