import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Play, Monitor } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import HomeNavbar from '../components/layout/HomeNavbar'
import HomeFooter from '../components/layout/HomeFooter'
import PlayStoreButton from '../components/common/PlayStoreButton'
import AppStoreButton from '../components/common/AppStoreButton'
import heroImage from '../assets/images/vitaly-gariev-uFF_apyZ-l8-unsplash.jpg'
import signupImage from '../assets/images/Signup.jpeg'
import groupImage from '../assets/images/Group.jpeg'
import paymentImage from '../assets/images/Payment.jpeg'
import walletImage from '../assets/images/Wallet.jpeg'
import dashboardImage from '../assets/images/Dashboard.jpeg'
import webDashboardImage from '../assets/images/webDashboard.png'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, user } = useAuth()
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)

  // Handle session management and redirects
  useEffect(() => {
    if (isAuthenticated && user) {
      // Show welcome back message briefly before redirecting
      setShowWelcomeBack(true)
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 2000) // 2 second delay to show welcome message
      
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, user, navigate])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600 mx-auto mb-4"></div>
          <p className="text-deepBlue-600 font-medium">Loading AjoSave...</p>
        </div>
      </div>
    )
  }

  // Show welcome back message for returning users
  if (showWelcomeBack && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-deepBlue-800 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-deepBlue-600 mb-4">
            Redirecting you to your dashboard...
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-deepBlue-200 rounded-full">
              <div className="h-2 bg-deepBlue-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleGetStarted = () => {
    // If not authenticated, go to onboarding/welcome page
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-white home-page-scrollbar">
      <HomeNavbar />
      
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        <div className="bg-gradient-to-br from-deepBlue-50 to-deepBlue-100">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-deepBlue-800 mb-6 leading-tight">
                Building Nigeria's
                <span className="text-deepBlue-600 block">Financial Future</span>
              </h1>
              
              <p className="text-xl text-deepBlue-600 mb-8 leading-relaxed">
                A fintech solution dedicated to making community savings accessible, 
                transparent, and secure for every Nigerian. Here's why you should trust us.
              </p>
              
              {/* Download Buttons replacing the badges */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <PlayStoreButton size="lg" />
                <AppStoreButton size="lg" />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-deepBlue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-deepBlue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                  Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className="flex items-center justify-center space-x-2 text-deepBlue-600 hover:text-deepBlue-800 font-medium px-6 py-4 transition-colors">
                  <Play className="w-5 h-5" />
                  <span>Watch How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={heroImage}
                  alt="African businesspeople discussing financial planning and savings" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                {/* Floating Stats Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-deepBlue-800">Beta</div>
                  <div className="text-sm text-deepBlue-600">Early Access</div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-deepBlue-600">Transparent</div>
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-deepBlue-200 to-purple-200 rounded-2xl transform rotate-3 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide with Phone Mockups */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deepBlue-800 mb-4">
              How to Get Started
            </h2>
            <p className="text-xl text-deepBlue-600 max-w-2xl mx-auto">
              Simple, transparent steps to begin your savings journey with AjoSave
            </p>
          </div>

          {/* Step 1: Create Account */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-3xl font-bold text-deepBlue-800">Create Your Account</h3>
                </div>
                <p className="text-lg text-deepBlue-600 mb-6">
                  Sign up with your phone number and verify your identity. We use secure, encrypted processes 
                  to protect your information every step of the way.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Phone number verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Secure identity verification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Bank-level encryption</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  {/* Phone Mockup - Cropped Design */}
                  <div className="relative w-72 h-auto">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-black rounded-3xl p-1">
                        {/* Screen Content */}
                        <div className="bg-white rounded-2xl overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="bg-white h-2"></div>
                          <img 
                            src={signupImage} 
                            alt="AjoSave Signup Screen"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Explore Groups */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Phone Mockup - Cropped Design */}
                  <div className="relative w-72 h-auto">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-black rounded-3xl p-1">
                        {/* Screen Content */}
                        <div className="bg-white rounded-2xl overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="bg-white h-2"></div>
                          <img 
                            src={groupImage} 
                            alt="AjoSave Groups Screen"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -left-4 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      👥
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-3xl font-bold text-deepBlue-800">Explore Or Create Savings Groups</h3>
                </div>
                <p className="text-lg text-deepBlue-600 mb-6">
                  Browse available savings groups or create your own. See all details before joining, 
                  including member information, contribution amounts, and payout schedules.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">View group details and members</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Check contribution schedules</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Create your own group</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Make Payments */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-3xl font-bold text-deepBlue-800">Make Contributions</h3>
                </div>
                <p className="text-lg text-deepBlue-600 mb-6">
                  Set up automatic or manual contributions. Track every payment in real-time with 
                  complete transparency and detailed transaction history.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Secure payment processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Real-time transaction tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Automatic reminders</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  {/* Phone Mockup - Cropped Design */}
                  <div className="relative w-72 h-auto">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-black rounded-3xl p-1">
                        {/* Screen Content */}
                        <div className="bg-white rounded-2xl overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="bg-white h-2"></div>
                          <img 
                            src={paymentImage} 
                            alt="AjoSave Payment Screen"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      💳
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Manage Wallet */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Phone Mockup - Cropped Design */}
                  <div className="relative w-72 h-auto">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-black rounded-3xl p-1">
                        {/* Screen Content */}
                        <div className="bg-white rounded-2xl overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="bg-white h-2"></div>
                          <img 
                            src={walletImage} 
                            alt="AjoSave Wallet Screen"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -left-4 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      💰
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    4
                  </div>
                  <h3 className="text-3xl font-bold text-deepBlue-800">Manage Your Wallet</h3>
                </div>
                <p className="text-lg text-deepBlue-600 mb-6">
                  Track your savings, view transaction history, and receive payouts directly to your 
                  bank account. Everything is transparent and happens automatically on your turn.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Real-time balance updates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Automatic payout processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Complete transaction history</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Dashboard Overview */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-deepBlue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    5
                  </div>
                  <h3 className="text-3xl font-bold text-deepBlue-800">Track Your Progress</h3>
                </div>
                <p className="text-lg text-deepBlue-600 mb-6">
                  Monitor all your savings activities from one central dashboard. Get insights into your 
                  savings patterns, upcoming contributions, and group activities.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Comprehensive dashboard view</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Savings analytics and insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-deepBlue-700">Group activity notifications</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  {/* Phone Mockup - Cropped Design */}
                  <div className="relative w-72 h-auto">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-1 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-black rounded-3xl p-1">
                        {/* Screen Content */}
                        <div className="bg-white rounded-2xl overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="bg-white h-2"></div>
                          <img 
                            src={dashboardImage} 
                            alt="AjoSave Dashboard Screen"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                      📊
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Web Dashboard Section */}
      <div className="bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-deepBlue-800 mb-4">
              Access Everything on the Web Too
            </h2>
            <p className="text-xl text-deepBlue-600 max-w-3xl mx-auto">
              Prefer using your computer? No problem! Everything you can do on mobile can also be done 
              through our comprehensive web dashboard. Manage your savings from any device, anywhere.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-deepBlue-800 mb-6">
                Full-Featured Web Experience
              </h3>
              <p className="text-lg text-deepBlue-600 mb-8">
                Our web dashboard provides the same powerful features as our mobile app, optimized for 
                desktop and laptop use. Perfect for detailed analysis, bulk operations, and extended sessions.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-6 h-6 text-deepBlue-600" />
                    <span className="text-deepBlue-700 font-medium">Desktop Optimized</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-deepBlue-700 font-medium">Real-time Sync</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-deepBlue-700 font-medium">Advanced Analytics</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-deepBlue-700 font-medium">Bulk Operations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-deepBlue-700 font-medium">Export Reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-deepBlue-700 font-medium">Multi-tab Support</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-lg font-bold text-deepBlue-800 mb-3">Cross-Platform Benefits</h4>
                <ul className="space-y-2 text-deepBlue-600">
                  <li>• Start on mobile, continue on web seamlessly</li>
                  <li>• Larger screen for detailed group management</li>
                  <li>• Enhanced data visualization and reports</li>
                  <li>• Keyboard shortcuts for power users</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                {/* Laptop Mockup */}
                <div className="relative">
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl p-2 shadow-2xl">
                    {/* Screen */}
                    <div className="bg-black rounded-t-xl p-1">
                      <div className="bg-white rounded-t-lg overflow-hidden relative">
                        {/* Browser Bar */}
                        <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500">
                            app.ajosave.com
                          </div>
                        </div>
                        {/* Dashboard Screenshot */}
                        <img 
                          src={webDashboardImage} 
                          alt="AjoSave Web Dashboard"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Laptop Base */}
                  <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-4 rounded-b-2xl shadow-lg"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-lg">
                    💻
                  </div>
                  <div className="absolute -bottom-2 -left-6 bg-green-500 text-white rounded-xl px-3 py-2 text-sm font-bold shadow-lg">
                    Web Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Assurance & Transparency Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-deepBlue-800 mb-4">
            Our Quality Promise
          </h2>
          <p className="text-xl text-deepBlue-600">
            Building trust through transparency and quality assurance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-deepBlue-800 mb-6">What We're Building</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-deepBlue-800">Secure Infrastructure</h4>
                  <p className="text-deepBlue-600">End-to-end encryption, secure payment processing, and data protection</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-deepBlue-800">Transparent Operations</h4>
                  <p className="text-deepBlue-600">Open communication about features, limitations, and development progress</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-deepBlue-800">Community Support</h4>
                  <p className="text-deepBlue-600">Dedicated support team and community-driven feature development</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-deepBlue-800 mb-4">Our Current Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-deepBlue-700">Platform Development</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">Beta Ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-deepBlue-700">Security Testing</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">In Progress</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-deepBlue-700">Regulatory Compliance</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">Preparing</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-deepBlue-700">Community Feedback</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-deepBlue-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Join Our Beta Community</h3>
          <p className="text-deepBlue-100 mb-6 max-w-2xl mx-auto">
            Be among the first to experience AjoSave. Your feedback helps us build a better platform for everyone. 
            Early users get priority support and influence our development roadmap.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-deepBlue-700 px-3 py-1 rounded-full">✓ Priority Support</span>
            <span className="bg-deepBlue-700 px-3 py-1 rounded-full">✓ Feature Influence</span>
            <span className="bg-deepBlue-700 px-3 py-1 rounded-full">✓ Early Access</span>
            <span className="bg-deepBlue-700 px-3 py-1 rounded-full">✓ Community Recognition</span>
          </div>
        </div>
      </div>

      {/* Honest Stats Section */}
      <div className="bg-deepBlue-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Our Journey So Far</h2>
            <p className="text-deepBlue-200">Honest metrics from our development journey</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">6+</div>
              <div className="text-deepBlue-200">Months in Development</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-deepBlue-200">Open Source</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-deepBlue-200">Support Commitment</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">Beta</div>
              <div className="text-deepBlue-200">Current Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center bg-gradient-to-r from-deepBlue-600 to-deepBlue-700 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join Our Beta?
          </h2>
          <p className="text-deepBlue-100 mb-8 max-w-2xl mx-auto text-lg">
            Help us build the future of community savings in Nigeria. As a beta user, you'll get early access, 
            priority support, and the chance to shape our platform's development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={handleGetStarted}
              className="bg-white text-deepBlue-600 px-10 py-4 rounded-full font-semibold hover:bg-deepBlue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Join Beta Program
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-deepBlue-600 transition-all duration-200"
            >
              Learn More
            </button>
          </div>
          
          {/* Mobile App Downloads */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <PlayStoreButton size="lg" />
            <AppStoreButton size="lg" />
          </div>
          <div className="bg-deepBlue-800 rounded-lg p-4 mb-4">
            <p className="text-deepBlue-100 text-sm font-medium mb-2">Beta Program Benefits:</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <span className="bg-deepBlue-700 px-2 py-1 rounded">Free Access</span>
              <span className="bg-deepBlue-700 px-2 py-1 rounded">Priority Support</span>
              <span className="bg-deepBlue-700 px-2 py-1 rounded">Feature Requests</span>
              <span className="bg-deepBlue-700 px-2 py-1 rounded">Community Recognition</span>
            </div>
          </div>
          <p className="text-deepBlue-200 text-sm">
            By continuing, you agree to our{' '}
            <button 
              onClick={() => navigate('/terms-conditions')}
              className="underline hover:text-white"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              onClick={() => navigate('/privacy-policy')}
              className="underline hover:text-white"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      <HomeFooter />
      </div>
    </div>
  )
}

export default Home
