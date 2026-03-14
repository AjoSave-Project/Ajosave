import React from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';

const NetworkStatus = ({ isOnline, isSlowConnection }) => {
  if (isOnline && !isSlowConnection) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium ${
      !isOnline 
        ? 'bg-red-500 text-white' 
        : 'bg-yellow-500 text-white'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4" />
            <span>No internet connection. Some features may not work.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4" />
            <span>Slow connection detected. App may load slowly.</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;