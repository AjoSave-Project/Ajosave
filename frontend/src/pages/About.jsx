import { useState } from 'react';
import { ExternalLink, ArrowRight, ShieldCheck, Bell, RefreshCw } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';
import FeranmiImage from '../assets/images/Feranmi.jpeg';
import BashiruImage from '../assets/images/Bashiru.jpeg';
import NelsonImage from '../assets/images/Nelson.jpeg';
import TemiImage from '../assets/images/Temi.jpeg';
import KosiImage from '../assets/images/Kosi.jpeg';
import AjosaveImage from '../assets/images/Ajosave.jpeg';
import Ajosave1Image from '../assets/images/Ajosave1.jpeg';

const team = [
  {
    name: 'Olanase Umar Ayobami',
    role: 'Project Lead & Brand',
    image: TemiImage,
    bio: 'Drives the overall vision, brand identity, and product direction for AjoSave.'
  },
  {
    name: 'OluwaFeranmi Adeyemo',
    role: 'Head of Operations',
    image: FeranmiImage,
    bio: 'Manages day-to-day operations and ensures the platform works well for every user.'
  },
  {
    name: 'Bashiru',
    role: 'Backend & Security',
    image: BashiruImage,
    bio: 'Leads backend architecture and makes sure every transaction is processed securely.'
  },
  {
    name: 'Otika Nelson Somtochukwu',
    role: 'Mobile Development',
    image: NelsonImage,
    bio: 'Builds and maintains the mobile experience across iOS and Android.'
  },
  {
    name: 'Kosisochukwu',
    role: 'Technical Development',
    image: KosiImage,
    bio: 'Works across the stack to build and improve platform features.'
  }
];

const heroSlides = [
  { image: AjosaveImage, alt: 'The AjoSave team' },
  { image: Ajosave1Image, alt: 'AjoSave in action' }
];

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="min-h-screen bg-white home-page-scrollbar">
      <HomeNavbar />

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-950 via-deepBlue-900 to-blue-900 text-white flex items-center px-4 sm:px-8 py-20 overflow-hidden">

        {/* Architectural grid lines background */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-12 pointer-events-none opacity-[0.04]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-blue-300 h-full last:border-r-0" />
          ))}
        </div>

        {/* Changed items-end to items-center for vertical center alignment */}
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">

          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 order-2 lg:order-1">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
                The best financial futures are built together.
              </h1>
              <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed">
                AjoSave is a digital platform for community savings — Ajo, Esusu, thrift contributions — 
                built to make group saving transparent, reliable, and simple. Started in Nigeria. 
                Built for communities everywhere.
              </p>
            </div>

            <div className="pt-6 border-t border-blue-400/20 flex flex-col sm:flex-row gap-6 text-xs text-blue-200">
              <div>
                <span className="block text-blue-400 mb-1 font-semibold uppercase tracking-wider">Origin</span>
                <p className="text-blue-100 text-sm font-medium">Born at Codefest 2025 Hackathon</p>
              </div>
              <div>
                <span className="block text-blue-400 mb-1 font-semibold uppercase tracking-wider">Status</span>
                <p className="text-blue-100 text-sm font-medium">In active development — open beta</p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="lg:col-span-5 relative order-1 lg:order-2">
            <div className="absolute -top-16 -left-12 text-[12vw] text-deepBlue-700/30 select-none tracking-tighter leading-none pointer-events-none hidden lg:block font-extrabold">
              AJO
            </div>
            <div className="relative z-10 aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none bg-deepBlue-800 overflow-hidden border border-blue-400/20 shadow-2xl p-3 rounded-2xl">
              <div className="absolute inset-5 border border-blue-300/10 pointer-events-none z-20 rounded-xl" />
              <div className="w-full h-full overflow-hidden rounded-lg">
                <img
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>
              <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'bg-blue-300 w-6' : 'bg-blue-300/30 w-1.5 hover:bg-blue-300/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STORY SECTION (Redesigned & Spacious) ───────────────────────── */}
      <section id="story" className="bg-white py-24 scroll-mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-16">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-deepBlue-500 bg-deepBlue-50 px-3 py-1 rounded-full">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-deepBlue-900 tracking-tight">
              From a hackathon idea to a working product.
            </h2>
            <p className="text-deepBlue-600 text-base">
              Rethinking traditional community saving for the modern digital age.
            </p>
          </div>

          {/* Codefest Banner & Narrative Intro */}
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            
            <div className="md:col-span-7 bg-slate-50 border border-slate-200/80 rounded-2xl p-8 flex flex-col justify-between space-y-4">
              <p className="text-deepBlue-800 text-base sm:text-lg font-medium leading-relaxed">
                AjoSave started with a question: why is something as culturally embedded as Ajo — a savings method millions of Nigerians already trust — still being managed through WhatsApp chats, paper ledgers, and memory?
              </p>
              <p className="text-deepBlue-600 text-sm sm:text-base leading-relaxed">
                Missed payments, unclear records, and the awkwardness of chasing people for money were the standard friction points. We set out to build a platform that preserves the trust of community savings while eliminating the manual headaches.
              </p>
            </div>

            {/* Hackathon Link Card */}
            <a
              href="https://codefest25.hacktribe.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-5 border border-deepBlue-100 rounded-2xl p-6 bg-deepBlue-900 text-white hover:bg-deepBlue-800 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Origin Story</span>
                <ExternalLink className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors" />
              </div>

              <div className="my-6 space-y-2">
                <h3 className="text-xl font-bold text-white">Codefest 2025 Hackathon</h3>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Created as a national hackathon submission challenging developers to solve real community financial challenges.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 group-hover:text-white transition-colors">
                <span>Visit hackathon portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

          </div>

          {/* Three Pillars */}
          <div className="grid sm:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-deepBlue-900 text-base">Transparent Ledgers</h4>
              <p className="text-xs text-deepBlue-600 leading-relaxed">
                Every contribution gets recorded instantly. Every member can view total pool status anytime.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-deepBlue-900 text-base">Automated Reminders</h4>
              <p className="text-xs text-deepBlue-600 leading-relaxed">
                No awkward manual follow-ups. System notifications keep every member on schedule.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-deepBlue-900 text-base">Guaranteed Rotation</h4>
              <p className="text-xs text-deepBlue-600 leading-relaxed">
                Clear payout schedules prevent disputes and maintain turn transparency for all members.
              </p>
            </div>
          </div>

          {/* Pull Quote & Current Phase */}
          <div className="space-y-8 max-w-3xl mx-auto pt-4">
            <blockquote className="border-l-4 border-deepBlue-600 pl-6 py-2 my-6">
              <p className="text-xl sm:text-2xl font-bold text-deepBlue-900 leading-snug italic">
                "The tradition works. We are just making it easier to trust."
              </p>
            </blockquote>

            <p className="text-deepBlue-700 text-base leading-relaxed">
              We are still early. The platform is in active development and open to beta users right now. We are listening closely to early adopters, refining our feature set, and building toward a version of AjoSave that works seamlessly for families, friends, cooperatives, and communities of all sizes.
            </p>

            {/* Horizontal Timeline Bar */}
            <div className="pt-6 border-t border-slate-200">
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs font-mono font-bold text-deepBlue-500">2025</span>
                  <p className="text-xs font-bold text-deepBlue-900 mt-1">Codefest Hackathon</p>
                  <p className="text-xs text-deepBlue-500 mt-0.5">Prototype designed and core architecture built</p>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-deepBlue-500">2026</span>
                  <p className="text-xs font-bold text-deepBlue-900 mt-1">Platform Expansion</p>
                  <p className="text-xs text-deepBlue-500 mt-0.5">Full backend security and mobile development</p>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-deepBlue-500">NOW</span>
                  <p className="text-xs font-bold text-deepBlue-900 mt-1">Open Beta</p>
                  <p className="text-xs text-deepBlue-500 mt-0.5">Active testing with early savings groups</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TEAM SECTION ────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-200 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">

          <div className="max-w-xl mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-deepBlue-500">The team</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-deepBlue-900 mt-3 leading-tight tracking-tight">
              Five people. One shared obsession.
            </h2>
            <p className="mt-4 text-deepBlue-600 text-base leading-relaxed">
              We met at Codefest 2025 with different skills and the same conviction — that community savings deserved a better tool. We are still building it together.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.slice(0, 3).map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>

          {/* Bottom row — 2 cards centered */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:max-w-[calc(66.666%+1.5rem)] mx-auto">
            {team.slice(3).map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>

        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────────────────── */}
      <section className="bg-deepBlue-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Want to save with your community?
          </h2>
          <p className="text-deepBlue-200 text-base leading-relaxed max-w-xl mx-auto">
            AjoSave is free to use while we are in beta. Create a group, invite your people, and start saving together today.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 bg-white text-deepBlue-900 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-deepBlue-50 transition-colors shadow-sm"
          >
            Start Saving for Free <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

// ── TeamCard component ────────────────────────────────────────────────────────
const TeamCard = ({ member }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-deepBlue-200 transition-all group">
    {/* Photo */}
    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    {/* Info */}
    <div className="p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-deepBlue-500 mb-1">{member.role}</p>
      <h3 className="text-base font-bold text-deepBlue-900 leading-snug mb-2">{member.name}</h3>
      <p className="text-sm text-deepBlue-600 leading-relaxed">{member.bio}</p>
    </div>
  </div>
);

export default About;