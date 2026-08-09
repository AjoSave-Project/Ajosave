import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
import authService from '../../services/authServices';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Reset Password Screen - Step 2
 * User enters OTP and new password
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Get data passed from ForgotPassword screen
  const { userId, email, phoneNumber, method } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);

  useEffect(() => {
    // Redirect if no userId
    if (!userId) {
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.otp;
      return newErrors;
    });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending || !userId) return;

    setIsResending(true);
    try {
      await authService.forgotPassword(phoneNumber, email);
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
      toast.success('New verification code sent!');
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (otp.join('').length !== 6) {
      newErrors.otp = 'Please enter the 6-digit code';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Must include uppercase, lowercase, and a number';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword(userId, otp.join(''), newPassword);

      toast.success('Password reset successfully!');
      
      // Redirect to signin with success message
      navigate('/auth/signin', {
        state: { resetSuccess: true },
      });
    } catch (error) {
      toast.error(error.message || 'Invalid or expired code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : 'your email';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(d => d !== '');

  return (
    <div className="min-h-screen bg-white flex flex-col home-page-scrollbar">
      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-16">
        <button
          onClick={() => navigate('/auth/forgot-password')}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600 mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter the code sent to <span className="font-semibold">{maskedEmail}</span> and choose a new password
          </p>
        </div>
      </div>

      {/* Card Section with Avatar */}
      <div className="flex-1 relative">
        {/* Avatar - positioned to overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 rounded-full bg-deepBlue-600 flex items-center justify-center shadow-lg">
            <Key className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-blue-100 rounded-t-[50px] pt-16 px-6 pb-8 min-h-full">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Verification Code
              </label>
              <div className="flex justify-center gap-3 mb-2" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    disabled={isLoading}
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.otp
                        ? 'border-red-500 bg-red-50'
                        : digit
                        ? 'border-deepBlue-400 bg-white focus:border-deepBlue-500'
                        : 'border-gray-300 bg-white focus:border-deepBlue-500'
                    }`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 justify-center">
                  <AlertCircle className="w-3 h-3" />
                  {errors.otp}
                </p>
              )}

              {/* Resend */}
              <div className="text-center mt-3">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-deepBlue-600 text-sm font-semibold hover:underline flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isResending ? 'Sending...' : 'Resend Code'}
                  </button>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Resend code in {formatTime(timer)}
                  </p>
                )}
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                New Password
              </label>
              <div className={`relative bg-white rounded-lg border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-200'
              }`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.newPassword;
                      return newErrors;
                    });
                  }}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 focus:outline-none bg-transparent pr-12 rounded-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                Confirm Password
              </label>
              <div className={`relative bg-white rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              }`}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.confirmPassword;
                      return newErrors;
                    });
                  }}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 focus:outline-none bg-transparent pr-12 rounded-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !isOtpComplete}
                className={`w-full bg-deepBlue-600 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between ${
                  isLoading || !isOtpComplete ? 'opacity-60 cursor-not-allowed' : 'hover:bg-deepBlue-700'
                }`}
              >
                <span className="text-lg">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </span>
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span className="text-2xl">→</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
