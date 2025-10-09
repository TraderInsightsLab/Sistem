'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CognitiveGameProps {
  gameConfig: {
    type: 'risk-assessment' | 'decision-timing' | 'emotional-control';
    parameters: Record<string, any>;
  };
  onComplete: (results: { score: number; metrics: Record<string, number> }) => void;
}

export function CognitiveGame({ gameConfig, onComplete }: CognitiveGameProps) {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'completed'>('instructions');
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentRound(1);
  };

  const completeGame = () => {
    const finalResults = {
      score,
      metrics: {
        ...metrics,
        totalTime: Date.now() - startTime,
        averageResponseTime: metrics.totalResponseTime / currentRound || 0
      }
    };
    setGameState('completed');
    onComplete(finalResults);
  };

  // Risk Assessment Game
  if (gameConfig.type === 'risk-assessment') {
    const { initialAmount, rounds, options } = gameConfig.parameters;
    const [currentAmount, setCurrentAmount] = useState(initialAmount);
    const [roundStartTime, setRoundStartTime] = useState(0);

    const makeChoice = (option: any) => {
      const responseTime = Date.now() - roundStartTime;
      const outcome = Math.random() > 0.5 ? 'win' : 'lose';
      const change = outcome === 'win' ? option.potential : -option.loss;
      
      setCurrentAmount((prev: number) => Math.max(0, prev + change));
      setScore(prev => prev + (outcome === 'win' ? option.potential : 0));
      setMetrics(prev => ({
        ...prev,
        totalResponseTime: (prev.totalResponseTime || 0) + responseTime,
        riskLevel: (prev.riskLevel || 0) + (option.risk === 'high' ? 3 : option.risk === 'medium' ? 2 : 1)
      }));

      if (currentRound >= rounds) {
        completeGame();
      } else {
        setCurrentRound(prev => prev + 1);
        setRoundStartTime(Date.now());
      }
    };

    useEffect(() => {
      if (gameState === 'playing' && currentRound > 0) {
        setRoundStartTime(Date.now());
      }
    }, [gameState, currentRound]);

    if (gameState === 'instructions') {
      return (
        <Card className="p-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Jocul Riscului Calculat</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Începi cu {initialAmount} lei virtuali.</p>
              <p>Vei avea {rounds} runde în care poți alege între 3 opțiuni de investiție.</p>
              <p>Fiecare opțiune are un risc și o recompensă diferită.</p>
              <p>Scopul este să îți maximizezi suma finală.</p>
            </div>
            <Button onClick={startGame} className="mt-6">
              Începe Jocul
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (gameState === 'playing') {
      return (
        <Card className="p-6">
          <CardContent>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Runda {currentRound} din {rounds}</h3>
              <p className="text-xl font-bold text-green-600">Suma curentă: {currentAmount} lei</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-center mb-4">Alege o opțiune de investiție:</p>
              {options.map((option: any, index: number) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-gray-50 border-2 hover:border-blue-300"
                  onClick={() => makeChoice(option)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${
                        option.risk === 'high' ? 'text-red-600' : 
                        option.risk === 'medium' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        Risc {option.risk === 'high' ? 'Mare' : option.risk === 'medium' ? 'Mediu' : 'Mic'}
                      </span>
                      <span className="text-sm text-gray-600">
                        +{option.potential} lei / -{option.loss} lei
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <CardContent className="text-center">
          <h3 className="text-lg font-semibold mb-4">Joc Finalizat!</h3>
          <p className="text-xl">Suma finală: {currentAmount} lei</p>
          <p className="text-sm text-gray-600 mt-2">Scor: {score} puncte</p>
        </CardContent>
      </Card>
    );
  }

  // Decision Timing Game
  if (gameConfig.type === 'decision-timing') {
    const [scenario, setScenario] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const scenarios = [
      "O acțiune crește rapid cu 15%. Vinzi acum sau aștepți?",
      "Piața se prăbușește cu 5%. Cumperi mai mult sau ieși?",
      "Ai un profit de 20%. Realizezi profitul sau continui?",
      "Știrile sunt negative pentru sectorul tău. Ieși sau rezisti?",
      "O acțiune pe care o urmărești scade cu 10%. Este moment de cumpărare?",
      "Ai pierderi de 15%. Oprești pierderile sau aștepți?",
      "Piața este foarte volatilă. Reduci poziția sau profiți?",
      "Un expert recomandă vânzarea. Urmezi sfatul sau îți păstrezi părerea?"
    ];

    useEffect(() => {
      if (gameState === 'playing' && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
        // Auto-submit random answer if time runs out
        handleDecision(Math.random() > 0.5 ? 'yes' : 'no', true);
      }
    }, [gameState, timeLeft]);

    const handleDecision = (decision: string, timeout = false) => {
      const responseTime = timeout ? 10000 : (10 - timeLeft) * 1000;
      
      setMetrics(prev => ({
        ...prev,
        totalResponseTime: (prev.totalResponseTime || 0) + responseTime,
        timeouts: (prev.timeouts || 0) + (timeout ? 1 : 0),
        quickDecisions: (prev.quickDecisions || 0) + (responseTime < 3000 ? 1 : 0)
      }));

      if (scenario >= scenarios.length - 1) {
        completeGame();
      } else {
        setScenario(prev => prev + 1);
        setTimeLeft(10);
      }
    };

    if (gameState === 'instructions') {
      return (
        <Card className="p-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Testul Timpului de Decizie</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Vei vedea 8 scenarii de trading diferite.</p>
              <p>Pentru fiecare ai 10 secunde să iei o decizie.</p>
              <p>Răspunde rapid și instinctiv - primul impuls contează!</p>
            </div>
            <Button onClick={startGame} className="mt-6">
              Începe Testul
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (gameState === 'playing') {
      return (
        <Card className="p-6">
          <CardContent>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Scenariul {scenario + 1} din {scenarios.length}</h3>
              <div className="text-2xl font-bold text-red-600">
                {timeLeft}s
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-lg">{scenarios[scenario]}</p>
            </div>
            
            <div className="flex space-x-4 justify-center">
              <Button
                onClick={() => handleDecision('yes')}
                className="bg-green-600 hover:bg-green-700"
              >
                Da / Acționez
              </Button>
              <Button
                onClick={() => handleDecision('no')}
                className="bg-red-600 hover:bg-red-700"
              >
                Nu / Aștept
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <CardContent className="text-center">
          <h3 className="text-lg font-semibold mb-4">Test Finalizat!</h3>
          <p>Timpul mediu de răspuns: {Math.round(metrics.averageResponseTime || 0)}ms</p>
          <p className="text-sm text-gray-600 mt-2">
            Decizii rapide: {metrics.quickDecisions || 0} din {scenarios.length}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Emotional Control Game
  if (gameConfig.type === 'emotional-control') {
    const [phase, setPhase] = useState(0);
    const [emotionalState, setEmotionalState] = useState(50); // 0-100 scale
    const [reactions, setReactions] = useState<number[]>([]);
    const [currentEvent, setCurrentEvent] = useState('');
    const [phaseStartTime, setPhaseStartTime] = useState(0);
    
    const stressEvents = [
      { text: "Ai pierdut 20% din portofoliu într-o zi!", impact: -15, type: 'negative' },
      { text: "O investiție a crescut cu 50% peste noapte!", impact: 10, type: 'positive' },
      { text: "Piața se prăbușește! Toți indicii sunt în roșu!", impact: -20, type: 'negative' },
      { text: "Breaking News: Criză bancară globală!", impact: -25, type: 'negative' },
      { text: "Ai ratat o oportunitate uriașă de profit!", impact: -10, type: 'regret' },
      { text: "Profitul tău anual este de 3x peste așteptări!", impact: 15, type: 'positive' },
      { text: "Un expert celebru critică strategia ta!", impact: -12, type: 'negative' },
      { text: "Clientul tău cel mai mare se retrage!", impact: -18, type: 'negative' }
    ];

    useEffect(() => {
      if (gameState === 'playing' && phase < stressEvents.length) {
        setPhaseStartTime(Date.now());
        setCurrentEvent(stressEvents[phase].text);
        
        // Apply emotional impact after 2 seconds
        const impactTimer = setTimeout(() => {
          const event = stressEvents[phase];
          setEmotionalState(prev => Math.max(0, Math.min(100, prev + event.impact)));
        }, 2000);

        // Auto-advance after 8 seconds if no reaction
        const autoTimer = setTimeout(() => {
          handleReaction('no-reaction');
        }, 8000);

        return () => {
          clearTimeout(impactTimer);
          clearTimeout(autoTimer);
        };
      } else if (phase >= stressEvents.length && gameState === 'playing') {
        completeEmotionalGame();
      }
    }, [gameState, phase]);

    const handleReaction = (reactionType: 'calm' | 'stressed' | 'panic' | 'no-reaction') => {
      const reactionTime = Date.now() - phaseStartTime;
      const reactionScore = {
        'calm': 5,
        'stressed': 3,
        'panic': 1,
        'no-reaction': 2
      }[reactionType];

      setReactions(prev => [...prev, reactionScore]);
      setScore(prev => prev + reactionScore);
      
      // Adjust emotional state based on reaction
      const stateAdjustment = {
        'calm': 5,
        'stressed': -2,
        'panic': -5,
        'no-reaction': -1
      }[reactionType];
      
      setEmotionalState(prev => Math.max(0, Math.min(100, prev + stateAdjustment)));
      
      setMetrics(prev => ({
        ...prev,
        totalResponseTime: (prev.totalResponseTime || 0) + reactionTime,
        emotionalStability: emotionalState,
        panicReactions: (prev.panicReactions || 0) + (reactionType === 'panic' ? 1 : 0),
        calmReactions: (prev.calmReactions || 0) + (reactionType === 'calm' ? 1 : 0),
        averageEmotionalState: (prev.averageEmotionalState || 50) * 0.9 + emotionalState * 0.1
      }));

      setPhase(prev => prev + 1);
    };

    const completeEmotionalGame = () => {
      const finalScore = reactions.reduce((sum, r) => sum + r, 0);
      const stability = Math.round((reactions.filter(r => r >= 4).length / reactions.length) * 100);
      
      setMetrics(prev => ({
        ...prev,
        finalEmotionalState: emotionalState,
        stabilityPercentage: stability,
        totalScore: finalScore
      }));
      
      setScore(finalScore);
      completeGame();
    };

    if (gameState === 'instructions') {
      return (
        <Card className="p-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Testul Controlului Emoțional</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Vei fi expus la 8 evenimente stresante din lumea tradingului.</p>
              <p>Pentru fiecare eveniment, alege cum reacționezi emotional.</p>
              <p>Testul măsoară stabilitatea ta sub presiune continuă.</p>
              <p>Nu există răspunsuri greșite - fii sincer cu reacțiile tale!</p>
            </div>
            <Button onClick={startGame} className="mt-6">
              Începe Testul
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (gameState === 'playing') {
      const emotionalColor = emotionalState > 70 ? 'text-green-600' : 
                           emotionalState > 40 ? 'text-yellow-600' : 'text-red-600';
      
      return (
        <Card className="p-6">
          <CardContent>
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Evenimentul {phase + 1} din {stressEvents.length}</h3>
              <div className="mt-2">
                <div className="text-sm text-gray-600">Starea emoțională</div>
                <div className={`text-xl font-bold ${emotionalColor}`}>
                  {emotionalState}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      emotionalState > 70 ? 'bg-green-500' : 
                      emotionalState > 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${emotionalState}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-lg font-medium">{currentEvent}</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600 mb-4">
                Cum reacționezi la această situație?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleReaction('calm')}
                  className="bg-green-600 hover:bg-green-700 h-auto py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">😌 Calm</div>
                    <div className="text-xs">Analizez obiectiv</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleReaction('stressed')}
                  className="bg-yellow-600 hover:bg-yellow-700 h-auto py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">😰 Stresat</div>
                    <div className="text-xs">Mă afectează moderat</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleReaction('panic')}
                  className="bg-red-600 hover:bg-red-700 h-auto py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">😱 Panică</div>
                    <div className="text-xs">Mă copleșește</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleReaction('no-reaction')}
                  variant="outline"
                  className="h-auto py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">😐 Neutru</div>
                    <div className="text-xs">Nu mă afectează</div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <CardContent className="text-center">
          <h3 className="text-lg font-semibold mb-4">Test Finalizat!</h3>
          <div className="space-y-2">
            <p className="text-xl">Stabilitate emoțională: {metrics.stabilityPercentage}%</p>
            <p className="text-sm text-gray-600">
              Reacții calme: {metrics.calmReactions || 0} din {stressEvents.length}
            </p>
            <p className="text-sm text-gray-600">
              Stare finală: {emotionalState}/100
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback for unknown game types
  return (
    <Card className="p-6">
      <CardContent className="text-center">
        <h3 className="text-lg font-semibold mb-4">Tip de joc necunoscut</h3>
        <p className="mb-4">Nu pot rula acest tip de test: {gameConfig.type}</p>
        <Button onClick={() => onComplete({ score: 0, metrics: { error: 1 } })}>
          Sari peste
        </Button>
      </CardContent>
    </Card>
  );
}