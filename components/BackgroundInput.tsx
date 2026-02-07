'use client';

import { useState } from 'react';

interface BackgroundInputProps {
  onDataCollected: (data: { type: 'text'; content: string }) => void;
}

export default function BackgroundInput({ onDataCollected }: BackgroundInputProps) {
  const [inputMethod, setInputMethod] = useState<'choose' | 'type' | 'paste'>('choose');
  const [textContent, setTextContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [showExample, setShowExample] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextContent(text);
    setCharCount(text.length);
  };

  const handleSubmit = () => {
    if (textContent.trim().length >= 150) {
      onDataCollected({
        type: 'text',
        content: textContent
      });
    }
  };

  const isValid = textContent.trim().length >= 150;

  const exampleText = `EDUCATION
University of Ghana, Computer Science (2020-2024)

EXPERIENCE (if any)
Software Intern at TechCorp Ghana (Summer 2023)
Marketing Assistant at StartupHub (2022)

PROJECTS & ACTIVITIES (if any)
• Created mobile app for campus events
• Volunteer coding instructor

SKILLS (if any)
Python, JavaScript, React, Marketing, Design

Feel free to add anything else about yourself!`;

  // Step 1: Choose input method
  if (inputMethod === 'choose') {
    return (
      <div className="glass-card p-8 mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Step 1: Share Your Background
        </h2>
        <p className="text-gray-600 mb-8">
          How would you like to share your information?
        </p>

        <div className="space-y-4">
          <button
            onClick={() => setInputMethod('type')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">✍️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600">
                  I'll type it myself
                </h3>
                <p className="text-gray-600">
                  We'll guide you through what to share
                </p>
              </div>
              <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </button>

          <button
            onClick={() => setInputMethod('paste')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📋</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600">
                  I'll paste my CV/resume content
                </h3>
                <p className="text-gray-600">
                  Quick and easy - just copy and paste
                </p>
              </div>
              <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Text input (both type and paste use same form)
  return (
    <div className="glass-card p-8 mb-8 animate-fade-in">
      <button
        onClick={() => {
          setInputMethod('choose');
          setTextContent('');
          setCharCount(0);
        }}
        className="text-green-600 hover:text-green-700 mb-4 flex items-center space-x-2"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        📝 Tell Us About Yourself
      </h2>

      <p className="text-gray-700 mb-4">
        Share whatever you'd like us to know:
      </p>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          💡 You can include (if applicable):
        </p>
        <ul className="text-sm text-gray-600 space-y-1 ml-4">
          <li>• Your education & field of study</li>
          <li>• Work experience or internships</li>
          <li>• Projects or activities</li>
          <li>• Skills or interests</li>
          <li>• Achievements (if any)</li>
        </ul>
        <p className="text-sm text-green-700 font-semibold mt-3">
          👉 Don't worry - just share what feels relevant to you!
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowExample(!showExample)}
          className="text-green-600 hover:text-green-700 font-semibold flex items-center space-x-2"
        >
          <span>{showExample ? '▼' : '▶'}</span>
          <span>See Example Format</span>
        </button>

        {showExample && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {exampleText}
            </pre>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={textContent}
            onChange={handleTextChange}
            placeholder="Start typing or paste your content here..."
            className="w-full h-96 p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors resize-none text-base"
            maxLength={10000}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm ${charCount >= 150 ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
              {charCount} / 10,000 characters
            </span>
            {charCount > 0 && charCount < 150 && (
              <span className="text-sm text-orange-600">
                {150 - charCount} more characters needed
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isValid
              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:opacity-90 transform hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isValid ? 'Continue →' : `Add ${150 - charCount} more characters to continue`}
        </button>
      </div>
    </div>
  );
}
