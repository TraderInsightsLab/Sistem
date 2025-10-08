// Întrebări pentru testul de evaluare psihologică TraderInsightsLab
import { TestQuestion } from '../types';

// Secțiunea Autoportret
export const autoportretQuestions: TestQuestion[] = [
  {
    id: 'auto_1',
    section: 'autoportret',
    type: 'scale',
    question: 'Cât de confortabil te simți atunci când iei decizii rapide sub presiune?',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: { min: 'Foarte incomod', max: 'Foarte confortabil' }
  },
  {
    id: 'auto_2',
    section: 'autoportret',
    type: 'single',
    question: 'Când faci o investiție care înregistrează o pierdere de 10%, prima ta reacție este:',
    options: [
      'Vând imediat pentru a limita pierderile',
      'Aștept și analizez situația',
      'Investesc mai mult pentru a reduce prețul mediu',
      'Îmi recalculez strategia complet',
      'Consult alte surse pentru a lua o decizie'
    ]
  },
  {
    id: 'auto_3',
    section: 'autoportret',
    type: 'scale',
    question: 'Cât de mult îți place să analizezi grafice și indicatori tehnici?',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: { min: 'Deloc', max: 'Foarte mult' }
  },
  {
    id: 'auto_4',
    section: 'autoportret',
    type: 'multiple',
    question: 'Ce emoții experimentezi cel mai des când tradezi?',
    options: [
      'Entuziasm și excitare',
      'Anxietate și stres',
      'Concentrare și calm',
      'Frustrare la pierderi',
      'Satisfacție la câștiguri',
      'Incertitudine'
    ]
  },
  {
    id: 'auto_5',
    section: 'autoportret',
    type: 'scale',
    question: 'Cât de disciplinat ești în respectarea strategiei tale de trading?',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: { min: 'Deloc disciplinat', max: 'Foarte disciplinat' }
  }
];

// Secțiunea Scenarii Decizionale
export const scenariiQuestions: TestQuestion[] = [
  {
    id: 'scen_1',
    section: 'scenarii',
    type: 'single',
    question: 'Ai o poziție profitabilă de +15%. Piața începe să se corecteze. Ce faci?',
    options: [
      'Vând 50% din poziție pentru a securiza profitul',
      'Vând totul - profitul e profit',
      'Țin poziția și pun stop-loss la +10%',
      'Țin poziția complet - trendul va continua',
      'Analizez volumul și momentum-ul înainte să decid'
    ]
  },
  {
    id: 'scen_2',
    section: 'scenarii',
    type: 'single',
    question: 'Pierzi 3 trade-uri consecutive, fiecare cu -5%. Următoarea oportunitate pare excelentă. Ce faci?',
    options: [
      'Fac o pauză și analizez ce a mers greșit',
      'Reduc size-ul poziției la jumătate',
      'Tradez normal - pierderile fac parte din joc',
      'Măresc poziția pentru a recupera pierderile',
      'Schimb complet strategia'
    ]
  },
  {
    id: 'scen_3',
    section: 'scenarii',
    type: 'single',
    question: 'O știre majoră apare în timpul unei poziții deschise. Piața devine extrem de volatilă. Reacția ta?',
    options: [
      'Închid imediat poziția indiferent de rezultat',
      'Reduc size-ul poziției cu 50%',
      'Țin poziția dar urmăresc îndeaproape',
      'Folosesc volatilitatea pentru a mări poziția',
      'Verific rapid impactul știrii înainte să decid'
    ]
  },
  {
    id: 'scen_4',
    section: 'scenarii',
    type: 'scale',
    question: 'Cât de dispus ești să riști 20% din contul de trading pe o singură poziție foarte promițătoare?',
    scaleMin: 1,
    scaleMax: 7,
    scaleLabels: { min: 'Niciodată', max: 'Foarte dispus' }
  },
  {
    id: 'scen_5',
    section: 'scenarii',
    type: 'single',
    question: 'Ai câștigat 40% în prima jumătate de an. Cum abordezi a doua jumătate?',
    options: [
      'Continui cu aceeași strategie',
      'Devin mai conservator pentru a păstra câștigurile',
      'Măresc size-ul poziției pentru mai mult profit',
      'Extrag o parte din profit și tradez cu restul',
      'Încerc strategii noi pentru diversificare'
    ]
  }
];

// Secțiunea Ateliere Cognitive
export const cognitiveQuestions: TestQuestion[] = [
  {
    id: 'cog_1',
    section: 'cognitive',
    type: 'cognitive',
    question: 'Test de Reacție: Apasă cât mai rapid când vezi culoarea verde',
    cognitiveType: 'reaction'
  },
  {
    id: 'cog_2',
    section: 'cognitive',
    type: 'cognitive',
    question: 'Test de Pattern: Identifică următorul element în secvență',
    cognitiveType: 'pattern'
  },
  {
    id: 'cog_3',
    section: 'cognitive',
    type: 'cognitive',
    question: 'Test de Memorie: Memorează și reproduce secvența de numere',
    cognitiveType: 'memory'
  },
  {
    id: 'cog_4',
    section: 'cognitive',
    type: 'cognitive',
    question: 'Test de Decizie: Alege opțiunea optimă în timp limitat',
    cognitiveType: 'decision'
  }
];

// Toate întrebările
export const allQuestions: TestQuestion[] = [
  ...autoportretQuestions,
  ...scenariiQuestions,
  ...cognitiveQuestions
];

// Helper functions
export const getQuestionsBySection = (section: 'autoportret' | 'scenarii' | 'cognitive'): TestQuestion[] => {
  return allQuestions.filter(q => q.section === section);
};

export const getQuestionById = (id: string): TestQuestion | undefined => {
  return allQuestions.find(q => q.id === id);
};