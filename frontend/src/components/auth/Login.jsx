import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import OtpVerification from './OtpVerification';
import { useToast } from '../common/Toast';

const Login = ({ onForgotPassword }) => {
  const { login, completeOtpLogin } = useAuth();
  const toast = useToast();

  // 'phone' | 'email'
  const [loginMode, setLoginMode] = useState('phone');
  const [formData, setFormData] = useState({ localPhone: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpState, setOtpState] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedPhone');
    if (saved) {
      // Strip leading +234 or leading 0 if present
      const cleaned = saved.replace(/^\+234/, '').replace(/^0/, '');
      setFormData(prev => ({ ...prev, localPhone: cleaned }));
    }
  }, []);

  // Format phone number: strip leading 0 if user types it, then attach +234
  const cleanedPhone = formData.localPhone.replace(/^0/, '');
  const fullPhone = cleanedPhone ? `+234${cleanedPhone}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'localPhone') {
      // Allow user to type up to 11 digits (e.g., 080... or 80...)
      const digits = value.replace(/\D/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, localPhone: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const errors = {};
    if (loginMode === 'phone') {
      const p = formData.localPhone.replace(/^0/, '');
      if (!p) errors.localPhone = 'Phone number is required';
      else if (p.length !== 10) errors.localPhone = 'Enter a valid 10-digit number (e.g. 8012345678)';
    } else {
      if (!formData.email) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email address';
    }
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
      const credentials = loginMode === 'phone'
        ? { phoneNumber: fullPhone, password: formData.password }
        : { email: formData.email.trim(), password: formData.password };

      const result = await login(credentials);
      if (result?.requiresOtp) {
        setOtpState({
          userId: result.userId,
          phoneNumber: result.phoneNumber,
          email: result.email,
        });
      }
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 401) {
        toast.error('Invalid credentials. Please check and try again.');
        setFieldErrors({ localPhone: ' ', email: ' ', password: ' ' });
      } else if (err instanceof APIError && err.statusCode === 429) {
        toast.error('Too many attempts. Please wait 15 minutes before trying again.');
      } else {
        // Display specific validation error messages returned by Express validator
        const errMsg = err?.data?.errors?.[0]?.msg || err.message || 'An unexpected error occurred. Please try again.';
        toast.error(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = ({ user, token }) => {
    completeOtpLogin(user, token);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Welcome back!</h3>
        <p className="text-sm text-white/80 mb-6">
          Successfully signed in. Redirecting to your dashboard...
        </p>
        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
          <div className="bg-white h-full w-2/3 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (otpState) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Verify Your Identity</h3>
          <p className="text-sm text-white/80">
            We've sent a verification code to your email
          </p>
        </div>
        <OtpVerification
          userId={otpState.userId}
          phoneNumber={otpState.phoneNumber}
          email={otpState.email}
          onSuccess={handleOtpSuccess}
          onBack={() => setOtpState(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Login mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/20 bg-white/10">
          <button
            type="button"
            onClick={() => { setLoginMode('phone'); setFieldErrors({}); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
              loginMode === 'phone'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Phone
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('email'); setFieldErrors({}); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
              loginMode === 'email'
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Email
          </button>
        </div>

        {/* Phone Number input */}
        {loginMode === 'phone' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Phone Number</label>
            <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all duration-200 ${
              fieldErrors.localPhone
                ? 'border-red-400 bg-red-50/20'
                : 'border-white/20 hover:border-white/40 focus-within:border-white/60'
            }`}>
              <div className="px-4 py-4 bg-white/10 border-r border-white/20 flex items-center gap-2">
                <span className="text-lg">🇳🇬</span>
                <span className="text-sm font-semibold text-white">+234</span>
              </div>
              <input
                type="tel"
                name="localPhone"
                value={formData.localPhone}
                onChange={handleChange}
                placeholder="8012345678"
                className="flex-1 px-4 py-4 focus:outline-none bg-transparent text-white placeholder:text-black/60"
                disabled={isLoading}
                autoComplete="tel"
                maxLength={11}
              />
            </div>
            {fieldErrors.localPhone?.trim() && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.localPhone}
              </p>
            )}
          </div>
        )}

        {/* Email input */}
        {loginMode === 'email' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Email Address</label>
            <div className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
              fieldErrors.email
                ? 'border-red-400 bg-red-50/20'
                : 'border-white/20 hover:border-white/40 focus-within:border-white/60'
            }`}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-4 focus:outline-none bg-transparent text-white placeholder:text-white/60"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {fieldErrors.email?.trim() && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.email}
              </p>
            )}
          </div>
        )}

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Password</label>
          <div className={`relative border-2 rounded-xl transition-all duration-200 ${
            fieldErrors.password
              ? 'border-red-400 bg-red-50/20'
              : 'border-white/20 hover:border-white/40 focus-within:border-white/60'
          }`}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-4 focus:outline-none bg-transparent pr-12 rounded-xl text-white placeholder:text-white/60"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-deepBlue-900 hover:text-deepBlue-900 p-1 rounded-lg hover:bg-deepBlue/40 transition-all"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password?.trim() && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
            isLoading
              ? 'bg-white/20 cursor-not-allowed text-white/60'
              : 'bg-white/20 hover:bg-white/30 text-white shadow-lg hover:shadow-xl hover:shadow-white/10 transform hover:scale-[1.02] active:scale-[0.98] border border-white/30'
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

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-white/80 text-sm hover:text-white font-medium hover:underline underline-offset-2 transition-all"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>
      </form>

      <div className="pt-4 border-t border-white/20">
        <div className="text-center">
          <p className="text-xs text-white/60 leading-relaxed">
            By signing in, you agree to our terms of service and privacy policy.
            Your data is protected with bank-level security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;