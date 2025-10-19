'use client';

import { useEffect, useState } from 'react';
import { useTestStore } from '@/store/testStore';
import { ProgressBar } from '@/components/ProgressBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestAnswer } from '@/types';

export default function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | number>>({});
  const {
    sessionId,
    questions,
    saveAnswer,
    completeTest,
    isLoading,
    answers
  } = useTestStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !sessionId) {
      const storedSessionId = sessionStorage.getItem('test_sessionId');
      if (!storedSessionId) {
        window.location.href = '/';
      }
    }
  }, [mounted, sessionId]);

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setLocalAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitAll = async () => {
    try {
      // Save all answers
      for (const [questionId, answer] of Object.entries(localAnswers)) {
        const testAnswer: TestAnswer = {
          questionId,
          answer,
          timestamp: Date.now()
        };
        await saveAnswer(testAnswer);
      }
      
      // Complete test
      await completeTest();
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const allAnswered = questions.every(q => localAnswers[q.id] !== undefined);
  const progress = (Object.keys(localAnswers).length / questions.length) * 100;

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Se încarcă aplicația...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Se încarcă testul...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Evaluarea Profilului de Trader
        </h1>
        <ProgressBar progress={progress} />
        <p className="text-sm text-gray-600 mt-2">
          {Object.keys(localAnswers).length} din {questions.length} întrebări răspunse
        </p>
      </div>

      {/* All Questions */}
      <div className="space-y-8">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-2">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    Întrebarea {index + 1}
                  </span>
                  {localAnswers[question.id] !== undefined && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      ✓ Răspuns
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {question.question}
                </h3>
              </div>

              {/* Scale Questions */}
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
                            localAnswers[question.id] === value
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                          onClick={() => handleAnswerChange(question.id, value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Choice Questions */}
              {(question.type === 'single-choice' || question.type === 'multiple-choice') && question.options && (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        localAnswers[question.id] === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAnswerChange(question.id, option.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          localAnswers[question.id] === option.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {localAnswers[question.id] === option.id && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-800">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Game Questions - Show placeholder */}
              {question.type === 'cognitive-game' && (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600 mb-2">{question.description}</p>
                  <p className="text-sm text-gray-500">Timp limită: {question.timeLimit}s</p>
                  <button
                    type="button"
                    className={`mt-4 px-6 py-2 rounded-lg font-medium ${
                      localAnswers[question.id] !== undefined
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => handleAnswerChange(question.id, 'completed')}
                  >
                    {localAnswers[question.id] !== undefined ? '✓ Completat' : 'Începe Jocul'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleSubmitAll}
          disabled={!allAnswered || isLoading}
          className="bg-blue-600 hover:bg-blue-700 px-12 py-3 text-lg"
        >
          {isLoading ? 'Se procesează...' : allAnswered ? 'Trimite Răspunsurile' : `Răspunde la toate întrebările (${Object.keys(localAnswers).length}/${questions.length})`}
        </Button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-center">Se procesează răspunsurile...</p>
          </div>
        </div>
      )}
    </div>
  );
}