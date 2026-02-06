'use client';

import { useState } from 'react';
import EssayForm from '@/components/EssayForm';
import LoadingScreen from '@/components/LoadingScreen';
import EssayDisplay from '@/components/EssayDisplay';

export default function Home() {
  const [step, setStep] = useState<'hero' | 'form' | 'loading' | 'result'>('hero');
  const [essayData, setEssayData] = useState<any>(null);

  const startWriting = () => {
    setStep('form');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleGenerate = async (data: any) => {
    setEssayData(data);
    setStep('loading');
  };

  const handleComplete = () => {
    setStep('result');
  };

  const handleReset = () => {
    setStep('form');
    setEssayData(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {step === 'hero' && (
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-full mb-8">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Trusted by 15,000+ students worldwide</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Get Admissions Essays
                <br />
                <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
                  That Stand Out
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
                Human-quality writing in minutes, not weeks.
              </p>

              <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6 mb-10 max-w-3xl mx-auto">
                <p className="text-lg text-gray-800 leading-relaxed text-center">
                  Professional, plagiarism-free essays that impress admissions officers.
                  <br className="hidden sm:block" />
                  Tailored to your story. Written in your voice.
                </p>
              </div>

              <div className="flex justify-center mb-12">
                <button
                  onClick={startWriting}
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-5 rounded-xl text-lg font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-2xl"
                >
                  Start Now - FREE →
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="font-semibold">100% Human Quality</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="font-semibold">0% Plagiarism</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="font-semibold">AI Undetectable</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="font-semibold">Ready in Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {step === 'form' && (
        <div className="pt-24 pb-20 px-4 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <EssayForm onGenerate={handleGenerate} />
          </div>
        </div>
      )}

      {step === 'loading' && essayData && (
        <LoadingScreen data={essayData} onComplete={handleComplete} />
      )}

      {step === 'result' && essayData && (
        <div className="pt-24 pb-20 px-4 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <EssayDisplay data={essayData} onReset={handleReset} />
          </div>
        </div>
      )}
    </main>
  );
}
