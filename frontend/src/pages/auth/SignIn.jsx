import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OtpVerification from '../../components/auth/OtpVerification';

/**
 * Sign In Screen
 * 
 * User login with phone number and password
 * Matches mobile signin experience with card design
 */
const SignIn = () => {
  const navigate = useNavigate();
  const { login, completeOtpLogin } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    localPhone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpState, setOtpState] = useState(null);

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
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
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
      const result = await login({ 
        phoneNumber: fullPhone, 
        password: formData.password 
      });

      if (result?.requiresOtp) {
        setOtpState({
          userId: result.userId,
          phoneNumber: result.phoneNumber,
          email: result.email,
          devOtp: result.devOtp,
        });
      } else {
        // Redirect based on user role
        if (result?.user?.role === 'admin' || result?.user?.role === 'moderator') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.message || 'Invalid phone number or password');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = ({ user, token }) => {
    completeOtpLogin(user, token);
    // Redirect based on user role
    if (user.role === 'admin' || user.role === 'moderator') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  if (otpState) {
    return (
      <div className="min-h-screen bg-white home-page-scrollbar">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <button
            onClick={() => setOtpState(null)}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          
          <h2 className="text-2xl font-bold text-deepBlue-800 text-center mb-6">
            Verify Your Identity
          </h2>
          
          <OtpVerification
            userId={otpState.userId}
            phoneNumber={otpState.phoneNumber}
            devOtp={otpState.devOtp}
            onSuccess={handleOtpSuccess}
            onBack={() => setOtpState(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col home-page-scrollbar">
      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-16">
        <button
          onClick={() => navigate('/welcome')}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600">Welcome Back</h1>
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
                  placeholder="Enter Password"
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
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/auth/forgot-password')}
              className="text-deepBlue-700 text-sm font-medium hover:underline ml-3"
            >
              Forgot Password?
            </button>

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
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </span>
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span className="text-2xl">→</span>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/auth/signup')}
                  className="text-sm text-deepBlue-600 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
