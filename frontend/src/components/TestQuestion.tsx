'use client';

import { useState } from 'react';
import { useTestStore } from '@/store/testStore';
import { TestQuestion as TestQuestionType, TestAnswer } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
        timestamp: Date.now()
      };

      await saveAnswer(answer);
      onAnswerSubmit();
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      </div>

      <div className="space-y-3">
        {question.type === 'single' && question.options && (
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all border-2 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAnswerChange(option)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === option && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{option}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {question.type === 'multiple' && question.options && (
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => {
              const currentSelections = Array.isArray(selectedAnswer) ? selectedAnswer : [];
              const isSelected = currentSelections.includes(option);
              
              return (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const newSelections = isSelected
                      ? currentSelections.filter(id => id !== option)
                      : [...currentSelections, option];
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
                        <p className="text-gray-800">{option}</p>
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

        {question.type === 'scale' && question.scaleMin && question.scaleMax && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{question.scaleLabels?.min || question.scaleMin}</span>
              <span>{question.scaleLabels?.max || question.scaleMax}</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: question.scaleMax - question.scaleMin + 1 }, (_, i) => {
                const value = question.scaleMin! + i;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedAnswer === value
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    onClick={() => handleAnswerChange(value)}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
        >
          {isSubmitting ? 'Se salvează...' : 'Confirmă Răspunsul'}
        </Button>
      </div>
    </div>
  );
}