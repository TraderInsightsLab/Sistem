import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 8 întrebări definitive (sursa de adevăr)
const questions = [
  {
    id: "1",
    section: "autoportret",
    type: "scale",
    question: "Cât de confortabil te simți când iei decizii financiare rapide sub presiune?",
    scaleMin: 1,
    scaleMax: 7,
    scaleMinLabel: "Foarte incomod",
    scaleMaxLabel: "Foarte confortabil"
  },
  {
    id: "2",
    section: "autoportret",
    type: "scale",
    question: "În ce măsură preferi să urmezi un plan structurat față de a improviza?",
    scaleMin: 1,
    scaleMax: 7,
    scaleMinLabel: "Prefer să improvizez",
    scaleMaxLabel: "Prefer planul structurat"
  },
  {
    id: "3",
    section: "autoportret",
    type: "choice",
    question: "Cum reacționezi de obicei la o pierdere financiară neașteptată?",
    options: [
      { id: "a", text: "Devin anxios și regret decizia" },
      { id: "b", text: "Analizez ce a mers greșit și ajustez strategia" },
      { id: "c", text: "Ignor pierderea și merg mai departe" }
    ]
  },
  {
    id: "4",
    section: "scenarii",
    type: "choice",
    question: "Ai investit într-o acțiune care a scăzut cu 15% într-o săptămână. Ce faci?",
    options: [
      { id: "a", text: "Vând imediat pentru a limita pierderile" },
      { id: "b", text: "Aștept și monitorizez situația" },
      { id: "c", text: "Cumpăr mai mult pentru a reduce prețul mediu" }
    ]
  },
  {
    id: "5",
    section: "scenarii",
    type: "choice",
    question: "Piața urcă rapid și toată lumea vorbește despre o anumită acțiune. Cum reacționezi?",
    options: [
      { id: "a", text: "Investesc rapid să nu pierd oportunitatea" },
      { id: "b", text: "Fac research detaliat înainte să decid" },
      { id: "c", text: "Evit complet - probabil e prea târziu" }
    ]
  },
  {
    id: "6",
    section: "cognitive",
    type: "game",
    question: "Pattern Recognition Test",
    gameType: "pattern",
    description: "Identifică modelul corect din secvența prezentată.",
    timeLimit: 30
  },
  {
    id: "7",
    section: "cognitive",
    type: "game",
    question: "Risk Assessment Test",
    gameType: "risk",
    description: "Evaluează riscul și recompensa în diferite scenarii.",
    timeLimit: 45
  },
  {
    id: "8",
    section: "cognitive",
    type: "game",
    question: "Decision Speed Test",
    gameType: "speed",
    description: "Ia decizii rapide bazate pe informații limitate.",
    timeLimit: 60
  }
];

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
    const { userContext } = req.body;

    if (!userContext || !userContext.email) {
      return res.status(400).json({ error: 'Email required in userContext' });
    }

    // Creează sesiune nouă în Supabase
    const { data: session, error: sessionError } = await supabase
      .from('test_sessions')
      .insert([
        {
          email: userContext.email,
          user_context: userContext,
          status: 'in_progress',
          current_question_index: 0,
          total_questions: questions.length
        }
      ])
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({ error: 'Failed to create test session' });
    }

    return res.status(200).json({
      sessionId: session.id,
      questions: questions,
      currentQuestionIndex: 0
    });

  } catch (error) {
    console.error('Error in startTest:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
