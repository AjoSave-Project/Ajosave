import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../components/auth/Login'
import SignupSteps from '../components/auth/SignupSteps'
import ForgotPassword from '../components/auth/ForgotPassword'
import ResetPassword from '../components/auth/ResetPassword'
import { ArrowLeft, Shield, CheckCircle, Users, Zap } from 'lucide-react'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [resetPasswordData, setResetPasswordData] = useState(null)
  const navigate = useNavigate()
  const { loading, isAuthenticated, pendingOtp } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated && !pendingOtp) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, pendingOtp, loading, navigate])

  const handleForgotPassword = () => {
    setActiveTab('forgotPassword')
  }

  const handleOtpSent = (data) => {
    setResetPasswordData(data)
    setActiveTab('resetPassword')
  }

  const handleResetSuccess = () => {
    setResetPasswordData(null)
    setActiveTab('login')
  }

  const handleBackToLogin = () => {
    setResetPasswordData(null)
    setActiveTab('login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-48 h-px bg-slate-700 mx-auto mb-6"></div>
            <div className="relative w-48 h-16 mx-auto overflow-hidden">
              <div className="absolute inset-0 flex items-center animate-slide-carousel">
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-600 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Users className="w-6 h-6 text-deepBlue-400" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-800 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="w-48 h-px bg-slate-700 mx-auto mt-6"></div>
          </div>
          <p className="text-slate-300 font-medium text-sm tracking-tight">Loading session...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      desc: "Your data is protected by enterprise-grade encryption"
    },
    {
      icon: Users,
      title: "Trusted Community",
      desc: "Join verified groups with identity-checked members"
    },
    {
      icon: CheckCircle,
      title: "Transparent System",
      desc: "Every transaction is recorded and visible to your group"
    }
  ]

  return (
    <div className="min-h-screen text-slate-100 antialiased selection:bg-deepBlue-500/20 overflow-x-hidden">
      {/* Hero Section with Slanted Background */}
      <div 
        className="relative min-h-screen flex flex-col justify-between overflow-hidden pb-16"
        style={{
          backgroundImage: `linear-gradient(to bottom right, #1f4fad, #0e2657)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8vw), 0 100%)',
        }}
      >
        <div className="relative z-10 w-full flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Top Navigation */}
            <div className="flex items-center justify-between py-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3.5 py-2 rounded-xl hover:bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              
              <div className="text-right">
                <div className="text-white font-extrabold text-xl tracking-tight">AjoSave</div>
              </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 lg:py-10">
              
              {/* Left Side Marketing Text */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-deepBlue-300 block">
                    Secure Authentication
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Join the future of <span className="text-deepBlue-300 underline decoration-wavy decoration-deepBlue-300/40 underline-offset-4">group savings</span>.
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
                    Experience transparent, digital Ajo with verified members and automated rotations. Your money, your community, secured by technology.
                  </p>
                </div>

                {/* Feature Pills */}
                <div className="hidden lg:grid gap-3 pt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                      <div className="w-8 h-8 bg-deepBlue-500/20 rounded-lg flex items-center justify-center shrink-0 border border-deepBlue-400/30">
                        <feature.icon className="w-4 h-4 text-deepBlue-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-xs sm:text-sm">{feature.title}</h3>
                        <p className="text-xs text-deepBlue-100/80 leading-relaxed mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side Form Container */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <div className=" linear-gradient(to bottom right, #153f91ff, #0e2657) backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-7">
                    
                    {/* Tab Navigation Toggle */}
                    {activeTab !== 'forgotPassword' && activeTab !== 'resetPassword' && (
                      <div className="flex bg-white/10 rounded-xl p-1 border border-white/15 mb-6">
                        <button
                          onClick={() => setActiveTab('login')}
                          className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm ${
                            activeTab === 'login'
                              ? 'bg-deepBlue-600 text-white shadow-md'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setActiveTab('signup')}
                          className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm ${
                            activeTab === 'signup'
                              ? 'bg-deepBlue-600 text-white shadow-md'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>
                    )}

                    {/* Header Banner */}
                    <div className="text-center mb-5">
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {activeTab === 'login' && 'Welcome back'}
                        {activeTab === 'signup' && 'Create your account'}
                        {activeTab === 'forgotPassword' && 'Reset Password'}
                        {activeTab === 'resetPassword' && 'Reset Password'}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1">
                        {activeTab === 'login' && 'Sign in to access your savings dashboard'}
                        {activeTab === 'signup' && 'Join our beta program and start saving'}
                        {activeTab === 'forgotPassword' && 'Enter your details to receive a verification code'}
                        {activeTab === 'resetPassword' && 'Enter the code and your new password'}
                      </p>
                    </div>

                    {/* Auth Components */}
                    <div>
                      {activeTab === 'login' && <Login onForgotPassword={handleForgotPassword} />}
                      {activeTab === 'signup' && <SignupSteps />}
                      {activeTab === 'forgotPassword' && (
                        <ForgotPassword onBack={handleBackToLogin} onOtpSent={handleOtpSent} />
                      )}
                      {activeTab === 'resetPassword' && resetPasswordData && (
                        <ResetPassword
                          userId={resetPasswordData.userId}
                          email={resetPasswordData.email}
                          phoneNumber={resetPasswordData.phoneNumber}
                          onSuccess={handleResetSuccess}
                          onBack={handleBackToLogin}
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth