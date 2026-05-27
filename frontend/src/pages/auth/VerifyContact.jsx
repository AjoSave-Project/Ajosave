import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MailOpen } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { AuthService } from '../../services/authServices';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Verify Contact Screen - Step 2 of 3
 * 
 * Sends OTP to email and verifies it before proceeding to identity verification
 */
const VerifyContact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const { email, phoneNumber } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [userId, setUserId] = useState('');
  const inputRefs = useRef([]);

  // Redirect if no email/phone
  useEffect(() => {
    if (!email || !phoneNumber) {
      navigate('/auth/signup', { replace: true });
    }
  }, [email, phoneNumber, navigate]);

  // Send initial OTP on mount
  useEffect(() => {
    if (email && phoneNumber) {
      sendInitialOtp();
    }
  }, [email, phoneNumber]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const sendInitialOtp = async () => {
    setIsSending(true);
    try {
      const response = await AuthService.sendOtpToEmail(email, phoneNumber);
      setUserId(response.userId);
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code');
      navigate('/auth/signup');
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend || !userId || isResending) return;
    
    setIsResending(true);
    try {
      const result = await AuthService.sendOtp(userId);
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success(`Verification code sent to ${result.email || email}`);
    } catch (error) {
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    if (!userId) {
      toast.error('Session expired. Please start over.');
      navigate('/auth/signup');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.verifyContactOtp(userId, otpCode);
      
      // Navigate to KYC verification
      navigate('/auth/kyc-verify', {
        state: { 
          email, 
          phoneNumber,
          userId 
        }
      });
    } catch (error) {
      toast.error(error.message || 'Verification failed');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(d => d !== '');
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'your email';
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Sending verification code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-12">
        <button
          onClick={() => navigate('/auth/signup')}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600 mb-2">Verify Email</h1>
          <p className="text-sm font-semibold text-deepBlue-400 mb-1">
            Step 2 of 3: Email Verification
          </p>
          <p className="text-xs text-gray-500">
            Code sent to {maskedEmail}
          </p>
        </div>
      </div>

      {/* Card Section with Avatar */}
      <div className="flex-1 relative">
        {/* Avatar - positioned to overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 rounded-full bg-deepBlue-600 flex items-center justify-center shadow-lg">
            <MailOpen className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-blue-100 rounded-t-[50px] pt-16 px-6 pb-8 min-h-full flex flex-col">
          <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-6">Enter Code</h3>

              {/* OTP Input */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-12 h-14 text-center text-2xl font-bold bg-white rounded-xl border-2 ${
                      digit ? 'border-deepBlue-600' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-deepBlue-500 shadow-sm`}
                    disabled={isLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Resend Section */}
              <div className="mb-6">
                {!canResend ? (
                  <p className="text-sm text-gray-600">
                    Resend code in {formatTime(timer)}
                  </p>
                ) : isResending ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-gray-600">Sending...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-deepBlue-600 font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-deepBlue-600 rounded-full" style={{ width: '66%' }} />
              </div>
            </div>
          </div>

          {/* Verify Button */}
          <div className="pt-6 max-w-md mx-auto w-full">
            <button
              onClick={handleVerify}
              disabled={!isOtpComplete || isLoading}
              className={`w-full bg-deepBlue-600 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between ${
                !isOtpComplete || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-deepBlue-700'
              }`}
            >
              <span className="text-lg">
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </span>
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="text-2xl">→</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyContact;
