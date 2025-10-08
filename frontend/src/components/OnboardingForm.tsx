'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserContext } from '../types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingFormProps {
  onComplete: (userContext: UserContext) => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserContext>>({
    experienceLevel: 'beginner',
    tradingGoals: [],
    preferredMarkets: [],
    riskTolerance: 'medium'
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (formData.email && formData.age && 
        formData.experienceLevel && formData.riskTolerance) {
      onComplete(formData as UserContext);
    }
  };

  const updateFormData = (field: keyof UserContext, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'tradingGoals' | 'preferredMarkets', item: string) => {
    const currentArray = formData[field] || [];
    const updatedArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(field, updatedArray);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Să te cunoaștem mai bine</CardTitle>
          <CardDescription>
            Aceste informații ne ajută să personalizăm analiza pentru tine
          </CardDescription>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Pasul {step} din {totalSteps}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informații de contact</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Adresa de email</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="exemplu@email.com"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Vei primi raportul pe această adresă
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vârsta</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25"
                  min="18"
                  max="100"
                  value={formData.age || ''}
                  onChange={(e) => updateFormData('age', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Experiența ta în trading</h3>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Începător', desc: 'Am puțină sau deloc experiență' },
                  { value: 'intermediate', label: 'Intermediar', desc: 'Am câteva luni sau ani de experiență' },
                  { value: 'advanced', label: 'Avansat', desc: 'Am mulți ani de experiență și rezultate constante' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.experienceLevel === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('experienceLevel', option.value)}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Toleranța la risc</h3>
              <div className="space-y-3">
                {[
                  { value: 'low', label: 'Conservator', desc: 'Prefer siguranța și evit riscurile mari' },
                  { value: 'medium', label: 'Moderat', desc: 'Accept riscuri calculate pentru randamente mai mari' },
                  { value: 'high', label: 'Agresiv', desc: 'Sunt dispus să risc mult pentru profituri mari' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.riskTolerance === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('riskTolerance', option.value)}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Obiectivele tale în trading (poți selecta mai multe)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Venit suplimentar',
                  'Venit principal',
                  'Investiții pe termen lung',
                  'Speculații pe termen scurt',
                  'Învățare și experiență',
                  'Libertate financiară'
                ].map((goal) => (
                  <div
                    key={goal}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                      formData.tradingGoals?.includes(goal)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleArrayItem('tradingGoals', goal)}
                  >
                    {goal}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Piețe de interes (poți selecta mai multe)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Acțiuni românești',
                  'Acțiuni internaționale',
                  'Forex',
                  'Crypto',
                  'Commodities',
                  'Indici',
                  'ETF-uri',
                  'Opțiuni'
                ].map((market) => (
                  <div
                    key={market}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                      formData.preferredMarkets?.includes(market)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleArrayItem('preferredMarkets', market)}
                  >
                    {market}
                  </div>
                ))}
              </div>
              <div className="bg-green-50 p-4 rounded-lg mt-6">
                <h4 className="font-semibold text-green-800 mb-2">Gata de început!</h4>
                <p className="text-green-700 text-sm">
                  Testul va dura aproximativ 15-20 de minute și constă în întrebări simple și jocuri interactive.
                  Nu există răspunsuri corecte sau greșite - fii sincer pentru cea mai precisă analiză.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              onClick={handlePrevious}
              disabled={step === 1}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.email || !formData.age)) ||
                  (step === 2 && !formData.experienceLevel) ||
                  (step === 3 && !formData.riskTolerance)
                }
                className="flex items-center"
              >
                Următorul
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!formData.email || !formData.age || !formData.experienceLevel || !formData.riskTolerance}
                className="bg-green-600 hover:bg-green-700 flex items-center"
              >
                Începe Testul
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}