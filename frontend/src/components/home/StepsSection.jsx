import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Local Assets
import signupImage from '../../assets/images/Signup.jpeg'
import groupImage from '../../assets/images/Group.jpeg'
import paymentImage from '../../assets/images/Payment.jpeg'
import walletImage from '../../assets/images/Wallet.jpeg'
import dashboardImage from '../../assets/images/Dashboard.jpeg'
import webDashboardImage from '../../assets/images/webDashboard.png'

gsap.registerPlugin(ScrollTrigger)

export const STEPS = [
  {
    id: 1,
    title: 'Create your account',
    desc: 'Sign up with your phone number. We verify your identity so every member in a group knows who they are saving with.',
    image: signupImage,
    alt: 'Account creation screen'
  },
  {
    id: 2,
    title: 'Start or join a group',
    desc: 'Create a new savings group and set the rules — contribution amount, frequency, and rotation order. Or join an existing group with an invite link.',
    image: groupImage,
    alt: 'Group setup screen'
  },
  {
    id: 3,
    title: 'Contribute on schedule',
    desc: 'Make contributions manually or set up automatic payments. Every transaction is logged instantly and visible to all group members in real time.',
    image: paymentImage,
    alt: 'Payment process screen'
  },
  {
    id: 4,
    title: 'Receive your payout',
    desc: "When your turn comes, the full pot goes directly to you. The app handles the rotation, sends reminders, and keeps a clear record for everyone.",
    image: walletImage,
    alt: 'Payout screen'
  },
  {
    id: 5,
    title: 'Track everything',
    desc: 'See who has paid, who is next, and how close your group is to completing the cycle. Your dashboard keeps the whole picture in one place.',
    image: dashboardImage,
    alt: 'Dashboard progress screen'
  }
]

export default function StepsSection() {
  const [activeStep, setActiveStep] = useState(1)
  const pinContainerRef = useRef(null)

  const currentStep = STEPS.find((s) => s.id === activeStep) || STEPS[0]

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const pinContainer = pinContainerRef.current
      if (!pinContainer) return

      const trigger = ScrollTrigger.create({
        trigger: pinContainer,
        start: 'top top+=64',
        end: `+=${STEPS.length * 60}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = Math.min(Math.max(self.progress, 0), 0.999)
          const newStep = Math.floor(progress * STEPS.length) + 1
          setActiveStep(newStep)
        }
      })

      return () => trigger.kill()
    })

    return () => mm.revert()
  }, [])

  const handleNext = () => setActiveStep((prev) => (prev < STEPS.length ? prev + 1 : 1))
  const handlePrev = () => setActiveStep((prev) => (prev > 1 ? prev - 1 : STEPS.length))

  return (
    <section
      ref={pinContainerRef}
      className="w-full py-12 lg:py-10 lg:h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          {/* Heading: Shows short text on mobile, long text on large screens */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-500 tracking-tight">
            <span className="block sm:hidden">Four steps to saving together.</span>
            <span className="hidden sm:block">From zero to your first group payout in minutes.</span>
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-1.5 leading-relaxed">
            <span className="block sm:hidden">Simple on every device.</span>
            <span className="hidden sm:block">Create your group, invite your people, save together, and receive your payout — all from one place. Your phone, tablet, or browser. Everything stays in sync.</span>
          </p>
        </div>


        {/* ================= MOBILE VIEW (< 1024px) ================= */}
        <div className="block lg:hidden max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
            {STEPS.map((step) => {
              const isActive = step.id === activeStep
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex-1 min-w-[50px] py-2 rounded-lg text-xs font-bold transition-all ${isActive
                    ? 'bg-blue-300 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                >
                  Step {step.id}
                </button>
              )
            })}
          </div>

          <div className="bg-white text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Step {currentStep.id} of {STEPS.length}
              </span>
              <h3 className="text-base font-bold text-slate-900">{currentStep.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed px-2">{currentStep.desc}</p>
            </div>

            <div className="relative mx-auto w-[160px] bg-slate-900 rounded-[1.8rem] p-2 shadow-2xl border-2 border-slate-800">
              <div className="bg-slate-900 h-2 rounded-t-[1.3rem] flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
              </div>
              <div className="bg-white rounded-[1.2rem] overflow-hidden h-[290px] flex items-center justify-center">
                <img
                  src={currentStep.image}
                  alt={currentStep.alt}
                  className="w-full h-full rounded-[1.2rem] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP PINNED VIEW (>= 1024px) ================= */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">

          {/* Left Column: Step Cards */}
          <div className="col-span-5 space-y-2">
            {STEPS.map((step) => {
              const isActive = step.id === activeStep
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${isActive
                    ? 'bg-white border-blue-600 shadow-md transform translate-x-1.5'
                    : 'bg-white/40 border-transparent hover:bg-white/80 hover:border-slate-200'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors mt-0.5 ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                        }`}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h4
                        className={`text-xl font-bold transition-colors ${isActive ? 'text-blue-500' : 'text-slate-700'
                          }`}
                      >
                        {step.title}
                      </h4>
                      {isActive && (
                        <p className="text-sm text-slate-600 leading-relaxed mt-0.5 animate-fadeIn">
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Combined Device Mockups */}
          <div className="col-span-7 relative flex items-center justify-center py-4">

            {/* LAPTOP MOCKUP */}
            <div className="w-[80%] relative flex flex-col items-center">

              {/* Laptop Screen / Lid Frame */}
              <div className="w-full bg-slate-900 rounded-t-2xl p-2.5 shadow-xl border border-slate-800 relative">

                {/* Camera Lens */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-1.5 h-1.5 bg-slate-800 rounded-full border border-slate-700" />
                </div>

                {/* Display Area */}
                <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 relative">

                  {/* Web Browser Bar */}
                  <div className="bg-slate-900/90 px-3 py-1 flex items-center justify-between border-b border-slate-800">
                    <div className="w-8" />
                  </div>

                  {/* Dashboard Screen Content */}
                  <div className="bg-slate-950 overflow-hidden h-[270px] xl:h-[290px]">
                    <img
                      src={webDashboardImage}
                      alt="AjoSave Web Dashboard"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>

              {/* Hinge Link */}
              <div className="w-[16%] h-0.5 bg-slate-700 rounded-b-sm z-10" />

              {/* Base / Bottom Deck */}
              <div className="w-[106%] h-2.5 bg-slate-300 rounded-b-xl border-t border-slate-200 shadow-md flex justify-center items-start">
                <div className="w-12 h-0.5 bg-slate-400/80 rounded-b-sm" />
              </div>

              {/* Laptop Shadow */}
              <div className="w-[100%] h-2 bg-slate-900/15 rounded-full blur-md -mt-0.5" />
            </div>


            <div className="absolute -bottom-1 left-2 w-[165px] xl:w-[170px] bg-slate-900 rounded-[1.8rem] p-1.5 shadow-2xl shadow-slate-900/40 border-2 border-slate-800 z-20 transition-all duration-300">

              {/* Speaker / Notch */}
              <div className="bg-slate-900 h-2.5 rounded-t-[1.3rem] flex justify-center items-center">
                <div className="w-7 h-0.5 bg-slate-700 rounded-full" />
              </div>

              {/* Phone Screen */}
              <div className="bg-white rounded-[1.2rem] overflow-hidden h-[285px] xl:h-[320px] flex items-center justify-center border border-slate-200">
                <img
                  src={currentStep.image}
                  alt={currentStep.alt}
                  className="w-full h-full object-contain p-0.5 transition-all duration-300"
                />
              </div>

              <div className=" h-0.5 rounded-t-[1.3rem] flex justify-center items-center">
                <div className="w-7 h-2.5 rounded-full" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}