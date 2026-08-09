import { useState } from 'react';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import authService from '../../services/authServices';
import { useToast } from '../common/Toast';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Forgot Password Component - for use in Auth.jsx
 * User enters phone number and email to receive OTP
 */
const ForgotPassword = ({ onBack, onOtpSent }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    localPhone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fullPhone = formData.localPhone ? `+234${formData.localPhone}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === 'localPhone') {
      processed = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: processed }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.localPhone.trim()) {
      newErrors.localPhone = 'Phone number is required';
    } else if (formData.localPhone.length < 10) {
      newErrors.localPhone = 'Enter a valid 10-digit number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const response = await authService.forgotPassword(fullPhone, formData.email.trim());

      toast.success('Verification code sent to your email!');
      
      // Pass data to parent to show reset password form
      onOtpSent({
        userId: response.data?.userId || response.userId || '',
        email: response.data?.email || response.email || formData.email,
        phoneNumber: response.data?.phoneNumber || response.phoneNumber || fullPhone,
      });
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Forgot Password?</h3>
        <p className="text-sm text-white/80">
          Enter your phone number and email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phone Number */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Phone Number</label>
          <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all duration-200 ${
            errors.localPhone
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
              className="flex-1 px-4 py-4 focus:outline-none bg-transparent text-white placeholder:text-white/60"
              disabled={isLoading}
              autoComplete="tel"
              maxLength={10}
            />
          </div>
          {errors.localPhone && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {errors.localPhone}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Email Address</label>
          <div className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
            errors.email
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
          {errors.email && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Submit Button */}
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
              <span>Sending...</span>
            </div>
          ) : (
            'Send Verification Code'
          )}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-white/80 text-sm hover:text-white font-medium hover:underline underline-offset-2 transition-all flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
