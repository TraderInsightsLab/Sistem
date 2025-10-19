import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, email } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({ error: 'sessionId and email required' });
    }

    // Verifică că sesiunea există și este completă
    const { data: session, error: sessionError } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Test not completed yet' });
    }

    // Creează Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ron',
            product_data: {
              name: 'Raport Profil Trader',
              description: 'Analiză detaliată a profilului tău de trading'
            },
            unit_amount: 4900 // 49 RON în bani (49.00 RON)
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}&payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}&payment=cancelled`,
      customer_email: email,
      metadata: {
        testSessionId: sessionId
      }
    });

    // Salvează payment session în Supabase
    await supabase
      .from('payment_sessions')
      .insert([
        {
          test_session_id: sessionId,
          stripe_session_id: checkoutSession.id,
          email: email,
          amount: 49.00,
          currency: 'RON',
          status: 'pending'
        }
      ]);

    return res.status(200).json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    });

  } catch (error) {
    console.error('Error creating payment session:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
