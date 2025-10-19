import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const questions = [
  { id: "1", section: "autoportret", type: "scale", question: "Cât de confortabil te simți când iei decizii financiare rapide sub presiune?", scaleMin: 1, scaleMax: 7, scaleMinLabel: "Foarte incomod", scaleMaxLabel: "Foarte confortabil" },
  { id: "2", section: "autoportret", type: "scale", question: "În ce măsură preferi să urmezi un plan structurat față de a improviza?", scaleMin: 1, scaleMax: 7, scaleMinLabel: "Prefer să improvizez", scaleMaxLabel: "Prefer planul structurat" },
  { id: "3", section: "autoportret", type: "choice", question: "Cum reacționezi de obicei la o pierdere financiară neașteptată?", options: [{ id: "a", text: "Devin anxios și regret decizia" }, { id: "b", text: "Analizez ce a mers greșit și ajustez strategia" }, { id: "c", text: "Ignor pierderea și merg mai departe" }] },
  { id: "4", section: "scenarii", type: "choice", question: "Ai investit într-o acțiune care a scăzut cu 15% într-o săptămână. Ce faci?", options: [{ id: "a", text: "Vând imediat pentru a limita pierderile" }, { id: "b", text: "Aștept și monitorizez situația" }, { id: "c", text: "Cumpăr mai mult pentru a reduce prețul mediu" }] },
  { id: "5", section: "scenarii", type: "choice", question: "Piața urcă rapid și toată lumea vorbește despre o anumită acțiune. Cum reacționezi?", options: [{ id: "a", text: "Investesc rapid să nu pierd oportunitatea" }, { id: "b", text: "Fac research detaliat înainte să decid" }, { id: "c", text: "Evit complet - probabil e prea târziu" }] },
  { id: "6", section: "cognitive", type: "game", question: "Pattern Recognition Test", gameType: "pattern", description: "Identifică modelul corect din secvența prezentată.", timeLimit: 30 },
  { id: "7", section: "cognitive", type: "game", question: "Risk Assessment Test", gameType: "risk", description: "Evaluează riscul și recompensa în diferite scenarii.", timeLimit: 45 },
  { id: "8", section: "cognitive", type: "game", question: "Decision Speed Test", gameType: "speed", description: "Ia decizii rapide bazate pe informații limitate.", timeLimit: 60 }
];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userContext } = body;
  if (!userContext?.email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  
  const { data: session, error } = await supabase.from('test_sessions').insert([{
    user_email: userContext.email,
    user_context: userContext,
    status: 'in_progress',
    current_question_index: 0
  }]).select().single();
  
  if (error) return NextResponse.json({ error: 'Failed to create session', details: error.message, code: error.code }, { status: 500 });
  return NextResponse.json({ sessionId: session.id, questions, currentQuestionIndex: 0 });
}
