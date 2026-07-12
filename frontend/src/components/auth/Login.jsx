import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import OtpVerification from './OtpVerification';
import { useToast } from '../common/Toast';

const Login = () => {
  const { login, completeOtpLogin } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({ localPhone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpState, setOtpState] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedPhone');
    if (saved) setFormData(prev => ({ ...prev, localPhone: saved.replace(/^\+234/, '') }));
  }, []);

  const fullPhone = formData.localPhone ? `+234${formData.localPhone}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'localPhone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, localPhone: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const errors = {};
    if (!formData.localPhone) errors.localPhone = 'Phone number is required';
    else if (formData.localPhone.length < 10) errors.localPhone = 'Enter a valid 10-digit number';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    try {
      setIsLoading(true);
      const result = await login({ phoneNumber: fullPhone, password: formData.password });
      if (result?.requiresOtp) {
        setOtpState({ userId: result.userId, phoneNumber: result.phoneNumber, devOtp: result.devOtp });
      }
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 401) {
        toast.error('Invalid phone number or password');
        setFieldErrors({ localPhone: ' ', password: ' ' });
      } else if (err instanceof APIError && err.statusCode === 429) {
        toast.error('Too many attempts. Please wait 15 minutes before trying again.');
      } else {
        toast.error(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = ({ user, token }) => {
    completeOtpLogin(user, token);
    setSuccess(true);
    // Navigation is handled by Auth.jsx useEffect watching isAuthenticated
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-deepBlue-800 mb-3 tracking-tight">Welcome back!</h3>
        <p className="text-sm text-deepBlue-600 mb-6">
          Successfully signed in. Redirecting to your dashboard...
        </p>
        <div className="w-full bg-deepBlue-50 h-1 rounded-full overflow-hidden">
          <div className="bg-deepBlue-600 h-full w-2/3 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (otpState) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-deepBlue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-deepBlue-600" />
          </div>
          <h3 className="text-lg font-bold text-deepBlue-800 mb-2 tracking-tight">Verify Your Identity</h3>
          <p className="text-sm text-deepBlue-600">
            We've sent a verification code to secure your account
          </p>
        </div>
        <OtpVerification
          userId={otpState.userId}
          phoneNumber={otpState.phoneNumber}
          devOtp={otpState.devOtp}
          onSuccess={handleOtpSuccess}
          onBack={() => setOtpState(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phone Number with enhanced styling */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-deepBlue-700">Phone Number</label>
          <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all duration-200 ${
            fieldErrors.localPhone 
              ? 'border-red-400 bg-red-50/50' 
              : 'border-deepBlue-100 hover:border-deepBlue-200 focus-within:border-deepBlue-400 focus-within:shadow-lg focus-within:shadow-deepBlue-100/50'
          }`}>
            <div className="px-4 py-4 bg-deepBlue-50 border-r border-deepBlue-100 flex items-center gap-2">
              <span className="text-lg">🇳🇬</span>
              <span className="text-sm font-semibold text-deepBlue-700">+234</span>
            </div>
            <input
              type="tel"
              name="localPhone"
              value={formData.localPhone}
              onChange={handleChange}
              placeholder="8012345678"
              className="flex-1 px-4 py-4 focus:outline-none bg-transparent text-deepBlue-800 placeholder:text-deepBlue-400"
              disabled={isLoading}
              autoComplete="tel"
              maxLength={10}
            />
          </div>
          {fieldErrors.localPhone?.trim() && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.localPhone}
            </p>
          )}
        </div>

        {/* Password with enhanced styling */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-deepBlue-700">Password</label>
          <div className={`relative border-2 rounded-xl transition-all duration-200 ${
            fieldErrors.password 
              ? 'border-red-400 bg-red-50/50' 
              : 'border-deepBlue-100 hover:border-deepBlue-200 focus-within:border-deepBlue-400 focus-within:shadow-lg focus-within:shadow-deepBlue-100/50'
          }`}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-4 focus:outline-none bg-transparent pr-12 rounded-xl text-deepBlue-800 placeholder:text-deepBlue-400"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-deepBlue-400 hover:text-deepBlue-600 p-1 rounded-lg hover:bg-deepBlue-50 transition-all"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password?.trim() && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Enhanced submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
            isLoading 
              ? 'bg-deepBlue-200 cursor-not-allowed text-deepBlue-400' 
              : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white shadow-lg hover:shadow-xl hover:shadow-deepBlue-200/50 transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <LoadingSpinner size="sm" text="" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Forgot password link */}
        <div className="text-center pt-2">
          <button 
            type="button" 
            className="text-deepBlue-600 text-sm hover:text-deepBlue-700 font-medium hover:underline underline-offset-2 transition-all" 
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>
      </form>

      {/* Additional info */}
      <div className="pt-4 border-t border-deepBlue-100">
        <div className="text-center">
          <p className="text-xs text-deepBlue-500 leading-relaxed">
            By signing in, you agree to our terms of service and privacy policy. 
            Your data is protected with bank-level security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
