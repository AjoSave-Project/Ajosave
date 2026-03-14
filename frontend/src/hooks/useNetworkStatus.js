import { useState, useEffect } from 'react';

/**
 * Custom hook for monitoring network connectivity
 * Provides online/offline status and connection quality indicators
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Network connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📵 Network connection lost');
    };

    // Monitor connection type if available
    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.effectiveType || 'unknown');
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Monitor connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo(); // Initial check
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return {
    isOnline,
    connectionType,
    isSlowConnection
  };
};