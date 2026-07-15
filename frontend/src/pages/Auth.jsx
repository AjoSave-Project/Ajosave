import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../components/auth/Login'
import SignupSteps from '../components/auth/SignupSteps'
import { ArrowLeft, Shield, CheckCircle, Users, Zap } from 'lucide-react'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const { loading, isAuthenticated, pendingOtp } = useAuth()

  // Navigate to dashboard once auth is fully complete
  useEffect(() => {
    if (!loading && isAuthenticated && !pendingOtp) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, pendingOtp, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-48 h-px bg-deepBlue-200 mx-auto mb-6"></div>
            <div className="relative w-48 h-16 mx-auto overflow-hidden">
              <div className="absolute inset-0 flex items-center animate-slide-carousel">
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-600 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-deepBlue-200 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Users className="w-6 h-6 text-deepBlue-600" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-800 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-600 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-deepBlue-200 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Users className="w-6 h-6 text-deepBlue-600" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-800 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="w-48 h-px bg-deepBlue-200 mx-auto mt-6"></div>
          </div>
          <p className="text-deepBlue-700 font-medium text-sm tracking-tight">Loading</p>
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
    <div className="min-h-screen bg-white text-deepBlue-800 antialiased selection:bg-deepBlue-50 overflow-x-hidden">
      {/* Hero Section with Background */}
      <div 
        className="relative min-h-screen flex flex-col lg:flex-row lg:items-center overflow-hidden"
        style={{
         backgroundImage: `linear-gradient(to bottom right, #172033, #0c4a6e)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)',
        }}
      >
        <div className="relative z-10 w-full flex-1">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-0">
            {/* Navigation Header */}
            <div className="flex items-center justify-between pt-4 lg:pt-8 pb-8 lg:pb-16">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="text-right">
                <div className="text-white font-bold text-xl tracking-tight">AjoSave</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center pb-8 lg:pb-20">
              {/* Left Side - Marketing Content */}
              <div className="lg:col-span-6 space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300 block">Secure Authentication</span>
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                    Join the future of <span className="text-blue-300">group savings</span>.
                  </h1>
                  <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-xl">
                    Experience transparent, digital Ajo with verified members and automated rotations. Your money, your community, secured by technology.
                  </p>
                </div>

                {/* Feature Cards - Hidden on Mobile */}
                <div className="hidden lg:block space-y-4 pt-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                        <p className="text-xs text-blue-100 leading-relaxed mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Auth Form */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8">
                    {/* Tab Navigation */}
                    <div className="flex items-center justify-center mb-6 lg:mb-8">
                      <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm border border-white/20">
                        <button
                          onClick={() => setActiveTab('login')}
                          className={`flex-1 px-3 py-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                            activeTab === 'login'
                              ? 'bg-white/20 text-white shadow-lg'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => setActiveTab('signup')}
                          className={`flex-1 py-3 px-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
                            activeTab === 'signup'
                              ? 'bg-white/20 text-white shadow-lg'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>

                    {/* Form Title */}
                    <div className="text-center mb-6 lg:mb-8">
                      <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                        {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
                      </h2>
                      <p className="text-sm text-white/80 mt-2">
                        {activeTab === 'login' 
                          ? 'Sign in to access your savings dashboard' 
                          : 'Join our beta program and start saving with your community'
                        }
                      </p>
                    </div>

                    {/* Auth Components */}
                    <div className="space-y-4 lg:space-y-6">
                      {activeTab === 'login' ? (
                        <Login />
                      ) : (
                        <SignupSteps />
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
