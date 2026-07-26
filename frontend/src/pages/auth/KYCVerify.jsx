import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

/**
 * KYC Verify Screen - Step 3 of 3
 * 
 * Client-Side Consolidated BVN, NIN, and Date of Birth verification (Testing Mode)
 */
const KYCVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  const { email, phoneNumber, userId } = location.state || {};

  const [formData, setFormData] = useState({
    bvn: '',
    nin: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});
  const [bvnVerified, setBvnVerified] = useState(false);
  const [ninVerified, setNinVerified] = useState(false);

  // Redirect if no required data
  useEffect(() => {
    if (!email || !phoneNumber || !userId) {
      navigate('/auth/signup', { replace: true });
    }
  }, [email, phoneNumber, userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === 'bvn' || name === 'nin') {
      processed = value.replace(/\D/g, '').slice(0, 11);
      // Reset verification status when value changes
      if (name === 'bvn') setBvnVerified(false);
      if (name === 'nin') setNinVerified(false);
    } else if (name === 'dateOfBirth') {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length > 6) {
        processed = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 4) {
        processed = `${digits.slice(0, 4)}-${digits.slice(4)}`;
      } else {
        processed = digits;
      }
    }

    setFormData(prev => ({ ...prev, [name]: processed }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  // --- CLIENT-SIDE VERIFY HANDLERS (NO BACKEND CALLS) ---
  const handleVerifyBVN = () => {
    if (formData.bvn.length !== 11) {
      setErrors(prev => ({ ...prev, bvn: 'BVN must be 11 digits' }));
      return;
    }

    setBvnVerified(true);
    toast.success('BVN verified (Simulated)');
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.bvn;
      return newErrors;
    });
  };

  const handleVerifyNIN = () => {
    if (formData.nin.length !== 11) {
      setErrors(prev => ({ ...prev, nin: 'NIN must be 11 digits' }));
      return;
    }

    if (!formData.dateOfBirth.trim()) {
      setErrors(prev => ({ ...prev, dateOfBirth: 'Date of birth is required to verify NIN' }));
      return;
    }

    setNinVerified(true);
    toast.success('NIN verified (Simulated)');
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.nin;
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (formData.bvn.length !== 11) newErrors.bvn = 'BVN must be 11 digits';
    if (!bvnVerified) newErrors.bvn = 'Please verify your BVN';
    if (formData.nin.length !== 11) newErrors.nin = 'NIN must be 11 digits';
    if (!ninVerified) newErrors.nin = 'Please verify your NIN';
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    return newErrors;
  };

  const handleContinue = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Navigate to complete profile with all collected data
    navigate('/auth/complete-profile', {
      state: { 
        email, 
        phoneNumber,
        userId,
        bvn: formData.bvn,
        nin: formData.nin,
        dateOfBirth: formData.dateOfBirth
      }
    });
  };

  const canContinue = bvnVerified && ninVerified && formData.dateOfBirth.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Section */}
      <div className="bg-white px-6 pt-8 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="text-deepBlue-600 hover:text-deepBlue-800 mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-deepBlue-600 mb-2">Verify Your Identity</h1>
          <p className="text-sm font-semibold text-deepBlue-400">
            Step 3 of 3: Identity Verification
          </p>
        </div>
      </div>

      {/* Card Section with Avatar */}
      <div className="flex-1 relative">
        {/* Avatar - positioned to overlap */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 rounded-full bg-deepBlue-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-blue-100 rounded-t-[50px] pt-16 px-6 pb-8 min-h-full">
          <div className="space-y-6 max-w-md mx-auto">
            {/* Info Box */}
            <div className="bg-white/70 border-l-4 border-deepBlue-600 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Please provide your BVN, NIN, and date of birth to verify your identity.
              </p>
            </div>

            {/* Date of Birth (Moved up for UX flow with NIN) */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2 ml-3">
                Date of Birth
              </label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                maxLength={10}
                className={`w-full px-4 py-3 bg-white rounded-lg border ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-deepBlue-500`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            {/* BVN */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2 ml-3">
                BVN (11 digits)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="bvn"
                  value={formData.bvn}
                  onChange={handleChange}
                  placeholder="Enter your BVN"
                  maxLength={11}
                  className={`flex-1 px-4 py-3 bg-white rounded-lg border ${
                    errors.bvn ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-deepBlue-500`}
                  disabled={bvnVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyBVN}
                  disabled={formData.bvn.length !== 11 || bvnVerified}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border transition duration-200 ${
                    bvnVerified
                      ? 'bg-green-100 border-green-500'
                      : formData.bvn.length === 11
                      ? 'bg-deepBlue-100 border-deepBlue-600 hover:bg-deepBlue-200'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  {bvnVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowRight className={`w-5 h-5 ${
                      formData.bvn.length === 11 ? 'text-deepBlue-600' : 'text-gray-400'
                    }`} />
                  )}
                </button>
              </div>
              {bvnVerified && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              )}
              {errors.bvn && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.bvn}
                </p>
              )}
            </div>

            {/* NIN */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2 ml-3">
                NIN (11 digits)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  placeholder="Enter your NIN"
                  maxLength={11}
                  className={`flex-1 px-4 py-3 bg-white rounded-lg border ${
                    errors.nin ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-deepBlue-500`}
                  disabled={ninVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyNIN}
                  disabled={formData.nin.length !== 11 || ninVerified}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border transition duration-200 ${
                    ninVerified
                      ? 'bg-green-100 border-green-500'
                      : formData.nin.length === 11
                      ? 'bg-deepBlue-100 border-deepBlue-600 hover:bg-deepBlue-200'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  {ninVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowRight className={`w-5 h-5 ${
                      formData.nin.length === 11 ? 'text-deepBlue-600' : 'text-gray-400'
                    }`} />
                  )}
                </button>
              </div>
              {ninVerified && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              )}
              {errors.nin && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nin}
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/30 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-deepBlue-600 rounded-full" style={{ width: '100%' }} />
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full bg-deepBlue-600 text-white font-semibold py-5 px-6 rounded-xl transition duration-200 flex items-center justify-between ${
                  !canContinue ? 'opacity-60 cursor-not-allowed' : 'hover:bg-deepBlue-700'
                }`}
              >
                <span className="text-lg">Continue</span>
                <span className="text-2xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerify;