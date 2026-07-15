import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Play, Monitor, ChevronDown, ExternalLink, MessageCircle, User } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useAuth } from '../context/AuthContext'
import HomeNavbar from '../components/layout/HomeNavbar'
import HomeFooter from '../components/layout/HomeFooter'
import PlayStoreButton from '../components/common/PlayStoreButton'
import AppStoreButton from '../components/common/AppStoreButton'

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

import heroImage from '../assets/images/vitaly-gariev-uFF_apyZ-l8-unsplash.jpg'
import signupImage from '../assets/images/Signup.jpeg'
import groupImage from '../assets/images/Group.jpeg'
import paymentImage from '../assets/images/Payment.jpeg'
import walletImage from '../assets/images/Wallet.jpeg'
import dashboardImage from '../assets/images/Dashboard.jpeg'
import webDashboardImage from '../assets/images/webDashboard.png'

// Move static data outside component to prevent recreation on every render
const STEPS_DATA = [
  {
    id: 1,
    title: "1. Create Your Account",
    desc: "Sign up securely with your phone number. We verify your identity to keep everyone safe and build trust in the community.",
    image: signupImage,
    alt: "Secure Account Setup"
  },
  {
    id: 2,
    title: "2. Join or Start a Group",
    desc: "Find an existing savings group that fits your goals, or create your own with friends, family, or colleagues.",
    image: groupImage,
    alt: "Savings Group Setup"
  },
  {
    id: 3,
    title: "3. Make Regular Contributions",
    desc: "Set up automatic payments or contribute manually. Every transaction is tracked and visible to all group members.",
    image: paymentImage,
    alt: "Easy Payment Process"
  },
  {
    id: 4,
    title: "4. Receive Your Payout",
    desc: "When it's your turn in the rotation, receive the full pot directly into your bank account. No delays, no complications.",
    image: walletImage,
    alt: "Secure Wallet Management"
  },
  {
    id: 5,
    title: "5. Track Your Progress",
    desc: "See your savings grow, monitor group activity, and stay on top of upcoming contributions with our simple dashboard.",
    image: dashboardImage,
    alt: "Easy-to-Use Dashboard"
  }
]

// Memoized extended steps data
const EXTENDED_STEPS_DATA = [
  {
    id: 0,
    title: "Initial",
    desc: "Starting point",
    image: signupImage,
    alt: "Initial Step"
  },
  ...STEPS_DATA
]

// Memoized spinner component to prevent recreation
const SpinnerIcon = memo(() => (
  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
))

const SYSTEM_STATUS_CARDS = [
  {
    icon: Monitor,
    title: "What's Working Now",
    bgColor: "bg-blue-100",
    iconColor: "text-deepBlue-600",
    features: [
      "Live balance updates",
      "Automatic group rotations",
      "Works on all your devices"
    ],
    statusColor: "emerald-400"
  },
  {
    icon: SpinnerIcon,
    title: "Currently Improving",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "Better payment reliability",
      "Faster notifications",
      "Improved app performance"
    ],
    statusColor: "blue-400"
  },
  {
    icon: CheckCircle,
    title: "Your Money is Safe",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-700",
    description: "We work with licensed financial institutions to ensure all your savings are processed securely and protected by banking regulations."
  }
]

const METRICS_DATA = [
  { value: "6+", label: "Months in Dev" },
  { value: "100%", label: "Verifiable Code" },
  { value: "24/7", label: "Support Channel" },
  { value: "Beta", label: "Current State" }
]

const WEB_FEATURES = [
  "Works Great on Computers",
  "Detailed Savings Reports",
  "Always Up to Date",
  "Download Your Data"
]

const FAQ_DATA = [
  {
    id: 1,
    question: "How is this different from traditional Ajo?",
    answer: "AjoSave brings the trusted concept of traditional Ajo (rotating savings groups) online with full transparency. Every contribution, payout, and group activity is tracked digitally, making it easier to manage and more secure than cash-based systems."
  },
  {
    id: 2,
    question: "Is my money safe with AjoSave?",
    answer: "Yes. We partner with licensed financial institutions and follow banking regulations to ensure your money is protected. All transactions are encrypted and we never store your funds - they move directly between verified group members."
  },
  {
    id: 3,
    question: "What happens if someone doesn't pay?",
    answer: "We have several built-in protections: identity verification for all members, payment reminders, and group accountability features. If issues arise, our support team helps resolve them, and we're developing additional safeguards based on beta user feedback."
  },
  {
    id: 4,
    question: "Can I leave a group early?",
    answer: "Group policies vary, but generally you can leave after receiving your payout or by mutual agreement with other members. The app shows each group's specific rules before you join, so there are no surprises."
  },
  {
    id: 5,
    question: "How do I know when it's my turn to receive money?",
    answer: "The app automatically tracks the rotation schedule and sends notifications before your turn. You can also see the full schedule in your dashboard, so you always know exactly when to expect your payout."
  },
  {
    id: 6,
    question: "What devices can I use AjoSave on?",
    answer: "AjoSave works on smartphones (iOS and Android), tablets, and computers. Everything syncs across all your devices so you can check your savings progress anywhere."
  }
]

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [openFAQ, setOpenFAQ] = useState(null)
  const [navbarCollapsed, setNavbarCollapsed] = useState(false)

  // Refs for GSAP animations
  const heroSectionRef = useRef(null)
  const secondSectionRef = useRef(null)
  const thirdSectionRef = useRef(null)
  const stepsContainerRef = useRef(null)
  const navbarRef = useRef(null)
  const stepContentRefs = useRef([])
  const phoneImageRef = useRef(null)
  const currentStepRef = useRef(1) // Track current step to avoid stale closure
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  // Memoize navigation handlers to prevent recreation
  const handleJoinBeta = useCallback(() => navigate('/auth'), [navigate])
  const handleHowItWorks = useCallback(() => navigate('/how-it-works'), [navigate])
  const handleContact = useCallback(() => navigate('/contact'), [navigate])
  const handlePrivacyPolicy = useCallback(() => navigate('/privacy-policy'), [navigate])

  // Memoize FAQ toggle handler
  const toggleFAQ = useCallback((faqId) => {
    setOpenFAQ(prev => prev === faqId ? null : faqId)
  }, [])

  // Mobile swipe handlers
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (!touchStartX.current || !touchStartY.current) return
    
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchStartX.current - touchEndX
    const diffY = touchStartY.current - touchEndY
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0 && activeStep < STEPS_DATA.length) {
        // Swipe left - next step
        const newStep = activeStep + 1
        setActiveStep(newStep)
        currentStepRef.current = newStep
      } else if (diffX < 0 && activeStep > 1) {
        // Swipe right - previous step
        const newStep = activeStep - 1
        setActiveStep(newStep)
        currentStepRef.current = newStep
      }
    }
    
    touchStartX.current = 0
    touchStartY.current = 0
  }, [activeStep])

  const goToStep = useCallback((stepNumber) => {
    setActiveStep(stepNumber)
    currentStepRef.current = stepNumber
  }, [])

  // Memoize current step data to prevent unnecessary recalculations
  const currentStepData = useMemo(() => {
    return STEPS_DATA[activeStep - 1]
  }, [activeStep])

  useEffect(() => {
    if (isAuthenticated && user) {
      setShowWelcomeBack(true)
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, navigate])

  // Memoize GSAP animation setup to prevent unnecessary recreations
  const initializeAnimations = useCallback(() => {
    const ctx = gsap.context(() => {
      // Initially position the second section below the viewport
      gsap.set(secondSectionRef.current, {
        y: '100vh',
        opacity: 0
      })

      // Second section animation (blue status section)
      gsap.to(secondSectionRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'bottom 90%',
          end: 'bottom 50%',
          toggleActions: 'play none none none',
          scrub: false,
        }
      })

      // Third section animations
      if (stepContentRefs.current[0] && phoneImageRef.current) {
        // Initially hide for entrance animation
        gsap.set(stepContentRefs.current[0], {
          opacity: 0,
          scale: 0.9,
          y: 30
        })
        gsap.set(phoneImageRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 30
        })

        const pinDuration = EXTENDED_STEPS_DATA.length * 700
        
        // Fade-in animation
        ScrollTrigger.create({
          trigger: thirdSectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          animation: gsap.timeline()
            .to(stepContentRefs.current[0], {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            })
            .to(phoneImageRef.current, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            }, 0.1)
        })

        ScrollTrigger.create({
          trigger: thirdSectionRef.current,
          start: 'top+=200 top',
          end: `+=${pinDuration}vh`,
          pin: true,
          pinSpacing: true,
          scrub: false,
          onEnter: () => {
            setNavbarCollapsed(true)
            setActiveStep(1)
            currentStepRef.current = 1 // Keep ref in sync
          },
          onLeave: () => setNavbarCollapsed(false),
          onEnterBack: () => setNavbarCollapsed(true),
          onLeaveBack: () => setNavbarCollapsed(false),
          onUpdate: (self) => {
            const progress = self.progress
            const adjustedProgress = Math.max(0, Math.min(progress, 0.999))
            const stepIndex = Math.floor(adjustedProgress * EXTENDED_STEPS_DATA.length)
            
            let displayStep
            if (stepIndex <= 1) {
              displayStep = 1  // Both invisible step 0 AND step 1 show display step 1
            } else {
              displayStep = stepIndex  // Step 2+ map directly
            }
            
            // Ensure we're within valid display range (1-5)
            const clampedDisplayStep = Math.max(1, Math.min(displayStep, STEPS_DATA.length))
            
            // Use ref to avoid stale closure issue
            if (clampedDisplayStep !== currentStepRef.current) {
              currentStepRef.current = clampedDisplayStep
              setActiveStep(clampedDisplayStep)
            }
          }
        })
      }

      // FAQ Header Animation
      const faqHeader = document.querySelector('.faq-header');
      if (faqHeader) {
        ScrollTrigger.create({
          trigger: faqHeader,
          start: 'top 80%',
          toggleActions: 'play none none none',
          onEnter: () => {
            faqHeader.classList.add('in-view');
          }
        });
      }

      // Third Section Header Animation
      const thirdSectionHeader = document.querySelector('.third-section-header');
      if (thirdSectionHeader) {
        ScrollTrigger.create({
          trigger: thirdSectionHeader,
          start: 'top 80%',
          toggleActions: 'play none none none',
          onEnter: () => {
            thirdSectionHeader.classList.add('in-view');
          }
        });
      }
    })

    return () => ctx.revert()
  }, []) // ✅ Remove activeStep dependency to prevent recreation

  useEffect(() => {
    if (!loading && !showWelcomeBack) {
      return initializeAnimations()
    }
  }, [loading, showWelcomeBack, initializeAnimations])

  // Clean up ScrollTrigger on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          {/* Profile Cards Carousel */}
          <div className="relative mb-6">
            {/* Top divider */}
            <div className="w-48 h-px bg-white/30 mx-auto mb-6"></div>

            <div className="relative w-48 h-16 mx-auto overflow-hidden">
              <div className="absolute inset-0 flex items-center animate-slide-carousel">
                {/* Card 1 - Blue */}
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-600 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
                {/* Card 2 - White */}
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-deepBlue-200 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <User className="w-6 h-6 text-deepBlue-600" />
                </div>
                {/* Card 3 - Dark Blue */}
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-800 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
                {/* Duplicate cards for seamless loop */}
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-600 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-deepBlue-200 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <User className="w-6 h-6 text-deepBlue-600" />
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-deepBlue-800 rounded-lg flex items-center justify-center mx-2 shadow-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Bottom divider */}
            <div className="w-48 h-px bg-white/30 mx-auto mt-6"></div>
          </div>

          <p className="text-deepBlue-700 font-medium text-sm tracking-tight">Loading</p>
        </div>
      </div>
    )
  }

  if (showWelcomeBack && user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
      <HomeNavbar isCollapsed={navbarCollapsed} />

      <div
        ref={heroSectionRef}
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
              <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl mx-auto overflow-hidden">
                <span className="block animate-slideUpReveal">Bringing transparency to traditional <span className="text-blue-300">Ajo.</span></span>
              </h1>

              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto animate-matte-reveal">
                We're building a digital platform that brings traditional group savings into the modern age, making it easier to save money with your community.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 justify-center">
                <button
                  onClick={handleJoinBeta}
                  className="bg-white text-deepBlue-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm shadow-lg backdrop-blur-sm"
                >
                  Join the Beta Program <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleHowItWorks}
                  className="flex items-center justify-center gap-2 text-white hover:text-blue-300 font-medium px-5 py-3 text-sm transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20">
                  <Play className="w-4 h-4 fill-current" />
                  <span>System Walkthrough</span>
                </button>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center">
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
        ref={secondSectionRef}
        className="relative bg-deepBlue-600 pt-32 pb-36 overflow-hidden -mt-[4vw]"
        style={{
          clipPath: 'polygon(0 4vw, 100% 0, 100% calc(100% - 4vw), 0 100%)',
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Our Current Status</h2>
            <p className="text-2xl font-bold tracking-tight text-white">
              Simple, reliable savings technology built for real communities.
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


      <div ref={thirdSectionRef} className="bg-deepBlue-50/20 py-20 border-b border-deepBlue-100/60 relative lg:min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:h-screen lg:flex lg:flex-col lg:justify-center">
          <div className="text-center max-w-2xl mx-auto my-16">
            <h2 className="text-3xl font-bold text-deepBlue-800 mt-48 mb-3 overflow-hidden">
              <span className="block animate-slideUpReveal-scroll third-section-header">One app that works everywhere you do.</span>
            </h2>
            <p className="text-sm text-deepBlue-600">
              Save money with your group from your phone, tablet, or computer. Everything stays in sync so you're always up to date.
            </p>
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center overflow-visible flex-1">
            <div ref={el => stepContentRefs.current[0] = el} className="lg:col-span-5 space-y-7 relative z-10">
              {STEPS_DATA.map((step) => (
                <div
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${activeStep === step.id
                      ? 'bg-white border-deepBlue-300 shadow-sm'
                      : 'border-transparent hover:bg-white/60 hover:border-deepBlue-100'
                    }`}
                >
                  <h4 className={`text-lg font-semibold mb-1 ${activeStep === step.id ? 'text-deepBlue-700' : 'text-deepBlue-800'}`}>
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

            <div ref={phoneImageRef} className="lg:col-span-7 flex justify-center lg:justify-end relative z-10">
              <div className="w-full max-w-[235px]">
                <div className="bg-gray-900 rounded-[2rem] p-2 shadow-xl mx-auto">
                  <div className="bg-white rounded-[1.5rem] overflow-hidden w-full h-[460px] flex flex-col">
                    <div className="bg-gray-900 h-6 flex justify-center items-center flex-shrink-0">
                      <div className="w-19 h-3 bg-black rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-0">
                      <img
                        src={currentStepData?.image}
                        alt={currentStepData?.alt}
                        className="max-w-full max-h-full object-contain transition-opacity duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Completely New Design */}
          <div className="lg:hidden min-h-screen flex flex-col">
            {/* Scroll Down Hint at Top */}
            <div className="flex items-center justify-center py-4 opacity-60">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-deepBlue-100">
                <div className="flex flex-col gap-1">
                  <div className="w-1 h-1 bg-deepBlue-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-deepBlue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-deepBlue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-deepBlue-600 font-medium">Scroll down to explore</span>
              </div>
            </div>

            {/* Mobile Card Stack Layout */}
            <div className="flex-1 relative overflow-hidden py-4">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-deepBlue-200 to-blue-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-2xl"></div>
              </div>

              {/* Card Stack Container */}
              <div 
                className="relative z-10 h-full flex items-center justify-center px-4"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full max-w-sm mx-auto relative">
                  {/* Progress Ring */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="relative w-16 h-16">
                      {/* Background circle */}
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-deepBlue-100"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${(activeStep / STEPS_DATA.length) * 175.93} 175.93`}
                          className="text-deepBlue-600 transition-all duration-500 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Step number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-deepBlue-800">{activeStep}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Card */}
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-deepBlue-100">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 px-6 py-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="relative z-10">
                        <div className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">
                          Step {activeStep} of {STEPS_DATA.length}
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {currentStepData?.title.replace(/^\d+\.\s*/, '')}
                        </h3>
                      </div>
                    </div>

                    {/* Phone Mock-up */}
                    <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                      <div className="bg-gray-900 rounded-[2rem] p-2 shadow-lg mx-auto max-w-[220px]">
                        <div className="bg-white rounded-[1.5rem] overflow-hidden h-[380px] flex flex-col">
                          {/* Phone notch */}
                          <div className="bg-gray-900 h-5 flex justify-center items-center flex-shrink-0 relative">
                            <div className="w-16 h-2.5 bg-black rounded-full"></div>
                            <div className="absolute right-2 top-1 flex gap-1">
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                          
                          {/* Phone content */}
                          <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-0 relative">
                            <img
                              src={currentStepData?.image}
                              alt={currentStepData?.alt}
                              className="max-w-full max-h-full object-contain transition-all duration-500 transform scale-95 hover:scale-100"
                            />
                            
                            {/* Floating badge */}
                            <div className="absolute top-3 right-3 bg-deepBlue-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                              Live
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 pb-6">
                      <p className="text-deepBlue-600 leading-relaxed text-sm mb-6">
                        {currentStepData?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Step Indicators */}
                  <div className="flex justify-center items-center gap-2 mt-6">
                    {STEPS_DATA.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToStep(index + 1)}
                        className={`transition-all duration-300 rounded-full ${
                          activeStep === index + 1
                            ? 'w-8 h-2 bg-deepBlue-600'
                            : 'w-2 h-2 bg-deepBlue-200 hover:bg-deepBlue-300 active:scale-125'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 px-4 py-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute bottom-8 right-4 w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="relative z-10 text-center">
                <p className="text-white/90 text-sm mb-3 font-medium">
                  Ready to start saving with your community?
                </p>
                <button
                  onClick={handleJoinBeta}
                  className="bg-white text-deepBlue-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-deepBlue-50 transition-all active:scale-95 shadow-lg"
                >
                  Join Beta Program
                </button>
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
                Use AjoSave on Your Computer Too
              </h3>
              <p className="text-sm text-deepBlue-600 leading-relaxed">
                Need a bigger screen? Access all the same features on your laptop or desktop. Perfect for reviewing your savings history or managing multiple groups.
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
                <div className="text-3xl font-extrabold">{metric.value}</div>
                <div className="text-xs text-deepBlue-200 uppercase tracking-wider font-semibold">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-deepBlue-50/40 to-blue-50/60 py-20 border-b border-deepBlue-100/60">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-deepBlue-800 mt-48 mb-4 overflow-hidden">
              <span className="block animate-slideUpReveal-scroll faq-header">FAQs</span>
            </h2>
            <p className="text-deepBlue-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              We know you have questions
            </p>

            {/* Reddit Community Link */}
            <div className="inline-flex items-center gap-3 bg-white border border-deepBlue-200 rounded-xl px-4 py-3 hover:border-deepBlue-300 transition-all group cursor-pointer shadow-sm">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-deepBlue-800 group-hover:text-deepBlue-900">
                  Join r/AjoSave Community
                </div>
                <div className="text-xs text-deepBlue-600">
                  Get help from other users and our team
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-deepBlue-400 group-hover:text-deepBlue-600" />
            </div>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-deepBlue-100 rounded-xl overflow-hidden hover:border-deepBlue-200 transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-deepBlue-50/30 transition-colors"
                >
                  <span className="font-semibold text-deepBlue-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-deepBlue-500 transition-transform flex-shrink-0 ${openFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 pb-5 animate-fadeIn">
                    <div className="pt-2 border-t border-deepBlue-100/50">
                      <p className="text-deepBlue-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Help */}
          <div className="text-center mt-8 pt-6 border-t border-deepBlue-200/50">
            <p className="text-sm text-deepBlue-600 mb-3">
              Still have questions? We're here to help.
            </p>
            <button
              onClick={handleContact}
              className="text-deepBlue-700 hover:text-deepBlue-800 font-medium text-sm underline underline-offset-2 hover:underline-offset-4 transition-all"
            >
              Contact our support team
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="border border-deepBlue-800 bg-deepBlue-800 text-white rounded-2xl p-8 lg:p-12 relative overflow-hidden grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4 z-10">
            <h3 className="text-2xl font-bold tracking-tight">Help us build the best savings platform for your community.</h3>
            <p className="text-deepBlue-200 text-sm max-w-xl leading-relaxed">
              We're looking for people to try our platform and tell us how to make it better. Your feedback helps us create something that really works for everyone.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-deepBlue-100 font-mono">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> Free to Use</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-deepBlue-300" /> Help Shape Features</span>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end z-10">
            <button
              onClick={handleJoinBeta}
              className="bg-white text-deepBlue-800 px-6 py-3.5 rounded-lg font-semibold hover:bg-deepBlue-50 transition-colors text-sm shadow-sm whitespace-nowrap text-center w-full md:w-auto"
            >
              Access Beta Environment
            </button>
            <button
              onClick={handlePrivacyPolicy}
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