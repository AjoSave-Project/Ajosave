import { useEffect, useState } from 'react';
import { UserPlus, Users, CreditCard, Wallet, Shield, CheckCircle, User } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const HowItWorks = () => {
  const [activeProfile, setActiveProfile] = useState(0);
  
  // Customer profiles for the rotation animation
  const profiles = [
    { id: 1, name: "Adunni", avatar: "A", color: "bg-blue-500", position: "receive" },
    { id: 2, name: "Bola", avatar: "B", color: "bg-green-500", position: "contribute" },
    { id: 3, name: "Chika", avatar: "C", color: "bg-purple-500", position: "contribute" },
    { id: 4, name: "Dayo", avatar: "D", color: "bg-yellow-500", position: "contribute" },
    { id: 5, name: "Emeka", avatar: "E", color: "bg-red-500", position: "contribute" },
    { id: 6, name: "Fatima", avatar: "F", color: "bg-indigo-500", position: "contribute" }
  ];

  // Rotate the receiving member every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProfile((prev) => (prev + 1) % profiles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [profiles.length]);
  const steps = [
    {
      icon: <UserPlus className="w-12 h-12 text-deepBlue-600" />,
      title: "Sign Up & Verify",
      description: "Create your account with your phone number, verify your identity, and set up your profile securely.",
      details: [
        "Phone number verification",
        "Identity verification with BVN/NIN",
        "Secure profile setup"
      ]
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: "Join or Create a Group",
      description: "Browse existing savings groups or create your own with friends, family, or like-minded savers.",
      details: [
        "Browse verified groups",
        "Create custom groups",
        "Set group rules and schedules"
      ]
    },
    {
      icon: <CreditCard className="w-12 h-12 text-purple-600" />,
      title: "Make Regular Contributions",
      description: "Contribute your agreed amount on schedule. All payments are secure and tracked transparently.",
      details: [
        "Automated payment reminders",
        "Multiple payment methods",
        "Real-time transaction tracking"
      ]
    },
    {
      icon: <Wallet className="w-12 h-12 text-yellow-600" />,
      title: "Receive Your Payout",
      description: "When it's your turn, receive the full collection amount directly to your bank account.",
      details: [
        "Guaranteed payout schedule",
        "Direct bank transfers",
        "Instant notifications"
      ]
    }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-deepBlue-600" />,
      title: "Bank-Level Security",
      description: "Your funds are protected with enterprise-grade security and regulatory compliance."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Verified Members",
      description: "All group members are verified with government-issued IDs for your peace of mind."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community Support",
      description: "Join a supportive community of savers working towards similar financial goals."
    }
  ];

  return (
    <div className="min-h-screen bg-white home-page-scrollbar">
      <HomeNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-deepBlue-800 mb-6">
            How AjoSave Works
          </h1>
          <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto leading-relaxed">
            Simple, secure, and transparent community saving. Join thousands of Nigerians 
            building their financial future together.
          </p>
        </div>

        {/* Steps Section - Modified Layout */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Get Started in 4 Simple Steps
          </h2>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Content */}
                <div className="flex items-center space-x-8 py-8">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-deepBlue-50 rounded-xl flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-deepBlue-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-deepBlue-600 mb-3">
                      {step.description}
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-deepBlue-500">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Divider - Don't show after last step */}
                {index < steps.length - 1 && (
                  <div className="border-b border-deepBlue-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Why Choose AjoSave?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-deepBlue-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rotational Ajo System Animation */}
        <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            How the Rotational Ajo System Works
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Explanation Text */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-deepBlue-800 mb-4">
                  Traditional Ajo, Digitally Secured
                </h3>
                <p className="text-deepBlue-700 leading-relaxed mb-4">
                  In a traditional Ajo system, members take turns receiving the total contributions. 
                  AjoSave digitizes this time-tested method with modern security and transparency.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-deepBlue-800 mb-3">
                  Example: 6-Member Group
                </h4>
                <ul className="space-y-3 text-deepBlue-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-deepBlue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Weekly Contribution:</strong> ₦10,000 per member</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-deepBlue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Total Pool:</strong> ₦60,000 each week</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-deepBlue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Rotation:</strong> Each member receives ₦60,000 once during the 6-week cycle</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Currently Receiving:</span>
                </div>
                <p className="text-green-700 text-lg font-semibold">
                  {profiles[activeProfile].name} receives ₦60,000 this week
                </p>
              </div>
            </div>

            {/* Right Side - Customer Profile Animation */}
            <div className="flex justify-center">
              <div className="relative w-96 h-96">
                {/* Member Circles arranged in a circle */}
                {profiles.map((profile, index) => {
                  const angle = (index * 60) - 90; // 60 degrees apart, starting from top
                  const radius = 140; // Increased from 100 to 140 for more spacing
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  const isActive = index === activeProfile;

                  return (
                    <div
                      key={profile.id}
                      className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                        isActive 
                          ? `${profile.color} scale-110 shadow-xl` 
                          : `${profile.color} opacity-75`
                      }`}
                      style={{
                        left: `calc(50% + ${x}px - 2rem)`,
                        top: `calc(50% + ${y}px - 2rem)`,
                      }}
                    >
                      {profile.avatar}
                      
                      {/* Member name */}
                      <div 
                        className={`absolute text-sm font-medium whitespace-nowrap ${
                          isActive ? 'text-deepBlue-800' : 'text-deepBlue-600'
                        }`}
                        style={{
                          top: '4.5rem',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {profile.name}
                      </div>

                      {/* Receiving indicator */}
                      {isActive && (
                        <div 
                          className="absolute bg-green-500 text-white px-2 py-1 rounded text-xs font-medium"
                          style={{
                            top: '-2.5rem',
                            left: '50%',
                            transform: 'translateX(-50%)'
                          }}
                        >
                          Receives ₦60K
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Central info */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-lg border border-deepBlue-200">
                    <div className="text-2xl font-bold text-deepBlue-800">Week {activeProfile + 1}</div>
                    <div className="text-sm text-deepBlue-600">of 6</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <HomeFooter />
    </div>
  );
};

export default HowItWorks;