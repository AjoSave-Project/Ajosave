import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Onboarding Screen
 * 
 * Shows app introduction and value proposition
 * Matches mobile onboarding experience
 */
const Onboarding = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 home-page-scrollbar">
      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/images/Phone.png" 
              alt="AjoSave Illustration" 
              className="w-72 h-72 mx-auto object-contain"
              onError={(e) => {
                // Fallback to a placeholder if image doesn't exist
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-72 h-72 mx-auto bg-gradient-to-br from-deepBlue-100 to-deepBlue-200 rounded-full hidden items-center justify-center"
            >
              <svg className="w-32 h-32 text-deepBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-deepBlue-600">
              Saving Together, Growing Together
            </h1>
            <p className="text-sm text-gray-600">
              Inspired by Ajo. Designed for you.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-md">
        <button
          onClick={handleGetStarted}
          className="w-full bg-deepBlue-600 hover:bg-deepBlue-700 text-white font-bold py-4 px-8 rounded-xl transition duration-200 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
