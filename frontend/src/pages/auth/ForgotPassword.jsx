import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import authService from '../../services/authServices';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Forgot Password Screen - Step 1
 * User enters phone number and email to receive OTP
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
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

      // Navigate to reset password screen with userId and email
      navigate('/auth/reset-password', {
        state: {
          userId: response.data?.userId || response.userId || '',
          email: response.data?.email || response.email || formData.email,
          phoneNumber: response.data?.phoneNumber || response.phoneNumber || fullPhone,
          method: response.data?.method || response.method || 'email',
        },
      });
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col home-page-scrollbar">
      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-16">
        <button
          onClick={() => navigate('/auth/signin')}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600 mb-2">Forgot Password?</h1>
          <p className="text-sm text-gray-600">
            Enter your phone number and email to receive a verification code
          </p>
        </div>
      </div>

      {/* Card Section with Avatar */}
      <div className="flex-1 relative">
        {/* Avatar - positioned to overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 rounded-full bg-deepBlue-600 flex items-center justify-center shadow-lg">
            <Mail className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-blue-100 rounded-t-[50px] pt-16 px-6 pb-8 min-h-full">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                Phone Number
              </label>
              <div className={`flex items-center bg-white rounded-lg border ${
                errors.localPhone ? 'border-red-500' : 'border-gray-200'
              }`}>
                <span className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-700 whitespace-nowrap rounded-l-lg">
                  🇳🇬 +234
                </span>
                <input
                  type="tel"
                  name="localPhone"
                  value={formData.localPhone}
                  onChange={handleChange}
                  placeholder="8012345678"
                  className="flex-1 px-3 py-3 focus:outline-none bg-transparent rounded-r-lg"
                  disabled={isLoading}
                  maxLength={10}
                />
              </div>
              {errors.localPhone && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.localPhone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                Email Address
              </label>
              <div className={`bg-white rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 focus:outline-none bg-transparent rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-deepBlue-600 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-deepBlue-700'
                }`}
              >
                <span className="text-lg">
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </span>
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span className="text-2xl">→</span>
                )}
              </button>

              {/* Back to Sign In */}
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Remember your password? </span>
                <button
                  type="button"
                  onClick={() => navigate('/auth/signin')}
                  className="text-sm text-deepBlue-600 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
