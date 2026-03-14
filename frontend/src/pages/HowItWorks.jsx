import React from 'react';
import { UserPlus, Users, CreditCard, Wallet, Shield, CheckCircle } from 'lucide-react';
import HomeNavbar from '../components/layout/HomeNavbar';
import HomeFooter from '../components/layout/HomeFooter';

const HowItWorks = () => {
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

  const groupTypes = [
    {
      name: "Daily Ajo",
      amount: "₦1,000 - ₦5,000",
      duration: "30 days",
      description: "Perfect for small daily savings with quick turnaround",
      popular: false
    },
    {
      name: "Weekly Ajo",
      amount: "₦5,000 - ₦25,000",
      duration: "12 weeks",
      description: "Ideal for medium-term savings goals",
      popular: true
    },
    {
      name: "Monthly Ajo",
      amount: "₦25,000 - ₦100,000",
      duration: "12 months",
      description: "Best for long-term wealth building",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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

        {/* Steps Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Get Started in 4 Simple Steps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-deepBlue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                  {index + 1}
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-deepBlue-100 h-full hover:shadow-xl transition-shadow">
                  <div className="flex justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-deepBlue-800 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-deepBlue-600 text-center mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-deepBlue-500">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Types Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-deepBlue-800 mb-12">
            Choose Your Savings Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {groupTypes.map((group, index) => (
              <div key={index} className={`relative bg-white rounded-xl p-6 shadow-lg border-2 hover:shadow-xl transition-all ${
                group.popular ? 'border-deepBlue-600 transform scale-105' : 'border-deepBlue-100'
              }`}>
                {group.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-deepBlue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-deepBlue-800 mb-2">
                    {group.name}
                  </h3>
                  <div className="text-3xl font-bold text-deepBlue-600 mb-2">
                    {group.amount}
                  </div>
                  <div className="text-deepBlue-500 mb-4">
                    Duration: {group.duration}
                  </div>
                  <p className="text-deepBlue-600 mb-6">
                    {group.description}
                  </p>
                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    group.popular 
                      ? 'bg-deepBlue-600 text-white hover:bg-deepBlue-700' 
                      : 'bg-deepBlue-100 text-deepBlue-600 hover:bg-deepBlue-200'
                  }`}>
                    Learn More
                  </button>
                </div>
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

        {/* Example Section */}
        <div className="bg-gradient-to-r from-deepBlue-50 to-deepBlue-100 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-deepBlue-800 mb-8 text-center">
            Real Example: Weekly Ajo Group
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">
                  Group Details
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-deepBlue-600">Members:</span>
                    <span className="font-medium">10 people</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-deepBlue-600">Weekly Contribution:</span>
                    <span className="font-medium">₦10,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-deepBlue-600">Total Collection:</span>
                    <span className="font-medium text-green-600">₦100,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-deepBlue-600">Duration:</span>
                    <span className="font-medium">10 weeks</span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-deepBlue-800 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <p className="text-deepBlue-700">
                    Each member contributes ₦10,000 every week
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <p className="text-deepBlue-700">
                    One member receives ₦100,000 each week (by rotation)
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <p className="text-deepBlue-700">
                    After 10 weeks, everyone has received their full payout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-deepBlue-800 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-deepBlue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerians who are already building their financial future with AjoSave. 
            Start your savings journey today!
          </p>
          <button className="bg-white text-deepBlue-800 px-8 py-4 rounded-lg font-semibold hover:bg-deepBlue-50 transition-colors shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default HowItWorks;