import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Users, CreditCard, Wallet, Shield, CheckCircle, ArrowRight, Play } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';
import AjoCycleAnimation from '../components/animations/AjoCycleAnimation';

const HowItWorks = () => {
  const heroTextRef = useRef(null);
  const heroAnimationRef = useRef(null);
  const heroLeftRef = useRef(null);
  const stepsContainerRef = useRef(null);
  const stepRefs = useRef([]);
  const featureSectionRef = useRef(null);
  const featureCardsRef = useRef([]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Curated, impactful copywriting matching the animation context
  const narrations = [
    {
      title: "Identity Onboarding",
      body: "Secure verification pipelines authenticate the user using biometrics and localized registries, establishing baseline trust parameters inside the node network instantly."
    },
    {
      title: "Circle Integration",
      body: "Algorithmic placement synchronizes your savings pathing into active community pools, aligning rotation turns perfectly with your timeline goals."
    },
    {
      title: "Smart Contributions",
      body: "Automated billing bridges collect set allocations transparently. The funds bypass middle systems, updating the cryptographic shared ledger in real time."
    },
    {
      title: "Disposal Liquidation",
      body: "When the cycle shifts position to your index, the consolidated smart-escrow pool triggers a flawless, single-transaction payout directly into your target bank account."
    }
  ];

  // GSAP Entrance Choreography
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Text Entrance: Slide in from the right (on page load)
    gsap.fromTo(heroTextRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.2
      }
    );

    // 2. Hero Animation Section: Triggered when scrolling to animation area
    gsap.fromTo(heroAnimationRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroAnimationRef.current,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 3. Hero Interactive Elements: Slide animation for the centered container
    gsap.fromTo(heroLeftRef.current,
      { opacity: 0, y: 60 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroAnimationRef.current,
          start: 'top 75%',
          end: 'top 45%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 4. Steps Entrance: Individual steps slide up one by one
    if (stepRefs.current.length > 0) {
      gsap.fromTo(stepRefs.current,
        { y: 60 },
        {
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // 5. Features Section: Staggered animation when reaching the section
    if (featureCardsRef.current.length > 0) {
      gsap.fromTo(featureCardsRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: featureSectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-deepBlue-600" />,
      title: "Sign Up & Verify",
      description: "Secure profile configuration backed by secure identity verification.",
      details: ["BVN/NIN validation", "Secure profile setup"]
    },
    {
      icon: <Users className="w-6 h-6 text-deepBlue-600" />,
      title: "Join a Circle",
      description: "Match with optimized rotation timelines tailored to your goals.",
      details: ["Custom group terms", "Automated scheduling"]
    },
    {
      icon: <CreditCard className="w-6 h-6 text-deepBlue-600" />,
      title: "Contribute Funds",
      description: "Punctual automation tracks contributions without manual friction.",
      details: ["Payment reminders", "Real-time ledger shifts"]
    },
    {
      icon: <Wallet className="w-6 h-6 text-deepBlue-600" />,
      title: "Collect Pool",
      description: "Instant disbursement directly into your bank account on cycle turn.",
      details: ["Guaranteed turns", "Zero withdrawal lag"]
    }
  ];

  const features = [
    {
      icon: <Shield className="w-7 h-7 text-deepBlue-600" />,
      title: "Escrow Assurance",
      description: "Funds reside safely within secured capital pools protected by enterprise-grade cryptographic guardrails."
    },
    {
      icon: <CheckCircle className="w-7 h-7 text-deepBlue-600" />,
      title: "Verified Nodes",
      description: "100% ID-mapped user profiles prevent network dropouts and ensure continuous cycle health."
    },
    {
      icon: <ArrowRight className="w-7 h-7 text-deepBlue-600" />,
      title: "Unified Yield",
      description: "Eliminate typical individual banking fees by grouping rotational capital dynamically."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-deepBlue-800 overflow-x-hidden selection:bg-deepBlue-100 flex flex-col justify-between font-sans antialiased">
      <HomeNavbar />

      <section className="container mx-auto px-6 lg:px-16 pt-16 pb-12">
        <div ref={heroTextRef} className="max-w-4xl opacity-0">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-deepBlue-800 leading-[1.1] mb-6 overflow-hidden">
            <span className="block animate-slideInLeft">A system built on absolute <span className="underline decoration-deepBlue-500 decoration-wavy decoration-2 underline-offset-4">transparency</span>.</span>
          </h1> 
          <p className="text-lg text-deepBlue-600 max-w-2xl font-normal leading-relaxed">
            Witness how decentralized rotary savings operate. Our simulator charts live ledger balances while our automation engine drives secure capital pools forward.
          </p>
        </div>
      </section>

      <section 
        ref={heroAnimationRef} 
        className="relative py-5 opacity-0"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.85)), url('https://images.unsplash.com/photo-1650803321892-efba59b28a60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-6 lg:px-16">
          {/* Single centered animation */}
          <div className="flex justify-center items-center min-h-[600px]">
            <div 
              ref={heroLeftRef}
              className="w-full max-w-5xl opacity-0"
            >
              {/* Animation component */}
              <div className="w-full">
                <AjoCycleAnimation />
              </div>

              {/* Stepper Controller */}
              <div className="flex items-center justify-center gap-2 mt-8 bg-deepBlue-100 p-1.5 rounded-xl border border-deepBlue-200/40 max-w-fit mx-auto">
                {narrations.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex items-center justify-center font-mono text-xs font-bold w-9 h-9 rounded-lg transition-all ${
                      activeStepIndex === idx 
                        ? 'bg-deepBlue-800 text-white shadow-md' 
                        : 'text-deepBlue-400 hover:text-deepBlue-800 hover:bg-deepBlue-200/50'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>

              {/* Narrator info below animation */}
              <div className="mt-8 bg-deepBlue-50/50 border border-deepBlue-100 rounded-xl p-6">
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-deepBlue-400 uppercase mb-4">
                  <Play className="w-3 h-3 text-deepBlue-500 fill-deepBlue-500" />
                  <span>Live Simulation Narrator</span>
                </div>
                
                <h3 className="text-xl font-black text-deepBlue-800 tracking-tight mb-3 transition-all duration-300">
                  {narrations[activeStepIndex].title}
                </h3>
                <p className="text-sm text-deepBlue-800 font-normal leading-relaxed transition-all duration-500">
                  {narrations[activeStepIndex].body}
                </p>

                <div className="mt-6 pt-4 border-t border-deepBlue-200 border-dashed flex items-center justify-between text-xs font-mono text-deepBlue-400 font-bold">
                  <span>SEGMENT: 0{activeStepIndex + 1} // 04</span>
                  <span className="text-deepBlue-300 tracking-wider">SYNC ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={stepsContainerRef}
        className="bg-white border-y border-deepBlue-200/80 my-16"
      >
        <div className="container mx-auto px-6 lg:px-16 py-20 flex flex-col items-center">
          {/* Steps Horizontal Grid Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 items-stretch w-full">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={el => stepRefs.current[index] = el}
                onClick={() => setActiveStepIndex(index)}
                className={`group p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:bg-deepBlue-50/60 relative ${index < steps.length - 1
                    ? 'border-b border-deepBlue-100 lg:border-b-0 lg:border-r-2 lg:border-l-0 lg:border-deepBlue-100'
                    : ''
                  }`}
              >
                {/* Micro Step Overlay Floating Tag */}
                <div className="absolute top-6 right-8 font-mono text-xs font-bold text-deepBlue-300 group-hover:text-deepBlue-400 transition-colors">
                  [0{index + 1}]
                </div>

                <div>
                  <div className="w-12 h-12 bg-deepBlue-50 border border-deepBlue-100 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-deepBlue-800 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-deepBlue-600 leading-relaxed font-normal mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-dashed border-deepBlue-100 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {step.details.map((detail, dIdx) => (
                      <span key={dIdx} className="inline-flex items-center text-[10px] font-medium bg-deepBlue-100 text-deepBlue-600 px-2 py-0.5 rounded-md">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Go / Call to Action Trigger */}
          <div className="mt-14">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-deepBlue-900 text-white rounded-xl font-medium tracking-wide shadow-md shadow-slate-950/10 hover:bg-slate-900 transition-all duration-300 hover:scale-[1.02] active:scale-98">
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default HowItWorks;