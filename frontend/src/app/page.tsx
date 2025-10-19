'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingForm } from '@/components/OnboardingForm';
import { useTestStore } from '@/store/testStore';
import { Brain, Target, Shield, TrendingUp, Users, Star } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeTest } = useTestStore();

  const handleStartTest = () => {
    setShowOnboarding(true);
    setError(null);
  };

  const handleOnboardingComplete = async (userContext: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📝 Starting test initialization...');
      await initializeTest(userContext);
      
      // Double-check sessionStorage before redirecting
      const sessionId = sessionStorage.getItem('test_sessionId');
      const questions = sessionStorage.getItem('test_questions');
      
      console.log('🔍 Verification before redirect:', {
        sessionId: sessionId,
        questionsCount: questions ? JSON.parse(questions).length : 0,
        hasUserContext: !!sessionStorage.getItem('test_userContext'),
      });
      
      if (!sessionId) {
        throw new Error('Session not saved properly');
      }
      
      console.log('🚀 Redirecting to test page...');
      
      // Use Next.js router for client-side navigation
      router.push('/test');
    } catch (error) {
      console.error('❌ Failed to initialize test:', error);
      setError('Nu am putut iniția testul. Te rog încearcă din nou.');
      setIsLoading(false);
    }
  };

  if (showOnboarding) {
    return (
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}
        <OnboardingForm 
          onComplete={handleOnboardingComplete} 
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Descoperă-ți Profilul Psihologic de
            <span className="text-blue-600"> Trader</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Analiză AI avansată care îți relevă punctele forte, slăbiciunile și 
            recomandările personalizate pentru a deveni un trader mai disciplinat și profitabil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleStartTest}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Brain className="mr-2 h-5 w-5" />
              Începe Testul Gratuit
            </Button>
            <p className="text-sm text-gray-500">
              Plată doar după ce vezi rezultatele
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 rounded-3xl mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            De Ce TraderInsightsLab?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Evaluare Fără Jargon</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Nu folosim scenarii de trading complexe. Testul se bazează pe situații din viața reală 
                  și jocuri cognitive, accesibile oricui.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Analiza Decalajului</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comparam cine crezi că ești cu cine demonstrezi că ești prin acțiuni, 
                  revelând puncte oarbe critice.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Recomandări Acționabile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Raportul conține un plan concret de dezvoltare personală cu pași 
                  specifici pentru îmbunătățirea disciplinei.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Cum Funcționează
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Completezi Testul</h3>
              <p className="text-gray-600">
                15-20 minute de întrebări simple și jocuri cognitive interactive.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiză AI</h3>
              <p className="text-gray-600">
                Inteligența artificială analizează răspunsurile și identifică profilul tău.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Raport Personalizat</h3>
              <p className="text-gray-600">
                Primești un raport PDF detaliat cu recomandări concrete și plan de acțiune.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ce Spun Traderii
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Am realizat că eram mult prea impulsiv în decizii. Raportul mi-a dat 
                  un plan concret pentru a-mi îmbunătăți disciplina."
                </p>
                <p className="font-semibold">- Andrei M., Trader</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Cel mai exact test psihologic pe care l-am făcut. M-a ajutat să înțeleg 
                  de ce pierdiam bani pe piețele volatile."
                </p>
                <p className="font-semibold">- Maria T., Investitoare</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gata să-ți Descoperi Profilul de Trader?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Începe testul acum și află ce tip de trader ești cu adevărat.
          </p>
          <Button 
            onClick={handleStartTest}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
          >
            <Brain className="mr-2 h-5 w-5" />
            Începe Testul Gratuit
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Fără risc • Plată doar după rezultate • Garanție de mulțumire
          </p>
        </div>
      </section>
    </div>
  );
}