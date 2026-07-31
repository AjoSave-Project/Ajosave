import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  UserPlus,
  Users,
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Terminal,
  Activity
} from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';
import AjoCycleAnimation from '../components/animations/AjoCycleAnimation';
import MarketImg from '../assets/images/about.png';


// ── TYPEWRITER NARRATION TERMINAL COMPONENT ──────────────────────────────
const LiveTerminalNarrator = ({ currentEvent }) => {
  const [typedText, setTypedText] = useState("");
  const [logHistory, setLogHistory] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    if (!currentEvent?.message) return;

    // Track current month from MONTH_START events
    if (currentEvent.type === "MONTH_START" && currentEvent.month) {
      setCurrentMonth(currentEvent.month);
    }

    const fullMessage = currentEvent.message;
    setTypedText("");
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < fullMessage.length) {
        setTypedText(fullMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setLogHistory((prev) => [fullMessage, ...prev.slice(0, 3)]);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [currentEvent]);

  return (
    <div className="w-full h-full mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-inner font-mono text-xs sm:text-sm">
      {/* Month + live stream row */}
      <div className="flex items-center gap-3 bg-slate-900/80 border border-emerald-500/30 rounded-xl px-4 py-3 shadow-sm mb-3">
        <Terminal className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {currentMonth && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-deepBlue-700 text-deepBlue-200 px-2.5 py-1 rounded-full">
              {currentMonth}
            </span>
          )}
          <p className="font-semibold text-emerald-300 tracking-wide leading-tight truncate">
            {typedText || "Initializing rotation audit stream..."}
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1.5 align-middle animate-ping" />
          </p>
        </div>
      </div>

      {/* History Ledger Stream */}
      {logHistory.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] sm:text-xs text-slate-400 font-mono">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-slate-500" /> Recent Audit Logs:
          </p>
          {logHistory.map((log, idx) => (
            <p key={idx} className="opacity-75 truncate flex items-center gap-2 text-slate-300">
              <span className="text-emerald-500 font-bold">›</span> {log}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// ── MAIN HOW IT WORKS PAGE ────────────────────────────────────────────────
const HowItWorks = () => {
  const heroTextRef = useRef(null);
  const heroAnimationRef = useRef(null);
  const stepsContainerRef = useRef(null);
  const stepRefs = useRef([]);
  const featureSectionRef = useRef(null);
  const featureCardsRef = useRef([]);

  const [currentAnimEvent, setCurrentAnimEvent] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Fade In
    gsap.fromTo(
      heroTextRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Simulator Reveal
    gsap.fromTo(
      heroAnimationRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroAnimationRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Step Cards
    if (stepRefs.current.length > 0) {
      gsap.fromTo(
        stepRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Feature Cards
    if (featureCardsRef.current.length > 0) {
      gsap.fromTo(
        featureCardsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featureSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  const steps = [
    {
      icon: <UserPlus className="w-5 h-5 text-deepBlue-700" />,
      title: "Sign Up & Verify",
      description: "Complete identity verification for group trust and financial safety.",
      details: ["Instant Identity Check", "Bank Account Linking"]
    },
    {
      icon: <Users className="w-5 h-5 text-deepBlue-700" />,
      title: "Join or Create Group",
      description: "Pick a monthly contribution target and select an available rotation spot.",
      details: ["Custom Cycles", "Fixed Turn Selection"]
    },
    {
      icon: <CreditCard className="w-5 h-5 text-deepBlue-700" />,
      title: "Contribute Monthly",
      description: "Automated charges keep payouts on schedule with clear ledger tracking.",
      details: ["Automated Billing", "Real-Time Tracking"]
    },
    {
      icon: <Wallet className="w-5 h-5 text-deepBlue-700" />,
      title: "Receive Lump Sum",
      description: "Collect the entire accumulated pool amount when your rotation turn arrives.",
      details: ["Zero Delay Payouts", "Direct Deposit"]
    }
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: "Protected Escrow",
      description: "Pooled contributions are held securely in institutional-grade escrow structures until rotation day."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      title: "100% Verified Members",
      description: "Strict identity mapping eliminates anonymous dropouts and keeps community groups stable."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: "Zero Management Fees",
      description: "Enjoy lump-sum group saving without high interest costs or hidden service charges."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-blue-500 font-sans antialiased flex flex-col justify-between">
      <HomeNavbar />

      {/* ── HERO SECTION — stock image as full background ─────────────────── */}
      <section
        className="relative py-20 sm:py-28 border-b border-slate-800 overflow-hidden"
        style={{
          backgroundImage: `url(${MarketImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-deepBlue-950/72" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
          <div ref={heroTextRef} className="space-y-6 text-left max-w-2xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Traditional group saving, modernized with{' '}
              <span className="text-blue-400 underline decoration-blue-400 decoration-wavy underline-offset-8">
                total transparency
              </span>.
            </h1>
          </div>
        </div>
      </section>

      {/* ── SIMULATOR & TYPEWRITER NARRATION SECTION ─────────────────────── */}
      <section id="simulator" ref={heroAnimationRef} className="py-10 bg-deepBlue-950 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 text-left">
          <div className="max-w-2xl mb-8 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-deepBlue-600">
              ROTATION DEMONSTRATION
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-500 tracking-tight">
              Observe real-time contribution movements and pooled disbursement logic.
            </p>
          </div>

          {/* Animation & Integrated Terminal Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 sm:p-6 shadow-2xl">
            <div className="w-full flex justify-center overflow-x-auto">
              <AjoCycleAnimation onStepChange={(event) => setCurrentAnimEvent(event)} />
            </div>

            {/* Typewriter Narration Directly Below Animation */}
            <LiveTerminalNarrator currentEvent={currentAnimEvent} />
          </div>

        </div>
      </section>

      {/* ── SECURITY & TRUST FEATURES ───────────────────────────────────── */}
      <section ref={featureSectionRef} className="py-10 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12 text-left">

          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-deepBlue-600">
              Built on Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-500 tracking-tight">
              Designed for absolute peace of mind
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <div
                key={index}
                ref={(el) => (featureCardsRef.current[index] = el)}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-blue-500 text-base">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-deepBlue-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl text-left">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to start your first savings circle?
              </h3>
              <p className="text-sm sm:text-base text-blue-100/90">
                Join thousands of group savers taking advantage of seamless, transparent community thrift.
              </p>
            </div>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 bg-white text-blue-500 px-7 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-md shrink-0 w-fit"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default HowItWorks;