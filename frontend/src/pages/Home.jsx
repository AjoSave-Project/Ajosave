import { useEffect, useRef, useCallback, memo } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '../context/AuthContext'

import HomeNavbar from '../components/layout/HomeNavbar'
import HomeFooter from '../components/layout/HomeFooter'
import HeroSection from '../components/home/HeroSection'
import StatusSection from '../components/home/StatusSection'
import StepsSection from '../components/home/StepsSection'
import MetricsSection from '../components/home/MetricsSection'
import FAQSection from '../components/home/FAQSection'
import CTASection from '../components/home/CTASection'

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Memoized spinner used in loading screen
const SpinnerIcon = memo(() => (
  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
))
SpinnerIcon.displayName = 'SpinnerIcon'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()

  // Refs for simple entrance animations
  const heroSectionRef = useRef(null)
  const secondSectionRef = useRef(null)

  // Navigation handlers
  const handleJoinBeta = useCallback(() => navigate('/auth'), [navigate])
  const handleHowItWorks = useCallback(() => navigate('/how-it-works'), [navigate])
  const handleContact = useCallback(() => navigate('/contact'), [navigate])
  const handlePrivacyPolicy = useCallback(() => navigate('/privacy-policy'), [navigate])

  const initializeAnimations = useCallback(() => {
    const ctx = gsap.context(() => {
      // Position second section smoothly on scroll
      gsap.set(secondSectionRef.current, { y: '10vh', opacity: 0 })

      gsap.to(secondSectionRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'bottom 90%',
          end: 'bottom 50%',
          toggleActions: 'play none none none',
          scrub: false,
        }
      })

      // FAQ header animation
      const faqHeader = document.querySelector('.faq-header')
      if (faqHeader) {
        ScrollTrigger.create({
          trigger: faqHeader,
          start: 'top 80%',
          toggleActions: 'play none none none',
          onEnter: () => faqHeader.classList.add('in-view')
        })
      }
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!loading && !(isAuthenticated && user)) {
      return initializeAnimations()
    }
  }, [loading, isAuthenticated, user, initializeAnimations])

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-48 h-px bg-white/30 mx-auto mb-6"></div>
            <div className="relative w-48 h-16 mx-auto overflow-hidden">
              <div className="absolute inset-0 flex items-center animate-slide-carousel">
                {[...Array(2)].flatMap((_, pass) =>
                  [
                    { bg: 'bg-deepBlue-600', border: '', iconColor: 'text-white' },
                    { bg: 'bg-white', border: 'border-2 border-deepBlue-200', iconColor: 'text-deepBlue-600' },
                    { bg: 'bg-deepBlue-800', border: '', iconColor: 'text-white' },
                  ].map((card, i) => (
                    <div
                      key={`${pass}-${i}`}
                      className={`flex-shrink-0 w-12 h-12 ${card.bg} ${card.border} rounded-lg flex items-center justify-center mx-2 shadow-sm`}
                    >
                      <User className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="w-48 h-px bg-white/30 mx-auto mt-6"></div>
          </div>
          <p className="text-deepBlue-700 font-medium text-sm tracking-tight">Loading</p>
        </div>
      </div>
    )
  }

  // ── Redirect already-authenticated visitors straight to the dashboard ──────
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-deepBlue-800 antialiased home-page-scrollbar selection:bg-deepBlue-50">
      <HomeNavbar />

      <HeroSection
        sectionRef={heroSectionRef}
        onJoinBeta={handleJoinBeta}
        onHowItWorks={handleHowItWorks}
      />

      <StatusSection sectionRef={secondSectionRef} />

      <StepsSection />

      <MetricsSection />

      <FAQSection onContact={handleContact} />

      <CTASection
        onJoinBeta={handleJoinBeta}
        onPrivacyPolicy={handlePrivacyPolicy}
      />

      <HomeFooter />
    </div>
  )
}

export default Home