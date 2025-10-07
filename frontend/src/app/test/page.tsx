'use client';

import { useEffect } from 'react';
import { useTestStore } from '@/store/testStore';
import { TestQuestion } from '@/components/TestQuestion';
import { ProgressBar } from '@/components/ProgressBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function TestPage() {
  const {
    sessionId,
    getCurrentQuestion,
    getProgress,
    canGoNext,
    canGoPrevious,
    nextQuestion,
    previousQuestion,
    completeTest,
    isLoading,
    currentQuestionIndex,
    questions
  } = useTestStore();

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    // Redirect to home if no active session
    if (!sessionId) {
      window.location.href = '/';
    }
  }, [sessionId]);

  const handleNext = () => {
    if (isLastQuestion) {
      completeTest();
    } else {
      nextQuestion();
    }
  };

  if (!sessionId || !currentQuestion) {
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
          Întrebarea {currentQuestionIndex + 1} din {questions.length}
        </p>
      </div>

      {/* Question Content */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <TestQuestion
            question={currentQuestion}
            onAnswerSubmit={() => {
              // Answer submission is handled within TestQuestion component
              // This callback is for any additional UI updates
            }}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={previousQuestion}
          disabled={!canGoPrevious() || isLoading}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {currentQuestion.section === 'autoportret' && 'Secțiunea: Autoportret'}
            {currentQuestion.section === 'scenarii' && 'Secțiunea: Scenarii Decizionale'}
            {currentQuestion.section === 'cognitive' && 'Secțiunea: Ateliere Cognitive'}
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canGoNext() || isLoading}
          className="flex items-center bg-blue-600 hover:bg-blue-700"
        >
          {isLastQuestion ? 'Finalizează Testul' : 'Următoarea'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Section Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          {currentQuestion.section === 'autoportret' && (
            <p>
              <strong>Autoportret:</strong> Întrebări despre cum te percepi și cum reacționezi în general.
              Fii sincer - nu există răspunsuri corecte sau greșite.
            </p>
          )}
          {currentQuestion.section === 'scenarii' && (
            <p>
              <strong>Scenarii Decizionale:</strong> Situații din viața reală care ne ajută să înțelegem 
              stilul tău de decizie și toleranța la risc.
            </p>
          )}
          {currentQuestion.section === 'cognitive' && (
            <p>
              <strong>Ateliere Cognitive:</strong> Jocuri interactive care măsoară reacțiile tale 
              în timp real și sub presiune.
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-center">Se procesează răspunsul...</p>
          </div>
        </div>
      )}
    </div>
  );
}