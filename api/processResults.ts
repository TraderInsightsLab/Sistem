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
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }

    // Preia sesiunea și toate răspunsurile
    const { data: session, error: sessionError } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { data: answers, error: answersError } = await supabase
      .from('test_answers')
      .select('*')
      .eq('session_id', sessionId)
      .order('answered_at', { ascending: true });

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      return res.status(500).json({ error: 'Failed to fetch answers' });
    }

    // Analiză simplă temporară (va fi înlocuită cu Vertex AI)
    const analysis = {
      traderType: 'Balanced',
      riskTolerance: 'Medium',
      strengthsWeaknesses: {
        strengths: ['Analytical thinking', 'Patience'],
        weaknesses: ['Decision speed under pressure']
      },
      recommendations: [
        'Practice with small positions first',
        'Develop a clear trading plan',
        'Keep a trading journal'
      ]
    };

    // Actualizează sesiunea cu rezultatele
    const { error: updateError } = await supabase
      .from('test_sessions')
      .update({
        status: 'completed',
        analysis_result: analysis,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return res.status(500).json({ error: 'Failed to update session' });
    }

    return res.status(200).json({
      sessionId,
      analysis,
      answersCount: answers.length
    });

  } catch (error) {
    console.error('Error in processResults:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
