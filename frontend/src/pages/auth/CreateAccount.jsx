import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import { AuthService } from '../../services/authService';

/**
 * Create Account Screen - Step 1 of 3
 * 
 * Collects email and phone number for initial verification
 */
const CreateAccount = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    localPhone: '',
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.localPhone.trim()) {
      newErrors.localPhone = 'Phone number is required';
    } else if (formData.localPhone.length < 10) {
      newErrors.localPhone = 'Enter a valid 10-digit number';
    }
    
    return newErrors;
  };

  const handleContinue = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Check if user has incomplete registration
      const status = await AuthService.checkRegistrationStatus(formData.email, fullPhone);
      
      if (status.exists && !status.canContinue) {
        // Complete registration exists
        toast.error('An account with this email or phone number already exists. Please sign in.');
        setTimeout(() => navigate('/auth/signin'), 2000);
        return;
      }

      if (status.canContinue && status.isIncomplete) {
        // Incomplete registration - ask if they want to continue
        const shouldContinue = window.confirm(
          'You have an incomplete registration. Would you like to continue where you left off?'
        );
        
        if (shouldContinue) {
          // Route to appropriate step
          if (status.currentStep === 'email-verification') {
            navigate('/auth/verify-contact', {
              state: { 
                email: status.email, 
                phoneNumber: status.phoneNumber 
              }
            });
          } else if (status.currentStep === 'kyc-verification') {
            navigate('/auth/kyc-verify', {
              state: { 
                email: status.email, 
                phoneNumber: status.phoneNumber,
                userId: status.userId,
              }
            });
          }
          return;
        }
      }

      // No existing registration - proceed normally
      navigate('/auth/verify-contact', {
        state: { 
          email: formData.email, 
          phoneNumber: fullPhone 
        }
      });
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-12">
        <button
          onClick={() => navigate('/welcome')}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600 mb-2">Hello!</h1>
          <p className="text-sm font-semibold text-deepBlue-400">
            Step 1 of 3: Contact Information
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
          <div className="space-y-6 max-w-md mx-auto">
            {/* Info Box */}
            <div className="bg-white/70 border-l-4 border-deepBlue-600 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Let's start with your contact information. We'll send a verification code to your email.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-white rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-deepBlue-500`}
                disabled={isLoading}
              />
              {errors.email ? (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 ml-1">
                  <Info className="w-3 h-3" />
                  e.g. yourname@example.com
                </p>
              )}
            </div>

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

            {/* Progress Bar */}
            <div className="h-1 bg-white/30 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-deepBlue-600 rounded-full" style={{ width: '33%' }} />
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className={`w-full bg-deepBlue-600 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-deepBlue-700'
                }`}
              >
                <span className="text-lg">
                  {isLoading ? 'Checking...' : 'Continue'}
                </span>
                <span className="text-2xl">→</span>
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/auth/signin')}
                  className="text-sm text-deepBlue-600 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
