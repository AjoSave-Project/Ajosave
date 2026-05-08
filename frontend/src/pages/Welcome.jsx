import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Welcome Screen
 * 
 * Entry point for authentication - Sign in or Sign up
 * Features a split design with gradient top section and white bottom section
 */
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top section with gradient circles */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-white">
        {/* Semi-circle 1 - outer */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3"
          style={{
            width: '510px',
            height: '600px',
            borderRadius: '255px',
            background: 'linear-gradient(180deg, rgba(111, 142, 226, 0.2) 0%, rgba(142, 219, 255, 0.4) 100%)',
          }}
        />
        
        {/* Semi-circle 2 - inner */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3"
          style={{
            width: '470px',
            height: '550px',
            borderRadius: '235px',
            background: 'linear-gradient(180deg, #58b1ff 0%, #4A90E2 100%)',
          }}
        />
        
        {/* Brand Name */}
        <h1 className="relative z-10 text-4xl font-bold text-white">
          AjoSave
        </h1>
      </div>

      {/* Bottom section with buttons */}
      <div className="bg-white p-8 space-y-4">
        <button
          onClick={() => navigate('/auth/signin')}
          className="w-full bg-deepBlue-600 hover:bg-deepBlue-700 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between shadow-lg"
        >
          <span className="text-lg">Sign in</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/auth/signup')}
          className="w-full bg-deepBlue-600 hover:bg-deepBlue-700 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between shadow-lg"
        >
          <span className="text-lg">Sign up</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Welcome;
