'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  data: any;
  onComplete: (result: any) => void;
}

const loadingMessages = [
  { emoji: '📄', text: 'Reading your background...', progress: 0 },
  { emoji: '🧠', text: 'Analyzing your story...', progress: 20 },
  { emoji: '🎯', text: 'Matching with program goals...', progress: 40 },
  { emoji: '✍️', text: 'Writing your essay...', progress: 60 },
  { emoji: '✨', text: 'Almost done...', progress: 80 },
];

export default function LoadingScreen({ data, onComplete }: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [essayResult, setEssayResult] = useState<any>(null);

  useEffect(() => {
    // Start API call immediately
    generateEssay();

    // Update progress messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 10000); // Change message every 10 seconds

    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200); // Reach ~95% in about 2 minutes

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    // When essay is ready, complete to 100% and transition
    if (essayResult) {
      setProgress(100);
      setTimeout(() => {
        onComplete(essayResult); // Pass the API result!
      }, 500);
    }
  }, [essayResult, onComplete]);

  const generateEssay = async () => {
    try {
      const formData = new FormData();
      
      // Add all data fields to FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key].toString());
        }
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to generate essay: ${response.status}`);
      }

      const result = await response.json();
      console.log('Essay generation successful:', result);
      setEssayResult(result);
    } catch (error: any) {
      console.error('Essay generation error:', error);
      alert(`Failed to generate essay: ${error.message}\n\nPlease check:\n1. API key is set in Vercel\n2. You have API credits\n3. Try again in a moment`);
    }
  };

  const currentMessage = loadingMessages[currentMessageIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex items-center justify-center z-50">
      <div className="max-w-2xl w-full mx-4">
        <div className="glass-card p-12 text-center">
          {/* Animated Emoji */}
          <div className="text-7xl mb-6 animate-bounce">
            {currentMessage.emoji}
          </div>

          {/* Current Status */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Crafting Your Essay
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {currentMessage.text}
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="gradient-primary h-full transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
          </div>

          {/* Reassuring Message */}
          <p className="text-gray-500 italic">
            💡 This won't take long...
          </p>

          {/* Fun Facts (Optional) */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Did you know?</span> Our AI analyzes your background 
              to create a narrative that sounds 100% human-written.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
