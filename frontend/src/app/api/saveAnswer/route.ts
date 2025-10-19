import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || answer === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: sessionId, questionId, answer' 
      });
    }

    // Salvează răspunsul în Supabase
    const { error: answerError } = await supabase
      .from('test_answers')
      .insert([
        {
          session_id: sessionId,
          question_id: questionId,
          answer: answer,
          answered_at: new Date().toISOString()
        }
      ]);

    if (answerError) {
      console.error('Error saving answer:', answerError);
      return res.status(500).json({ error: 'Failed to save answer' });
    }

    // Actualizează indexul curent al sesiunii
    const { data: answers, error: countError } = await supabase
      .from('test_answers')
      .select('id')
      .eq('session_id', sessionId);

    if (countError) {
      console.error('Error counting answers:', countError);
    } else {
      // Update session progress
      await supabase
        .from('test_sessions')
        .update({ current_question_index: answers.length })
        .eq('id', sessionId);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error in saveAnswer:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
