'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTestStore } from '@/store/testStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Lock, Star, TrendingUp, Brain, Target } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);
  
  const { teaserData, sessionId, paymentStatus: storePaymentStatus } = useTestStore();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paymentParam = searchParams.get('payment');
    
    if (sessionId) {
      setStripeSessionId(sessionId);
      // Verify payment status with backend
      checkPaymentStatus(sessionId);
    }
    
    if (paymentParam === 'cancelled') {
      setPaymentStatus('failed');
    }
  }, [searchParams]);

  const checkPaymentStatus = async (stripeSessionId: string) => {
    try {
      setPaymentStatus('processing');
      
      // In a real implementation, you'd call your backend to verify the payment
      // For now, we'll simulate a successful payment after a delay
      setTimeout(() => {
        setPaymentStatus('success');
      }, 2000);
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('failed');
    }
  };

  const handlePayment = async () => {
    if (!sessionId) return;
    
    try {
      // This would redirect to Stripe Checkout
      // The URL would come from the processResults API call
      window.location.href = '/api/create-payment-session?sessionId=' + sessionId;
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  // Payment success state
  if (paymentStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center shadow-xl border-green-200">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Plata Realizată cu Succes!
            </CardTitle>
            <CardDescription className="text-lg">
              Raportul tău personalizat va fi trimis pe email în câteva minute.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Ce urmează?</h3>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• Raportul PDF complet va fi generat și trimis automat</li>
                <li>• Vei primi un email de confirmare cu raportul atașat</li>
                <li>• Raportul conține analiza detaliată și planul de dezvoltare</li>
                <li>• Păstrează raportul pentru referință viitoare</li>
              </ul>
            </div>
            
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-4">
                Mulțumim pentru încredere! Dacă nu primești email-ul în 10 minute, 
                verifică folderul de spam sau contactează-ne.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Înapoi la Pagina Principală
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment processing state
  if (paymentStatus === 'processing') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Se verifică plata...</h2>
            <p className="text-gray-600">Te rugăm să aștepți câteva secunde.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Payment failed state
  if (paymentStatus === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center border-red-200">
          <CardHeader>
            <CardTitle className="text-xl text-red-800">
              Plata Nu S-a Realizat
            </CardTitle>
            <CardDescription>
              A apărut o problemă cu procesarea plății tale.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Nu îți face griji - rezultatele testului tău sunt salvate în siguranță.
              Poți încerca din nou oricând.
            </p>
            <div className="flex space-x-4 justify-center">
              <Button onClick={handlePayment} className="bg-blue-600 hover:bg-blue-700">
                Încearcă Din Nou
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Înapoi Acasă
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default state - show teaser and payment option
  if (!teaserData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Se încarcă rezultatele...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Testul Tău Este Finalizat!
        </h1>
        <p className="text-xl text-gray-600">
          Iată un preview al rezultatelor tale...
        </p>
      </div>

      {/* Teaser Results */}
      <Card className="mb-8 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="mx-auto mb-4">
            <Brain className="h-16 w-16 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">
            Profilul Tău de Trader
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tipul Tău</h3>
              <p className="text-lg text-blue-600 font-medium">
                {teaserData.archetype}
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Punctul Forte Principal</h3>
              <p className="text-lg text-purple-600 font-medium">
                {teaserData.mainStrength}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locked Content Preview */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-gray-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-700">
              Raportul Complet Conține
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 opacity-75">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Analiza Detaliată a Personalității</h4>
                  <p className="text-sm text-gray-600">
                    Explicații complete despre profilul tău psihologic
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Punctele Forte și Slabe</h4>
                  <p className="text-sm text-gray-600">
                    Identificarea precisă a atuurilor și zonelor de risc
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Analiza Decalajului</h4>
                  <p className="text-sm text-gray-600">
                    Comparația între percepție și realitate
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Recomandări Personalizate</h4>
                  <p className="text-sm text-gray-600">
                    Strategii concrete pentru îmbunătățirea performanței
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Plan de Dezvoltare</h4>
                  <p className="text-sm text-gray-600">
                    Pași concreți pentru următoarele 3-6 luni
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-medium">Stilul Optim de Trading</h4>
                  <p className="text-sm text-gray-600">
                    Recomandări pentru timeframe și strategie
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card className="shadow-xl border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Deblocarea Raportului Complet
          </CardTitle>
          <CardDescription className="text-lg">
            Primești raportul PDF complet pe email imediat după plată
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">49 RON</div>
            <p className="text-gray-600">Plată unică • Fără abonament</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-blue-800 font-medium mb-2">
              🔒 Plată 100% Securizată prin Stripe
            </p>
            <p className="text-sm text-blue-700">
              Garanție de mulțumire • Suport inclus
            </p>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handlePayment}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
            >
              <Lock className="mr-2 h-5 w-5" />
              Deblochează Raportul Complet
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Raportul va fi trimis pe adresa: <strong>{teaserData.archetype}</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}