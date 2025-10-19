import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });
  
  const body = await request.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const testSessionId = session.metadata?.testSessionId;
    if (testSessionId) {
      await supabase.from('payment_sessions').update({ status: 'completed', paid_at: new Date().toISOString() }).eq('stripe_session_id', session.id);
      await supabase.from('test_sessions').update({ payment_status: 'paid' }).eq('id', testSessionId);
    }
  }
  
  return NextResponse.json({ received: true });
}
