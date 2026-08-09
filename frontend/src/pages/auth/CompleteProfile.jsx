import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Complete Profile Screen - Final Step
 * 
 * Collects name and password, then submits complete registration
 */
const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, completeOtpLogin } = useAuth();
  const toast = useToast();
  
  const { email, phoneNumber, userId, bvn, nin, dateOfBirth } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [otpState, setOtpState] = useState(null);

  const verifySteps = [
    'Validating BVN...',
    'Validating NIN...',
    'Cross-checking identity...',
    'Finalising verification...',
  ];

  // Redirect if no required data
  useEffect(() => {
    if (!email || !phoneNumber || !userId || !bvn || !nin || !dateOfBirth) {
      navigate('/auth/signup', { replace: true });
    }
  }, [email, phoneNumber, userId, bvn, nin, dateOfBirth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase, and a number';
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

    // Simulate step-by-step verification
    setVerifying(true);
    setVerifyStep(0);
    for (let i = 0; i < verifySteps.length; i++) {
      setVerifyStep(i);
      await new Promise(res => setTimeout(res, 900));
    }

    try {
      setIsLoading(true);
      const result = await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        phoneNumber,
        password: formData.password,
        bvn,
        nin,
        dateOfBirth,
      });

      if (result?.requiresOtp) {
        setVerifying(false);
        setOtpState({
          userId: result.userId,
          email: result.email,
          phoneNumber: result.phoneNumber,
        });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setVerifying(false);
      toast.error(error.message || 'Failed to create account');
      if (error.errors) {
        const fieldErrors = {};
        error.errors.forEach(err => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = ({ user, token }) => {
    completeOtpLogin(user, token);
    navigate('/dashboard', { replace: true });
  };

  if (otpState) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <button
            onClick={() => setOtpState(null)}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          
          <h2 className="text-2xl font-bold text-deepBlue-800 text-center mb-6">
            Verify Your Phone
          </h2>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Import and use OtpVerification component */}
            <p className="text-center text-gray-600">OTP verification component would go here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Verification Overlay */}
      {verifying && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <LoadingSpinner size="lg" />
            <h3 className="text-xl font-bold text-deepBlue-600 mt-4 mb-2">
              Verifying Identity
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {verifySteps[verifyStep]}
            </p>
            <div className="flex justify-center gap-2">
              {verifySteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    i <= verifyStep ? 'bg-deepBlue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600 mb-2">Complete Profile</h1>
          <p className="text-sm font-semibold text-deepBlue-400">
            Final Step: Create Your Account
          </p>
        </div>
      </div>

      {/* Card Section with Avatar */}
      <div className="flex-1 relative">
        {/* Avatar - positioned to overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 rounded-full bg-deepBlue-600 flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-blue-100 rounded-t-[50px] pt-16 px-6 pb-8 min-h-full">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            {/* Info Box */}
            <div className="bg-white/70 border-l-4 border-deepBlue-600 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Almost done! Please provide your name and create a secure password.
              </p>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={`w-full px-4 py-3 bg-white rounded-lg border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-deepBlue-500`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={`w-full px-4 py-3 bg-white rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-deepBlue-500`}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-3">
                Password
              </label>
              <div className={`relative bg-white rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-200'
              }`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              {errors.password ? (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 ml-1">
                  <Info className="w-3 h-3" />
                  Min 8 chars with uppercase, lowercase, and number
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/30 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-deepBlue-600 rounded-full" style={{ width: '100%' }} />
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
                <span className="text-lg flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
