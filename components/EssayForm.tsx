'use client';

import { useState } from 'react';
import BackgroundInput from './BackgroundInput';

interface EssayFormProps {
  onGenerate: (data: any) => void;
}

export default function EssayForm({ onGenerate }: EssayFormProps) {
  const [step, setStep] = useState(1);
  const [backgroundData, setBackgroundData] = useState<any>(null);
  const [formData, setFormData] = useState({
    programName: '',
    universityName: '',
    essayType: 'Personal Statement',
    wordCount: 650,
    customPrompt: '',
  });

  const essayTypes = [
    'Personal Statement',
    'Statement of Purpose (SOP)',
    'Motivation Letter / Letter of Intent',
    'Application Essay',
    'Scholarship Essay',
    'Career Goals Essay',
    'Admissions Short Answer Question',
    'Generic Essay',
  ];

  const handleBackgroundCollected = (data: any) => {
    setBackgroundData(data);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!backgroundData) {
      alert('Please provide your background information first');
      setStep(1);
      return;
    }

    if (!formData.programName || !formData.universityName) {
      alert('Please fill in program and university names');
      return;
    }

    onGenerate({
      background: backgroundData.content,
      ...formData,
    });
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium hidden sm:inline">Background</span>
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium hidden sm:inline">Essay Details</span>
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium hidden sm:inline">Generate</span>
          </div>
        </div>
      </div>

      {/* Step 1: Background Input */}
      {step === 1 && (
        <BackgroundInput onDataCollected={handleBackgroundCollected} />
      )}

      {/* Step 2: Essay Details */}
      {step >= 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Background Summary (if collected) */}
          {backgroundData && (
            <div className="glass-card p-6 bg-green-50 border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-800 mb-1">✓ Background Collected</p>
                  <p className="text-sm text-green-700">
                    {backgroundData.type === 'file' 
                      ? `File: ${backgroundData.fileName}`
                      : `${backgroundData.content.length} characters of background information`
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-green-700 hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {/* Essay Details Form */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Essay Details</h2>

            <div className="space-y-6">
              {/* Program Name */}
              <div>
                <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name *
                </label>
                <input
                  type="text"
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  placeholder="e.g., BSc Nursing, MS Data Science, MBA"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* University Name */}
              <div>
                <label htmlFor="universityName" className="block text-sm font-medium text-gray-700 mb-2">
                  University Name *
                </label>
                <input
                  type="text"
                  id="universityName"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  placeholder="e.g., Harvard University, University of Toronto"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Essay Type */}
              <div>
                <label htmlFor="essayType" className="block text-sm font-medium text-gray-700 mb-2">
                  Essay Type *
                </label>
                <select
                  id="essayType"
                  name="essayType"
                  value={formData.essayType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  {essayTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Word Count */}
              <div>
                <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Word Count
                </label>
                <input
                  type="number"
                  id="wordCount"
                  name="wordCount"
                  value={formData.wordCount}
                  onChange={handleInputChange}
                  min="200"
                  max="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Typically 400-800 words</p>
              </div>

              {/* Custom Prompt (Optional) */}
              <div className="border-t-2 border-gray-200 pt-6">
                <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Instructions <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="customPrompt"
                  name="customPrompt"
                  value={formData.customPrompt}
                  onChange={handleInputChange}
                  placeholder="Example:
• Focus on my leadership experience
• Address how I overcame financial challenges
• Mention my research interest in renewable energy
• Keep it under 500 words"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <div className="mt-3 flex items-start space-x-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-600 text-xl flex-shrink-0">💡</span>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong className="font-semibold">Tip:</strong> Be specific about what you want highlighted or any essay prompts you need to address. Leave blank if you have no special requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-8"></div>

            {/* Generate Button */}
            <button
              type="submit"
              className="w-full mt-8 gradient-primary text-white py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-xl"
            >
              Generate My Essay →
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
