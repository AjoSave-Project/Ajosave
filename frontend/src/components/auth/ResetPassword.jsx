import { useState, useRef, useEffect } from 'react';
import { AlertCircle, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
import authService from '../../services/authServices';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Reset Password Component - for use in Auth.jsx
 * User enters OTP and new password
 */
const ResetPassword = ({ userId, email, phoneNumber, onSuccess, onBack }) => {
  const toast = useToast();

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
      onSuccess();
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
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Reset Password</h3>
        <p className="text-sm text-white/80">
          Enter the code sent to <span className="font-semibold">{maskedEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OTP Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white text-center">
            Verification Code
          </label>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
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
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors text-white ${
                  errors.otp
                    ? 'border-red-400 bg-red-50/20'
                    : digit
                    ? 'border-white/60 bg-white/10 focus:border-white/80'
                    : 'border-white/20 bg-white/5 focus:border-white/60'
                }`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 justify-center mt-2">
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
                className="text-white/80 text-sm font-semibold hover:text-white hover:underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-3 h-3" />
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            ) : (
              <p className="text-white/60 text-sm">
                Resend code in {formatTime(timer)}
              </p>
            )}
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">New Password</label>
          <div className={`relative border-2 rounded-xl transition-all duration-200 ${
            errors.newPassword
              ? 'border-red-400 bg-red-50/20'
              : 'border-white/20 hover:border-white/40 focus-within:border-white/60'
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
              className="w-full px-4 py-4 focus:outline-none bg-transparent pr-12 rounded-xl text-white placeholder:text-white/60"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Confirm Password</label>
          <div className={`relative border-2 rounded-xl transition-all duration-200 ${
            errors.confirmPassword
              ? 'border-red-400 bg-red-50/20'
              : 'border-white/20 hover:border-white/40 focus-within:border-white/60'
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
              className="w-full px-4 py-4 focus:outline-none bg-transparent pr-12 rounded-xl text-white placeholder:text-white/60"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isOtpComplete}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
            isLoading || !isOtpComplete
              ? 'bg-white/20 cursor-not-allowed text-white/60'
              : 'bg-white/20 hover:bg-white/30 text-white shadow-lg hover:shadow-xl hover:shadow-white/10 transform hover:scale-[1.02] active:scale-[0.98] border border-white/30'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <LoadingSpinner size="sm" text="" />
              <span>Resetting...</span>
            </div>
          ) : (
            'Reset Password'
          )}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-white/80 text-sm hover:text-white font-medium hover:underline underline-offset-2 transition-all"
          disabled={isLoading}
        >
          ← Back
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
