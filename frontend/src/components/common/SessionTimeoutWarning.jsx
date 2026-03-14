import React from 'react';
import { Clock, RefreshCw, X } from 'lucide-react';

const SessionTimeoutWarning = ({ 
  show, 
  timeLeft, 
  onExtend, 
  onDismiss 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Session Expiring Soon
            </h3>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Your session will expire in:
          </p>
          <div className="text-3xl font-bold text-orange-600 text-center py-2">
            {timeLeft}
          </div>
          <p className="text-sm text-gray-500 text-center">
            You'll be automatically logged out for security reasons.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onExtend}
            className="flex-1 bg-deepBlue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-deepBlue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Extend Session</span>
          </button>
          <button
            onClick={onDismiss}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;