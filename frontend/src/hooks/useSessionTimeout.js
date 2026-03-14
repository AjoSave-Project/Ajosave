import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for handling session timeout
 * Warns users before session expires and provides refresh functionality
 */
export const useSessionTimeout = (timeoutMinutes = 30, warningMinutes = 5) => {
  const { isAuthenticated, refreshAuth, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const countdownRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = () => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setShowWarning(false);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(warningMinutes * 60);
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutMinutes * 60 * 1000);
  };

  const handleTimeout = async () => {
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    try {
      await logout();
    } catch (error) {
      console.error('Session timeout logout error:', error);
    }
  };

  const extendSession = async () => {
    try {
      await refreshAuth();
      resetTimer();
    } catch (error) {
      console.error('Session extension failed:', error);
      handleTimeout();
    }
  };

  const dismissWarning = () => {
    setShowWarning(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    resetTimer();
  };

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      const now = Date.now();
      // Only reset if it's been more than 1 minute since last activity
      if (now - lastActivityRef.current > 60000) {
        resetTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isAuthenticated]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    showWarning,
    timeLeft: formatTime(timeLeft),
    extendSession,
    dismissWarning,
    resetTimer
  };
};