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
      
      {/* Hero Carousel Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className={`flex h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Render original slides plus one duplicate for seamless loop */}
          {[...heroSlides, heroSlides[0]].map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-full flex-shrink-0"
              style={{
                backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.6)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="max-w-6xl mx-auto px-4 text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 border border-deepBlue-100">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-6 text-center">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
              AjoSave was born from a simple observation: traditional Ajo (community saving) has helped 
              millions of Nigerians save money for generations, but it lacked the security, transparency, 
              and convenience that modern savers deserve.
            </p>
            <p className="text-deepBlue-700 text-lg leading-relaxed mb-6">
              Founded in 2023 by a team of fintech veterans and community saving enthusiasts, we set out 
              to digitize this time-tested savings method while preserving its community spirit and 
              adding layers of security and transparency.
            </p>
            <p className="text-deepBlue-700 text-lg leading-relaxed">
              Today, we're proud to serve thousands of savers across Nigeria, helping them achieve their 
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