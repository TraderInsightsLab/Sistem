import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  const { sessionId, questionId, answer } = await request.json();
  if (!sessionId || !questionId || answer === undefined) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  
  const { error } = await supabase.from('test_answers').insert([{ session_id: sessionId, question_id: questionId, answer, answered_at: new Date().toISOString() }]);
  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  
  const { data: answers } = await supabase.from('test_answers').select('id').eq('session_id', sessionId);
  if (answers) await supabase.from('test_sessions').update({ current_question_index: answers.length }).eq('id', sessionId);
  
  return NextResponse.json({ success: true });
}
