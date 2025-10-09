import { TestQuestion } from './types';

// Întrebări pentru secțiunea Autoportret
export const autoportretQuestions: TestQuestion[] = [
  {
    id: 'auto_1',
    section: 'autoportret',
    type: 'scale',
    question: 'Cât de disciplinat te consideri în general în viața ta?',
    options: [
      { id: '1', text: 'Deloc disciplinat', value: 1 },
      { id: '2', text: 'Puțin disciplinat', value: 2 },
      { id: '3', text: 'Moderat disciplinat', value: 3 },
      { id: '4', text: 'Destul de disciplinat', value: 4 },
      { id: '5', text: 'Foarte disciplinat', value: 5 }
    ]
  },
  {
    id: 'auto_2',
    section: 'autoportret',
    type: 'single-choice',
    question: 'Când iei o decizie importantă, de obicei:',
    options: [
      { id: 'a', text: 'Analizez toate opțiunile în detaliu înainte de a decide', value: 5 },
      { id: 'b', text: 'Fac o analiză rapidă și decid repede', value: 3 },
      { id: 'c', text: 'Mă bazez pe intuiție și experiența anterioară', value: 2 },
      { id: 'd', text: 'Cer sfatul altora înainte de a decide', value: 1 }
    ]
  },
  {
    id: 'auto_3',
    section: 'autoportret',
    type: 'scale',
    question: 'Cât de bine gestionezi stresul în situații tensionate?',
    options: [
      { id: '1', text: 'Mă panichează complet', value: 1 },
      { id: '2', text: 'Mă afectează semnificativ', value: 2 },
      { id: '3', text: 'Reușesc să rămân relativ calm', value: 3 },
      { id: '4', text: 'Performez bine sub presiune', value: 4 },
      { id: '5', text: 'Stresul mă motivează și mă face să performez mai bine', value: 5 }
    ]
  },
  {
    id: 'auto_4',
    section: 'autoportret',
    type: 'single-choice',
    question: 'Când faci o greșeală importantă:',
    options: [
      { id: 'a', text: 'Analizez ce s-a întâmplat și învăț din greșeală', value: 5 },
      { id: 'b', text: 'Mă simt vinovat/ă pentru o perioadă scurtă, apoi trec peste', value: 3 },
      { id: 'c', text: 'Îmi reproșez mult timp și mă afectează emoțional', value: 1 },
      { id: 'd', text: 'Încerc să găsesc pe altcineva de vină', value: 1 }
    ]
  },
  {
    id: 'auto_5',
    section: 'autoportret',
    type: 'multiple-choice',
    question: 'Care dintre următoarele te descriu cel mai bine? (poți alege mai multe)',
    options: [
      { id: 'a', text: 'Sunt o persoană răbdătoare', value: 4 },
      { id: 'b', text: 'Îmi place să iau riscuri calculate', value: 4 },
      { id: 'c', text: 'Sunt foarte competitiv/ă', value: 2 },
      { id: 'd', text: 'Prefer siguranța la risc', value: 2 },
      { id: 'e', text: 'Sunt foarte emoțional/ă în decizii', value: 1 },
      { id: 'f', text: 'Sunt foarte analitic/ă', value: 5 }
    ]
  }
];

// Întrebări pentru secțiunea Scenarii Decizionale
export const scenariiQuestions: TestQuestion[] = [
  {
    id: 'scen_1',
    section: 'scenarii',
    type: 'single-choice',
    question: 'Ai economisit 10.000 de lei pentru o vacanță de vis. Cu o săptămână înainte de plecare, un prieten apropiat îți propune să investești banii într-o oportunitate de afaceri care promite să îți dubleze suma în 6 luni, dar există riscul să pierzi totul. Ce faci?',
    options: [
      { id: 'a', text: 'Investesc toți banii - oportunitatea pare prea bună să o ratez', value: 1 },
      { id: 'b', text: 'Investesc jumătate și păstrez restul pentru vacanță', value: 3 },
      { id: 'c', text: 'Nu investesc nimic - vacanța este prioritatea mea', value: 2 },
      { id: 'd', text: 'Cer mai multe detalii și analizez oportunitatea în profunzime', value: 5 }
    ]
  },
  {
    id: 'scen_2',
    section: 'scenarii',
    type: 'single-choice',
    question: 'Lucrezi la un proiect important cu deadline în 2 zile. Realizezi că ai făcut o greșeală majoră care îți poate afecta munca de săptămâni întregi. Ce faci?',
    options: [
      { id: 'a', text: 'Lucrez non-stop să repar greșeala, chiar dacă înseamnă să nu dorm', value: 2 },
      { id: 'b', text: 'Încerc să ascund greșeala și să livrez proiectul așa cum este', value: 1 },
      { id: 'c', text: 'Informez imediat șeful despre problemă și cer ajutor', value: 4 },
      { id: 'd', text: 'Evaluez dacă pot repara parțial greșeala în timpul rămas', value: 5 }
    ]
  },
  {
    id: 'scen_3',
    section: 'scenarii',
    type: 'single-choice',
    question: 'Ești la un casino cu 500 de lei pe care ești dispus/ă să îi pierzi. După 30 de minute, ai câștigat 1500 de lei. Ce faci?',
    options: [
      { id: 'a', text: 'Plec imediat cu câștigul - am avut noroc', value: 5 },
      { id: 'b', text: 'Continui să joc cu banii câștigați și păstrez cei 500 inițiali', value: 3 },
      { id: 'c', text: 'Continui să joc cu toți banii - momentul este norocos', value: 1 },
      { id: 'd', text: 'Pun deoparte 1000 lei și joc cu restul', value: 4 }
    ]
  },
  {
    id: 'scen_4',
    section: 'scenarii',
    type: 'single-choice',
    question: 'Ai un job stabil cu un salariu decent, dar nu te împlinește. Primești o ofertă de la o startup cu salariu cu 50% mai mare, dar cu risc de faliment în primul an. Ce faci?',
    options: [
      { id: 'a', text: 'Accept imediat - riscul merită recompensa', value: 2 },
      { id: 'b', text: 'Rămân la job-ul actual - siguranța este mai importantă', value: 2 },
      { id: 'c', text: 'Negociez cu angajatorul actual pentru o mărire', value: 4 },
      { id: 'd', text: 'Cercetez startup-ul în detaliu înainte de a decide', value: 5 }
    ]
  }
];

// Întrebări pentru secțiunea Ateliere Cognitive (Jocuri)
export const cognitiveQuestions: TestQuestion[] = [
  {
    id: 'cog_1',
    section: 'cognitive',
    type: 'cognitive-game',
    question: 'Jocul Riscului Calculat',
    gameConfig: {
      type: 'risk-assessment',
      parameters: {
        initialAmount: 1000,
        rounds: 5,
        options: [
          { risk: 'low', potential: 5, loss: 2 },
          { risk: 'medium', potential: 15, loss: 8 },
          { risk: 'high', potential: 40, loss: 25 }
        ]
      }
    }
  },
  {
    id: 'cog_2',
    section: 'cognitive',
    type: 'cognitive-game',
    question: 'Testul Timpului de Decizie',
    gameConfig: {
      type: 'decision-timing',
      parameters: {
        scenarios: 8,
        timeLimit: 10,
        pressureIncrease: true
      }
    }
  },
  {
    id: 'cog_3',
    section: 'cognitive',
    type: 'cognitive-game',
    question: 'Controlul Emoțional',
    gameConfig: {
      type: 'emotional-control',
      parameters: {
        events: 8,
        stressTypes: ['market_crash', 'profit_euphoria', 'expert_criticism', 'missed_opportunity'],
        measureStability: true,
        emotionalRange: { min: 0, max: 100 },
        initialState: 50
      }
    }
  }
];

export const allQuestions: TestQuestion[] = [
  ...autoportretQuestions,
  ...scenariiQuestions,
  ...cognitiveQuestions
];