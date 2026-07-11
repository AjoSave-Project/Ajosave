import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Play, Monitor } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import HomeNavbar from '../components/layout/HomeNavbar'
import HomeFooter from '../components/layout/HomeFooter'
import PlayStoreButton from '../components/common/PlayStoreButton'
import AppStoreButton from '../components/common/AppStoreButton'

import heroImage from '../assets/images/vitaly-gariev-uFF_apyZ-l8-unsplash.jpg'
import signupImage from '../assets/images/Signup.jpeg'
import groupImage from '../assets/images/Group.jpeg'
import paymentImage from '../assets/images/Payment.jpeg'
import walletImage from '../assets/images/Wallet.jpeg'
import dashboardImage from '../assets/images/Dashboard.jpeg'
import webDashboardImage from '../assets/images/webDashboard.png'

const STEPS_DATA = [
  {
    id: 1,
    title: "1. Verified Account Creation",
    desc: "Sign up securely with your phone number and identity validation, protected by strict data safety parameters.",
    image: signupImage,
    alt: "Secure Account Identity Setup"
  },
  {
    id: 2,
    title: "2. Clear Group Customization",
    desc: "Evaluate existing rotating cycles or deploy a customized setup tracking target metrics, timeline orders, and specific member quotas.",
    image: groupImage,
    alt: "Community Cycle Setup Interface"
  },
  {
    id: 3,
    title: "3. Direct Transaction Logs",
    desc: "Execute and automate manual or programmatic ledger collections with structural status logs updating instantly.",
    image: paymentImage,
    alt: "Transaction Pipeline Verification"
  },
  {
    id: 4,
    title: "4. Automated Wallet Settlement",
    desc: "Track total baseline balances and route instant payouts straight into destination accounts exactly on your scheduled turn.",
    image: walletImage,
    alt: "Wallet Capital Routing Frame"
  },
  {
    id: 5,
    title: "5. Centralized System Dashboard",
    desc: "Monitor group activity metrics, upcoming contributions, and cycle analytics straight from an integrated control board.",
    image: dashboardImage,
    alt: "Analytics Control Panel View"
  }
]

const SYSTEM_STATUS_CARDS = [
  {
    icon: Monitor,
    title: "Shipped Architecture",
    bgColor: "bg-blue-100",
    iconColor: "text-deepBlue-600",
    features: [
      "Real-time ledger sync",
      "Automated group rotation engine",
      "Cross-platform database state"
    ],
    statusColor: "emerald-400"
  },
  {
    icon: () => (
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    ),
    title: "In Active Production",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "Webhook retries for payment failures",
      "Automated system alerts & notifications",
      "API performance optimization"
    ],
    statusColor: "blue-400"
  },
  {
    icon: CheckCircle,
    title: "Compliance Guardrail",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-700",
    description: "We respect your cash flow rules. We are actively finalizing operational partnerships with fully regulated financial institutions to ensure all cycle funds are securely processed in licensed environments."
  }
]

const METRICS_DATA = [
  { value: "6+", label: "Months in Dev" },
  { value: "100%", label: "Verifiable Code" },
  { value: "24/7", label: "Support Channel" },
  { value: "Beta", label: "Current State" }
]

const WEB_FEATURES = [
  "Desktop Optimized",
  "Advanced Analytics", 
  "Real-time State Sync",
  "Direct Data Export"
]

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    if (isAuthenticated && user) {
      setShowWelcomeBack(true)
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-deepBlue-600 mx-auto mb-4"></div>
          <p className="text-deepBlue-700 font-medium text-sm tracking-tight">Initializing AjoSave...</p>
        </div>
      </div>
    )
  }

  if (showWelcomeBack && user) {
    return (
      <div className="min-h-screen bg-deepBlue-50/60 flex items-center justify-center">
        <div className="text-center bg-white border border-deepBlue-100 rounded-xl p-8 max-w-md mx-4 shadow-sm">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-deepBlue-800 mb-1 tracking-tight">
            Welcome back, {user.firstName}
          </h2>
          <p className="text-sm text-deepBlue-600 mb-6">
            Syncing your session and redirecting to your dashboard...
          </p>
          <div className="w-full bg-deepBlue-50 h-1 rounded-full overflow-hidden">
            <div className="bg-deepBlue-600 h-full w-2/3 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-white text-deepBlue-800 antialiased home-page-scrollbar selection:bg-deepBlue-50">
        <HomeNavbar />

        <div
          className="relative pt-24 pb-32 min-h-screen flex items-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.6)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            paddingTop: '140px',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4vw), 0 100%)',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 relative z-10 w-full">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-12 space-y-4 text-center">
                <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl mx-auto">
                  Bringing transparency to traditional <span className="text-blue-300">Ajo.</span>
                </h1>

                <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto animate-matte-reveal">
                  We're building a digital platform that brings traditional group savings into the modern age, making it easier to save money with your community.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 justify-center">
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-white text-deepBlue-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm shadow-lg backdrop-blur-sm"
                  >
                    Join the Beta Program <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                  onClick={() => navigate('/how-it-works')}
                  className="flex items-center justify-center gap-2 text-white hover:text-blue-300 font-medium px-5 py-3 text-sm transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20">
                    <Play className="w-4 h-4 fill-current" />
                    <span>System Walkthrough</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <div className="flex gap-3 opacity-90">
                    <PlayStoreButton size="sm" />
                    <AppStoreButton size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="relative bg-deepBlue-600 pt-32 pb-36 overflow-hidden -mt-[4vw]"
          style={{
            clipPath: 'polygon(0 4vw, 100% 0, 100% calc(100% - 4vw), 0 100%)',
          }}
        >
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="max-w-2xl mb-14">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Our Current Status</h2>
              <p className="text-2xl font-bold tracking-tight text-white">
                No sweeping promises. Just structured Development to solve a real trust problem.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {SYSTEM_STATUS_CARDS.map((card, index) => (
                <div key={index} className="p-6 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl space-y-4">
                  <div className={`w-8 h-8 ${card.bgColor} ${card.iconColor} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-base">{card.title}</h3>
                  {card.features ? (
                    <ul className="space-y-2.5 text-sm text-blue-100">
                      {card.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full bg-${card.statusColor}`}></span> {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-blue-100 leading-relaxed">{card.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-deepBlue-50/20 py-20 border-b border-deepBlue-100/60">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-deepBlue-800 mb-3">
                One unified platform, optimized across devices.
              </h2>
              <p className="text-sm text-deepBlue-600">
                Manage your rotating contribution cycles seamlessly. Every transaction, member rotation state, and timeline queue updates automatically across all user interfaces.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-5 space-y-7">
                {STEPS_DATA.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${activeStep === step.id
                        ? 'bg-white border-deepBlue-300 shadow-sm'
                        : 'border-transparent hover:bg-white/60 hover:border-deepBlue-100'
                      }`}
                  >
                    <h4 className={`text-xl font-semibold mb-1 ${activeStep === step.id ? 'text-deepBlue-700' : 'text-deepBlue-800'}`}>
                      {step.title}
                    </h4>
                    {activeStep === step.id && (
                      <p className="text-lg text-deepBlue-600 leading-relaxed mt-1 animate-fadeIn">
                        {step.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7 flex justify-center lg:justify-end">
                <div className="w-full max-w-[235px]">
                  <div className="bg-gray-900 rounded-[2rem] p-2 shadow-xl mx-auto">
                    <div className="bg-white rounded-[1.5rem] overflow-hidden w-full h-[460px] flex flex-col">
                      <div className="bg-gray-900 h-6 flex justify-center items-center flex-shrink-0">
                        <div className="w-19 h-3 bg-black rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-0">
                        <img
                          src={STEPS_DATA[activeStep - 1].image}
                          alt={STEPS_DATA[activeStep - 1].alt}
                          className="max-w-full max-h-full object-contain transition-opacity duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-20 border-b border-deepBlue-100/60">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-2xl font-bold tracking-tight text-deepBlue-800">
                  Full-Featured Web Dashboard
                </h3>
                <p className="text-sm text-deepBlue-600 leading-relaxed">
                  Prefer a larger viewport? Access identical functional capabilities optimized directly for your laptop or desktop system. Perform bulk analytics operations and overview transaction histories systematically.
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-deepBlue-700 pt-2">
                  {WEB_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-deepBlue-50/30 border border-deepBlue-100 rounded-xl p-2 shadow-sm">
                  <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-lg">
                    <div className="bg-slate-800 px-4 py-2 flex items-center gap-3 border-b border-slate-700">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                      </div>
                      <div className="flex-1 bg-slate-950/40 rounded px-3 py-0.5 text-[10px] text-slate-400 max-w-xs font-mono truncate">
                        app.ajosave.com/dashboard
                      </div>
                    </div>
                    <img
                      src={webDashboardImage}
                      alt="AjoSave Production Web Interface"
                      className="w-full h-auto object-cover opacity-95"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-deepBlue-800 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {METRICS_DATA.map((metric, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-3xl font-extrabold text-green-400">{metric.value}</div>
                  <div className="text-xs text-deepBlue-200 uppercase tracking-wider font-semibold">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="border border-deepBlue-800 bg-deepBlue-800 text-white rounded-2xl p-8 lg:p-12 relative overflow-hidden grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4 z-10">
              <h3 className="text-2xl font-bold tracking-tight">Help us build the absolute standard for transparent savings.</h3>
              <p className="text-deepBlue-200 text-sm max-w-xl leading-relaxed">
                We are actively looking for dedicated beta users to push our transaction queues, evaluate interface state flows, and tell us exactly where the engine breaks. Your critical feedback maps our direct code roadmap.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-deepBlue-100 font-mono">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> Free Platform Access</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> Influence Feature Specs</span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end z-10">
              <button
                onClick={() => navigate('/auth')}
                className="bg-white text-deepBlue-800 px-6 py-3.5 rounded-lg font-semibold hover:bg-deepBlue-50 transition-colors text-sm shadow-sm whitespace-nowrap text-center w-full md:w-auto"
              >
                Access Beta Environment
              </button>
              <button
                onClick={() => navigate('/privacy-policy')}
                className="text-xs text-deepBlue-200 hover:text-white underline text-center pt-1"
              >
                Review Privacy Terms
              </button>
            </div>
          </div>
        </div>

        <HomeFooter />
      </div>
  )
}

export default Home