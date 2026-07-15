import { useEffect, useState } from 'react';
import { Shield, Users, TrendingUp, Award, Heart, Target } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';
import FeranmiImage from '../assets/images/Feranmi.jpeg';
import BashiruImage from '../assets/images/Bashiru.jpeg';
import NelsonImage from '../assets/images/Nelson.jpeg';
import TemiImage from '../assets/images/Temi.jpeg';
import KosiImage from '../assets/images/Kosi.jpeg';
import AjosaveImage from '../assets/images/Ajosave.jpeg';
import Ajosave1Image from '../assets/images/Ajosave1.jpeg';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  const heroSlides = [
    {
      image: AjosaveImage,
      title: "About AjoSave",
      subtitle: "Revolutionizing traditional community saving (Ajo) for the digital age, making it safer, more transparent, and accessible to all Nigerians."
    },
    {
      image: Ajosave1Image,
      title: "Our Mission",
      subtitle: "To democratize access to financial services and empower every Nigerian to build wealth through community-driven saving solutions."
    }
  ];

  // Auto-slide carousel - always moves left with seamless loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle seamless loop reset
  useEffect(() => {
    if (currentSlide === heroSlides.length) {
      // Wait for transition to complete, then instantly reset without transition
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
        // Re-enable transitions immediately for next slide
        setTimeout(() => setIsTransitioning(true), 50);
      }, 1000);
    }
  }, [currentSlide, heroSlides.length]);
  const team = [
    {
      name: "Olanase Umar Ayobami",
      role: "CEO & Founder",
      image: TemiImage,
      bio: "General Project Lead, Brand/Identity Manager"
    },
    {
      name: "OluwaFeranmi Adeyemo",
      role: "Head of Operations",
      image: FeranmiImage,
      bio: "Operations expert with deep knowledge of Nigerian financial systems"
    },
    {
      name: "Bashiru",
      role: "Head of Development",
      image: BashiruImage,
      bio: "Co-developement process specialist and backend security expert"
    },
    {
      name: "Otika Nelson Somtochukwu",
      role: "Chief Technical Manager",
      image: NelsonImage,
      bio: "Mobile developments Manager in processes and systems"
    },
    {
      name: "Kosisochukwu",
      role: "Chief Technical Manager",
      image: KosiImage,
      bio: "Technical developments expert"
    }
  ];

  return (
    <div className="min-h-screen bg-white home-page-scrollbar">
      <HomeNavbar />
      
{/* Editorial/Magazine-Style About Hero Section */}
<section className="relative min-h-screen bg-gradient-to-br from-deepBlue-900 via-deepBlue-800 to-deepBlue-700 text-white flex items-center px-4 sm:px-8 py-20 overflow-hidden">
  
  {/* Structural Grid lines for an architectural, custom-built look */}
  <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.05]">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="border-r border-blue-300 h-full last:border-r-0" />
    ))}
  </div>

  <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
    
    {/* Left Side: Overlapping Editorial Typography & Copy */}
    <div className="lg:col-span-7 flex flex-col justify-center h-full space-y-12 lg:space-y-24 order-2 lg:order-1">

      {/* Main Copy Area */}
      <div className="space-y-6 max-w-xl">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-snug">
          <span className="block animate-slideUpReveal">We believe the best financial futures are built together, with trust and transparency.</span>
        </h2>
        <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
          Founded by passionate Nigerians, we reimagined traditional Ajo for the digital age. 
          No gimmicks, just secure community savings that honor our cultural heritage while embracing modern technology.
        </p>
      </div>

      {/* Editorial Footer / Link block */}
      <div className="pt-4 border-t border-blue-400/20 grid grid-cols-2 gap-4 text-xs text-blue-200">
        <div>
          <span className="block text-blue-300/70 mb-1">THE VISION</span>
          <p className="text-blue-100 text-sm">Empowering Nigerian Communities</p>
        </div>
        <div className="flex items-end justify-end">
          <a href="#story" className="group flex items-center gap-2 hover:text-white transition-colors duration-200">
            <span>EXPLORE OUR STORY</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </div>

    {/* Right Side: High-Contrast Minimalist Frame */}
    <div className="lg:col-span-5 relative order-1 lg:order-2 w-full">
      
      {/* Giant subtle backdrop typographic element that goes behind the image */}
      <div className="absolute -top-16 -left-12 text-[12vw] text-deepBlue-600/20 select-none tracking-tighter leading-none pointer-events-none z-0 hidden lg:block">
        AJO
      </div>

      {/* Frame Container with strict, sharp geometry */}
      <div className="relative z-10 aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none bg-deepBlue-800 overflow-hidden border border-blue-400/30 shadow-2xl shadow-deepBlue-900/50 p-3">
        
        {/* Inner frame outline */}
        <div className="absolute inset-5 border border-blue-300/10 pointer-events-none z-20" />
        
        {/* Image element */}
        <div className="w-full h-full overflow-hidden bg-deepBlue-900">
          <img
            src={heroSlides[currentSlide]?.image || AjosaveImage}
            alt="AjoSave Team"
            className="w-full h-full object-cover hover:scale-105 transition-all duration-700 ease-out"
          />
        </div>

        {/* Minimal Stamp Label */}
        <div className="absolute bottom-6 right-6 z-20 bg-deepBlue-900/90 backdrop-blur-md px-3 py-1.5 border border-blue-400/30 text-[9px] tracking-widest text-blue-300 uppercase">
          © AJOSAVE 2024
        </div>

        {/* Slide indicator dots */}
        <div className="absolute bottom-6 left-6 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-300 w-6' 
                  : 'bg-blue-300/30 hover:bg-blue-300/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

  </div>
</section>

      <div className="container mx-auto px-4 py-20">

        {/* Story Section */}
        <div id="story" className="bg-gradient-to-r from-deepBlue-50 to-blue-50/60 rounded-2xl p-8 md:p-12 mb-16 border border-deepBlue-200/50 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-deepBlue-800 mb-3">
              Our Story
            </h2>
            <div className="w-16 h-0.5 bg-deepBlue-600 mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
              AjoSave was born from a simple observation: traditional Ajo (community saving) has helped 
              millions of Nigerians save money for generations, but it lacked the security, transparency, 
              and convenience that modern savers deserve.
            </p>
            <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
              Founded in 2024 by a team of fintech veterans and community saving enthusiasts, we set out 
              to digitize this time-tested savings method while preserving its community spirit and 
              adding layers of security and transparency.
            </p>
            <p className="text-deepBlue-700 text-lg leading-relaxed">
              Today, we're building to serve thousands of savers across Nigeria, helping them achieve their 
              financial goals through our secure, regulated, and user-friendly platform.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Meet Our Team
          </h2>
          <div className="max-w-4xl mx-auto">
            {/* First Row - 3 members */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 justify-items-center">
              {team.slice(0, 3).map((member, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                  />
                  <h3 className="text-xl font-semibold text-deepBlue-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-deepBlue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-deepBlue-500 text-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Second Row - 2 members centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                {team.slice(3, 5).map((member, index) => (
                  <div key={index + 3} className="text-center">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                    />
                    <h3 className="text-xl font-semibold text-deepBlue-800 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-deepBlue-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-deepBlue-500 text-sm">
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <HomeFooter />
    </div>
  );
};

export default About;