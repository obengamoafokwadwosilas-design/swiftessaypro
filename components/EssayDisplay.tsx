'use client';

import { useState } from 'react';

interface EssayDisplayProps {
  data: any;
  onReset: () => void;
}

export default function EssayDisplay({ data, onReset }: EssayDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data.essay) {
      navigator.clipboard.writeText(data.essay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Parse essay stats from the audit section
  const parseStats = () => {
    const audit = data.audit || '';
    const wordCountMatch = audit.match(/Word count: (\d+)/);
    const modeMatch = audit.match(/Mode used: (.+?)(?:\n|$)/);
    
    return {
      wordCount: wordCountMatch ? wordCountMatch[1] : 'N/A',
      mode: modeMatch ? modeMatch[1].replace(/["\[\]]/g, '').trim() : 'N/A',
    };
  };

  const stats = parseStats();

  return (
    <div className="animate-fade-in">
      {/* Success Banner */}
      <div className="glass-card p-6 mb-8 bg-gradient-to-r from-success/10 to-primary/10 border-success">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Essay is Ready!</h2>
              <p className="text-gray-600">100% Human-Quality • 0% Plagiarism</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{stats.wordCount}</div>
          <div className="text-sm text-gray-600">Words</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">{stats.mode}</div>
          <div className="text-sm text-gray-600">Writing Mode</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">0</div>
          <div className="text-sm text-gray-600">AI Clichés</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">100%</div>
          <div className="text-sm text-gray-600">Human Quality</div>
        </div>
      </div>

      {/* Essay Text */}
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Your Essay</h3>
          <button
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              copied
                ? 'bg-success text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Essay</span>
              </>
            )}
          </button>
        </div>

        <div className="prose prose-lg max-w-none">
          {data.essay ? (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {data.essay}
            </div>
          ) : (
            <p className="text-gray-500">No essay content available</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onReset}
          className="flex-1 gradient-primary text-white px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
        >
          Generate Another Essay
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-primary transition-colors"
        >
          Copy to Clipboard
        </button>
      </div>

      {/* Tips Section */}
      <div className="mt-8 glass-card p-6 bg-blue-50 border-secondary">
        <h4 className="font-bold text-gray-900 mb-3">📝 Next Steps:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>Read through and make any personal adjustments you feel are needed</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>Have someone proofread for any typos or errors</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>This essay passes Turnitin, GPTZero, and other AI detectors</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4.</span>
            <span>Good luck with your application! 🎓</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
