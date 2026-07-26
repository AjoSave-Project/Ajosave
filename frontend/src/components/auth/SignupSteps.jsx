import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import { api } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import OtpVerification from './OtpVerification';
import { useToast } from '../common/Toast';

// ─── Password validation (matches mobile complete-profile.tsx) ───────────────
// Min 8 chars, must have uppercase, lowercase, number, AND special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const PASSWORD_HINT = 'Min 8 chars · uppercase · lowercase · number · special character (e.g. @$!#)';

// ─── Step labels ─────────────────────────────────────────────────────────────
const STEPS = ['Contact', 'Verify Email', 'Identity (KYC)', 'Complete Profile'];

const SignupSteps = () => {
  const { signup, completeOtpLogin } = useAuth();
  const toast = useToast();

  // step 1 = contact info, 2 = OTP, 3 = KYC, 4 = name+password
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 data
  const [contact, setContact] = useState({ email: '', localPhone: '' });

  // Step 2 OTP data (set after step-1 API call)
  const [otpUserId, setOtpUserId] = useState(null);
  const [otpDevCode, setOtpDevCode] = useState(null);

  // Step 3 KYC data
  const [kyc, setKyc] = useState({ bvn: '', nin: '', dateOfBirth: '' });
  const [kycVerified, setKycVerified] = useState({ bvn: false, nin: false });
  const [kycVerifying, setKycVerifying] = useState({ bvn: false, nin: false });

  // Step 4 profile data
  const [profile, setProfile] = useState({ firstName: '', lastName: '', password: '', showPassword: false });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Final OTP (login 2FA after registration)
  const [loginOtpState, setLoginOtpState] = useState(null);
  const [success, setSuccess] = useState(false);

  const fullPhone = contact.localPhone ? `+234${contact.localPhone}` : '';

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const clearErr = (...fields) =>
    setFieldErrors(prev => { const n = { ...prev }; fields.forEach(f => delete n[f]); return n; });

  const inputCls = (f) =>
    `w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition duration-200 bg-transparent text-white placeholder:text-white/60 ${
      fieldErrors[f] ? 'border-red-400' : 'border-white/20 hover:border-white/40 focus:border-white/60'
    }`;

  // ─── Step 1 validation ─────────────────────────────────────────────────────
  const validateStep1 = () => {
    const errors = {};
    if (!contact.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(contact.email))
      errors.email = 'Please enter a valid email address';
    if (!contact.localPhone || contact.localPhone.length < 10)
      errors.localPhone = 'Enter a valid 10-digit number';
    return errors;
  };

  // ─── Step 3 validation ─────────────────────────────────────────────────────
  const validateStep3 = () => {
    const errors = {};
    if (!kyc.bvn || kyc.bvn.length !== 11) errors.bvn = `BVN must be exactly 11 digits (${kyc.bvn.length}/11)`;
    else if (!kycVerified.bvn) errors.bvn = 'Please verify your BVN before continuing';
    if (!kyc.nin || kyc.nin.length !== 11) errors.nin = `NIN must be exactly 11 digits (${kyc.nin.length}/11)`;
    else if (!kycVerified.nin) errors.nin = 'Please verify your NIN before continuing';
    if (!kyc.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birth = new Date(kyc.dateOfBirth);
      if (isNaN(birth.getTime())) errors.dateOfBirth = 'Enter a valid date (YYYY-MM-DD)';
      else {
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear() -
          (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
        if (age < 18) errors.dateOfBirth = 'You must be at least 18 years old';
        else if (age > 90) errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    return errors;
  };

  // ─── Step 4 validation (matches mobile complete-profile.tsx) ───────────────
  const validateStep4 = () => {
    const errors = {};
    if (!profile.firstName.trim() || profile.firstName.trim().length < 2)
      errors.firstName = 'First name must be at least 2 characters';
    if (!profile.lastName.trim() || profile.lastName.trim().length < 2)
      errors.lastName = 'Last name must be at least 2 characters';
    if (!profile.password) {
      errors.password = 'Password is required';
    } else if (profile.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!PASSWORD_REGEX.test(profile.password)) {
      errors.password = 'Must include uppercase, lowercase, number, and special character';
    }
    return errors;
  };

  // ─── Step 1 submit — send email OTP ────────────────────────────────────────
  const handleStep1 = async () => {
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    try {
      setIsLoading(true);
      const res = await api.post('/auth/send-email-otp', {
        email: contact.email.trim().toLowerCase(),
        phoneNumber: fullPhone,
      });
      setOtpUserId(res.data?.userId || res.userId);
      setOtpDevCode(res.data?.devOtp || res.devOtp || null);
      setCurrentStep(2);
    } catch (err) {
      if (err instanceof APIError) toast.error(err.message);
      else toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2 — OTP verified callback ────────────────────────────────────────
  const handleOtpEmailVerified = () => {
    setCurrentStep(3);
  };

  // ─── Step 3 — verify BVN ───────────────────────────────────────────────────
  const handleVerifyBVN = async () => {
    if (kyc.bvn.length !== 11) { setFieldErrors(p => ({ ...p, bvn: 'BVN must be 11 digits' })); return; }
    try {
      setKycVerifying(p => ({ ...p, bvn: true }));
      clearErr('bvn');
      await api.post('/auth/verify-bvn', { bvn: kyc.bvn });
      setKycVerified(p => ({ ...p, bvn: true }));
      toast.success('BVN verified successfully');
    } catch (err) {
      toast.error(err.message || 'BVN verification failed');
      setFieldErrors(p => ({ ...p, bvn: err.message || 'BVN verification failed' }));
    } finally {
      setKycVerifying(p => ({ ...p, bvn: false }));
    }
  };

  // ─── Step 3 — verify NIN ───────────────────────────────────────────────────
  const handleVerifyNIN = async () => {
    if (kyc.nin.length !== 11) { setFieldErrors(p => ({ ...p, nin: 'NIN must be 11 digits' })); return; }
    if (!kyc.dateOfBirth) { setFieldErrors(p => ({ ...p, dateOfBirth: 'Enter date of birth before verifying NIN' })); return; }
    try {
      setKycVerifying(p => ({ ...p, nin: true }));
      clearErr('nin');
      await api.post('/auth/verify-nin', { nin: kyc.nin, dateOfBirth: kyc.dateOfBirth });
      setKycVerified(p => ({ ...p, nin: true }));
      toast.success('NIN verified successfully');
    } catch (err) {
      toast.error(err.message || 'NIN verification failed');
      setFieldErrors(p => ({ ...p, nin: err.message || 'NIN verification failed' }));
    } finally {
      setKycVerifying(p => ({ ...p, nin: false }));
    }
  };

  const handleStep3 = () => {
    const errors = validateStep3();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setCurrentStep(4);
  };

  // ─── Step 4 submit — final registration ────────────────────────────────────
  const handleStep4 = async () => {
    const errors = validateStep4();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    try {
      setIsLoading(true);
      const result = await signup({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email: contact.email.trim().toLowerCase(),
        phoneNumber: fullPhone,
        bvn: kyc.bvn,
        nin: kyc.nin,
        dateOfBirth: kyc.dateOfBirth,
        password: profile.password,
      });
      if (result?.requiresOtp) {
        setLoginOtpState({ userId: result.userId, phoneNumber: result.phoneNumber, devOtp: result.devOtp });
      }
    } catch (err) {
      if (err instanceof APIError) {
        toast.error(err.message);
        if (err.errors?.length > 0) {
          const fe = {};
          err.errors.forEach(e => { fe[e.field] = e.message; });
          setFieldErrors(fe);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOtpSuccess = ({ user, token }) => {
    completeOtpLogin(user, token);
    setSuccess(true);
  };

  // ─── DOB auto-format ───────────────────────────────────────────────────────
  const handleDobChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 6) formatted = `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6)}`;
    else if (digits.length > 4) formatted = `${digits.slice(0,4)}-${digits.slice(4)}`;
    setKyc(p => ({ ...p, dateOfBirth: formatted }));
    clearErr('dateOfBirth');
    // Reset NIN verification if DOB changes (NIN verify uses DOB)
    if (kycVerified.nin) {
      setKycVerified(p => ({ ...p, nin: false }));
    }
  };

  // ─── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Account Created!</h3>
        <p className="text-white/80 mb-4">Your wallet has been created automatically.</p>
        <LoadingSpinner size="md" text="Redirecting to dashboard..." />
      </div>
    );
  }

  // ─── Login 2FA OTP after registration ─────────────────────────────────────
  if (loginOtpState) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-white text-center mb-4">Verify Your Identity</h3>
        <p className="text-sm text-white/70 text-center mb-4">We've sent a code to your phone to complete sign-in.</p>
        <OtpVerification
          userId={loginOtpState.userId}
          phoneNumber={loginOtpState.phoneNumber}
          devOtp={loginOtpState.devOtp}
          onSuccess={handleLoginOtpSuccess}
          onBack={() => setLoginOtpState(null)}
        />
      </div>
    );
  }

  // ─── Step 2 — email OTP verification ──────────────────────────────────────
  if (currentStep === 2) {
    return (
      <div>
        <StepIndicator current={2} total={4} labels={STEPS} />
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-1">Verify Your Email</h2>
          <p className="text-sm text-white/70">
            A 6-digit code was sent to <span className="font-semibold">{contact.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}</span>
          </p>
        </div>
        <OtpVerification
          userId={otpUserId}
          devOtp={otpDevCode}
          onSuccess={handleOtpEmailVerified}
          onBack={() => setCurrentStep(1)}
          verifyEndpoint="/auth/verify-email-otp"
        />
      </div>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <div>
      <StepIndicator current={currentStep} total={4} labels={STEPS} />

      {/* ── Step 1: Contact Info ────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-white mb-1">Contact Information</h2>
            <p className="text-xs text-white/60">We'll send a verification code to your email</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
            <input
              type="email" value={contact.email} placeholder="you@example.com"
              className={inputCls('email')} autoComplete="email" disabled={isLoading}
              onChange={e => { setContact(p => ({ ...p, email: e.target.value })); clearErr('email'); }}
            />
            {fieldErrors.email && <Err msg={fieldErrors.email} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
            <div className={`flex items-center border-2 rounded-xl overflow-hidden transition duration-200 ${fieldErrors.localPhone ? 'border-red-400' : 'border-white/20 hover:border-white/40'}`}>
              <span className="px-3 py-3 bg-white/10 border-r border-white/20 text-sm font-semibold text-white whitespace-nowrap">🇳🇬 +234</span>
              <input
                type="tel" value={contact.localPhone} placeholder="8012345678" maxLength={10}
                className="flex-1 px-3 py-3 focus:outline-none bg-transparent text-white placeholder:text-white/60"
                disabled={isLoading}
                onChange={e => { setContact(p => ({ ...p, localPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })); clearErr('localPhone'); }}
              />
            </div>
            {fieldErrors.localPhone ? <Err msg={fieldErrors.localPhone} /> : <Hint msg="10-digit number after +234" />}
          </div>

          <NavButton label="Continue →" onClick={handleStep1} loading={isLoading} />
        </div>
      )}

      {/* ── Step 3: KYC ─────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-white mb-1">Verify Your Identity</h2>
            <p className="text-xs text-white/60">BVN and NIN verification is required for your security</p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-3">
            <p className="text-xs text-white/80">Enter your BVN and NIN, then tap Verify for each. Date of birth is required to verify your NIN.</p>
          </div>

          {/* Date of Birth first — NIN verify depends on it */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Date of Birth *</label>
            <input
              type="text" value={kyc.dateOfBirth} placeholder="YYYY-MM-DD"
              maxLength={10} inputMode="numeric"
              className={inputCls('dateOfBirth')} disabled={isLoading}
              onChange={handleDobChange}
            />
            {fieldErrors.dateOfBirth ? <Err msg={fieldErrors.dateOfBirth} /> : <Hint msg="You must be at least 18 years old" />}
          </div>

          {/* BVN */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">BVN (11 digits) *</label>
            <div className="flex gap-2">
              <input
                type="text" value={kyc.bvn} placeholder="12345678901" maxLength={11}
                className={`flex-1 ${inputCls('bvn')}`}
                disabled={isLoading || kycVerified.bvn}
                onChange={e => { setKyc(p => ({ ...p, bvn: e.target.value.replace(/\D/g, '').slice(0, 11) })); setKycVerified(p => ({ ...p, bvn: false })); clearErr('bvn'); }}
              />
              <button
                type="button" onClick={handleVerifyBVN}
                disabled={isLoading || kycVerifying.bvn || kyc.bvn.length !== 11 || kycVerified.bvn}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 min-w-[90px] ${
                  kycVerified.bvn ? 'bg-green-500 text-white' :
                  kyc.bvn.length !== 11 ? 'bg-white/10 text-white/40 cursor-not-allowed' :
                  'bg-white/20 hover:bg-white/30 text-white border border-white/40'
                }`}
              >
                {kycVerifying.bvn ? <Loader size={16} className="animate-spin mx-auto" /> : kycVerified.bvn ? '✓ Verified' : 'Verify'}
              </button>
            </div>
            {fieldErrors.bvn ? <Err msg={fieldErrors.bvn} /> : <Hint msg={`Bank Verification Number (${kyc.bvn.length}/11)`} />}
          </div>

          {/* NIN */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">NIN (11 digits) *</label>
            <div className="flex gap-2">
              <input
                type="text" value={kyc.nin} placeholder="12345678901" maxLength={11}
                className={`flex-1 ${inputCls('nin')}`}
                disabled={isLoading || kycVerified.nin}
                onChange={e => { setKyc(p => ({ ...p, nin: e.target.value.replace(/\D/g, '').slice(0, 11) })); setKycVerified(p => ({ ...p, nin: false })); clearErr('nin'); }}
              />
              <button
                type="button" onClick={handleVerifyNIN}
                disabled={isLoading || kycVerifying.nin || kyc.nin.length !== 11 || !kyc.dateOfBirth || kycVerified.nin}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 min-w-[90px] ${
                  kycVerified.nin ? 'bg-green-500 text-white' :
                  kyc.nin.length !== 11 || !kyc.dateOfBirth ? 'bg-white/10 text-white/40 cursor-not-allowed' :
                  'bg-white/20 hover:bg-white/30 text-white border border-white/40'
                }`}
              >
                {kycVerifying.nin ? <Loader size={16} className="animate-spin mx-auto" /> : kycVerified.nin ? '✓ Verified' : 'Verify'}
              </button>
            </div>
            {fieldErrors.nin ? <Err msg={fieldErrors.nin} /> : <Hint msg={`National Identification Number (${kyc.nin.length}/11)`} />}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCurrentStep(1)} disabled={isLoading} className="flex-1 py-3 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition">← Back</button>
            <button type="button" onClick={handleStep3} disabled={isLoading} className="flex-1 py-3 rounded-xl font-semibold bg-white/20 hover:bg-white/30 text-white border border-white/40 transition">Continue →</button>
          </div>
        </div>
      )}

      {/* ── Step 4: Name + Password ──────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-white mb-1">Complete Your Profile</h2>
            <p className="text-xs text-white/60">Almost done — just your name and a secure password</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[['firstName', 'First Name', 'John', 'given-name'], ['lastName', 'Last Name', 'Doe', 'family-name']].map(([name, label, ph, ac]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-white mb-2">{label} *</label>
                <input
                  type="text" value={profile[name]} placeholder={ph} autoComplete={ac}
                  className={inputCls(name)} disabled={isLoading}
                  onChange={e => { setProfile(p => ({ ...p, [name]: e.target.value })); clearErr(name); }}
                />
                {fieldErrors[name] && <Err msg={fieldErrors[name]} />}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password *</label>
            <div className={`relative border-2 rounded-xl transition duration-200 ${fieldErrors.password ? 'border-red-400' : 'border-white/20 hover:border-white/40 focus-within:border-white/60'}`}>
              <input
                type={profile.showPassword ? 'text' : 'password'}
                value={profile.password} placeholder="Create a strong password"
                autoComplete="new-password"
                className="w-full px-4 py-3 focus:outline-none bg-transparent pr-12 rounded-xl text-white placeholder:text-white/60"
                disabled={isLoading}
                onChange={e => { setProfile(p => ({ ...p, password: e.target.value })); clearErr('password'); }}
              />
              <button
                type="button" tabIndex={-1}
                onClick={() => setProfile(p => ({ ...p, showPassword: !p.showPassword }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                {profile.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldErrors.password ? <Err msg={fieldErrors.password} /> : <Hint msg={PASSWORD_HINT} />}

            {/* Live password strength indicator */}
            {profile.password && <PasswordStrength password={profile.password} />}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCurrentStep(3)} disabled={isLoading} className="flex-1 py-3 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition">← Back</button>
            <button type="button" onClick={handleStep4} disabled={isLoading} className={`flex-1 py-3 rounded-xl font-semibold transition ${isLoading ? 'bg-white/10 cursor-not-allowed text-white/50' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              {isLoading ? <div className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" text="" /><span>Creating...</span></div> : 'Create Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Err = ({ msg }) => (
  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3 flex-shrink-0" />{msg}
  </p>
);

const Hint = ({ msg }) => (
  <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
    <Info className="w-3 h-3 flex-shrink-0" />{msg}
  </p>
);

const NavButton = ({ label, onClick, loading }) => (
  <button
    type="button" onClick={onClick} disabled={loading}
    className={`w-full py-3 rounded-xl font-semibold transition duration-200 ${
      loading ? 'bg-white/10 cursor-not-allowed text-white/50' : 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
    }`}
  >
    {loading
      ? <div className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" text="" /><span>Sending...</span></div>
      : label}
  </button>
);

const StepIndicator = ({ current, total, labels }) => (
  <div className="flex justify-between mb-6">
    {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
      <div key={step} className="flex items-center flex-1">
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
            step < current ? 'bg-green-500 text-white' :
            step === current ? 'bg-white/20 text-white border-2 border-white/60 ring-2 ring-white/20' :
            'bg-white/10 text-white/40'
          }`}>
            {step < current ? <CheckCircle size={16} /> : step}
          </div>
          <span className={`text-[10px] hidden sm:block font-medium ${step === current ? 'text-white' : 'text-white/40'}`}>
            {labels[step - 1]}
          </span>
        </div>
        {step < total && (
          <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${step < current ? 'bg-green-500' : 'bg-white/20'}`} />
        )}
      </div>
    ))}
  </div>
);

// Live password strength — matches mobile's requirement set
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ chars',     pass: password.length >= 8 },
    { label: 'Uppercase',    pass: /[A-Z]/.test(password) },
    { label: 'Lowercase',    pass: /[a-z]/.test(password) },
    { label: 'Number',       pass: /\d/.test(password) },
    { label: 'Special char', pass: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];
  const passed = checks.filter(c => c.pass).length;
  const color = passed <= 2 ? 'bg-red-500' : passed <= 3 ? 'bg-yellow-500' : passed === 4 ? 'bg-blue-400' : 'bg-green-500';

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {checks.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passed ? color : 'bg-white/20'}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(c => (
          <span key={c.label} className={`text-[10px] font-medium ${c.pass ? 'text-green-400' : 'text-white/40'}`}>
            {c.pass ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SignupSteps;
