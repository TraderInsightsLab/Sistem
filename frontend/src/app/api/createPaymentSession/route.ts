import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { sessionId, email } = await request.json();
  if (!sessionId || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  
  const { data: session } = await supabase.from('test_sessions').select('*').eq('id', sessionId).single();
  if (!session || session.status !== 'completed') return NextResponse.json({ error: 'Test not completed' }, { status: 400 });
  
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'ron', product_data: { name: 'Raport Profil Trader' }, unit_amount: 4900 }, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}&payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}&payment=cancelled`,
    customer_email: email,
    metadata: { testSessionId: sessionId }
  });
  
  await supabase.from('payment_sessions').insert([{ test_session_id: sessionId, stripe_session_id: checkoutSession.id, email, amount: 49.00, currency: 'RON', status: 'pending' }]);
  
  return NextResponse.json({ checkoutUrl: checkoutSession.url, sessionId: checkoutSession.id });
}
