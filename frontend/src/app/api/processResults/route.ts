import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  
  const { data: session, error: sessionError } = await supabase.from('test_sessions').select('*').eq('id', sessionId).single();
  if (sessionError || !session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  
  const { data: answers } = await supabase.from('test_answers').select('*').eq('session_id', sessionId).order('answered_at');
  
  const analysis = { traderType: 'Balanced', riskTolerance: 'Medium', strengthsWeaknesses: { strengths: ['Analytical thinking'], weaknesses: ['Decision speed'] }, recommendations: ['Practice trading', 'Keep journal'] };
  
  await supabase.from('test_sessions').update({ status: 'completed', analysis_result: analysis, completed_at: new Date().toISOString() }).eq('id', sessionId);
  
  return NextResponse.json({ sessionId, analysis, answersCount: answers?.length || 0 });
}
