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
      
      setCurrentAmount(prev => Math.max(0, prev + change));
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

  // Emotional Control Game (simplified version)
  return (
    <Card className="p-6">
      <CardContent className="text-center">
        <h3 className="text-lg font-semibold mb-4">Controlul Emoțional</h3>
        <p className="mb-4">Acest test măsoară stabilitatea emoțională sub presiune.</p>
        <Button onClick={() => onComplete({ score: 100, metrics: { stability: 85 } })}>
          Simulează Completarea
        </Button>
      </CardContent>
    </Card>
  );
}