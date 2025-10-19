import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  
  const { data: session, error: sessionError } = await supabase.from('test_sessions').select('*').eq('id', sessionId).single();
  if (sessionError || !session) {
    console.error('Session error:', sessionError);
    return NextResponse.json({ error: 'Session not found', details: sessionError?.message }, { status: 404 });
  }
  
  const { data: answers, error: answersError } = await supabase.from('test_answers').select('*').eq('session_id', sessionId).order('created_at');
  
  if (answersError) {
    console.error('Answers error:', answersError);
  }
  
  // Temporary hardcoded analysis
  const analysis = { 
    traderType: 'Balanced', 
    riskTolerance: 'Medium', 
    strengthsWeaknesses: { 
      strengths: ['Analytical thinking', 'Risk management'], 
      weaknesses: ['Decision speed under pressure'] 
    }, 
    recommendations: ['Practice paper trading', 'Keep a trading journal', 'Focus on risk management'] 
  };
  
  await supabase.from('test_sessions').update({ 
    status: 'completed', 
    completed_at: new Date().toISOString() 
  }).eq('id', sessionId);
  
  return NextResponse.json({ sessionId, analysis, answersCount: answers?.length || 0 });
}
