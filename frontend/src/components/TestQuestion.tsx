'use client';

import { useState } from 'react';
import { useTestStore } from '@/store/testStore';
import { TestQuestion as TestQuestionType, TestAnswer } from '../../shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CognitiveGame } from '@/components/CognitiveGame';

interface TestQuestionProps {
  question: TestQuestionType;
  onAnswerSubmit: () => void;
}

export function TestQuestion({ question, onAnswerSubmit }: TestQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | string[]>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveAnswer } = useTestStore();

  const handleAnswerChange = (value: string | number | string[]) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const answer: TestAnswer = {
        questionId: question.id,
        answer: selectedAnswer,
        timestamp: Date.now(),
        responseTime: Date.now() - (window as any).questionStartTime || 0
      };

      await saveAnswer(answer);
      onAnswerSubmit();
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set question start time for response time tracking
  if (!(window as any).questionStartTime) {
    (window as any).questionStartTime = Date.now();
  }

  // Handle cognitive games differently
  if (question.type === 'cognitive-game') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
          <p className="text-gray-600 mb-6">
            Acest joc interactiv măsoară reacțiile tale în timp real. 
            Urmează instrucțiunile și fii natural în răspunsuri.
          </p>
        </div>
        
        <CognitiveGame
          gameConfig={question.gameConfig!}
          onComplete={(results) => {
            const answer: TestAnswer = {
              questionId: question.id,
              answer: 'completed',
              timestamp: Date.now(),
              responseTime: Date.now() - (window as any).questionStartTime || 0,
              gameResults: results
            };
            
            saveAnswer(answer).then(() => {
              onAnswerSubmit();
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      </div>

      <div className="space-y-3">
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAnswerChange(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                      selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{option.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => {
              const currentSelections = Array.isArray(selectedAnswer) ? selectedAnswer : [];
              const isSelected = currentSelections.includes(option.id);
              
              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const newSelections = isSelected
                      ? currentSelections.filter(id => id !== option.id)
                      : [...currentSelections, option.id];
                    handleAnswerChange(newSelections);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-4 h-4 border-2 mt-0.5 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{option.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <p className="text-sm text-gray-500 mt-2">
              Poți selecta mai multe opțiuni
            </p>
          </div>
        )}

        {question.type === 'scale' && question.options && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedAnswer === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAnswerChange(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{option.text}</span>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        selectedAnswer === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === option.value && (
                          <div className="w-3 h-3 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {question.type !== 'cognitive-game' && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
          >
            {isSubmitting ? 'Se salvează...' : 'Confirmă Răspunsul'}
          </Button>
        </div>
      )}
    </div>
  );
}