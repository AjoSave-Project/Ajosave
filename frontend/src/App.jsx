import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/common/Toast'
import { useSessionTimeout } from './hooks/useSessionTimeout'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import { useHomePageScrollbar } from './hooks/useHomePageScrollbar'
import SessionTimeoutWarning from './components/common/SessionTimeoutWarning'
import NetworkStatus from './components/common/NetworkStatus'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Welcome from './pages/Welcome'
import SignIn from './pages/auth/SignIn'
import CreateAccount from './pages/auth/CreateAccount'
import VerifyContact from './pages/auth/VerifyContact'
import KYCVerify from './pages/auth/KYCVerify'
import CompleteProfile from './pages/auth/CompleteProfile'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import Payment from './pages/Payment'
import Wallet from './pages/Wallet'
import CreateGroup from './components/groups/CreateGroup'
import JoinGroup from './components/groups/JoinGroup'
import GroupChat from './pages/GroupChat'
import GroupChats from './pages/GroupChats'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, pendingOtp } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }
  
  if (isAuthenticated && pendingOtp) return <Navigate to="/auth" replace />
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, pendingOtp } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }
  return children
}

// App Content Component with Session Management
const AppContent = () => {
  const sessionTimeout = useSessionTimeout(25, 5); // 25 min timeout, 5 min warning (matches backend 30min)
  const networkStatus = useNetworkStatus();
  
  // Apply custom scrollbar for home pages
  useHomePageScrollbar();

  return (
    <>
      {/* Network Status Banner */}
      <NetworkStatus 
        isOnline={networkStatus.isOnline} 
        isSlowConnection={networkStatus.isSlowConnection} 
      />
      
      <Routes>
        {/* Public Routes - No Layout wrapper */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* Onboarding Routes */}
        <Route 
          path="/onboarding" 
          element={
            <PublicRoute>
              <Onboarding />
            </PublicRoute>
          } 
        />
        <Route 
          path="/welcome" 
          element={
            <PublicRoute>
              <Welcome />
            </PublicRoute>
          } 
        />
        
        {/* Auth Routes - New Step-by-Step Flow */}
        <Route 
          path="/auth/signin" 
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/signup" 
          element={
            <PublicRoute>
              <CreateAccount />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/verify-contact" 
          element={
            <PublicRoute>
              <VerifyContact />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/kyc-verify" 
          element={
            <PublicRoute>
              <KYCVerify />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/complete-profile" 
          element={
            <PublicRoute>
              <CompleteProfile />
            </PublicRoute>
          } 
        />
        
        {/* Legacy Auth Route (for backward compatibility) */}
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <div className="min-h-screen bg-deepBlue-50">
                <Auth />
              </div>
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes - With Layout wrapper */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups" 
          element={
            <ProtectedRoute>
              <Layout>
                <Groups />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <GroupDetail />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/create" 
          element={
            <ProtectedRoute>
              <Layout>
                <CreateGroup />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/join" 
          element={
            <ProtectedRoute>
              <Layout>
                <JoinGroup />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <Layout>
                <GroupChats />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/:id/chat" 
          element={
            <ProtectedRoute>
              <Layout>
                <GroupChat />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute>
              <Layout>
                <Wallet />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      {/* Session Timeout Warning */}
      <SessionTimeoutWarning
        show={sessionTimeout.showWarning}
        timeLeft={sessionTimeout.timeLeft}
        onExtend={sessionTimeout.extendSession}
        onDismiss={sessionTimeout.dismissWarning}
      />
    </>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App