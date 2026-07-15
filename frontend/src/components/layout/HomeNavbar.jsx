import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const HomeNavbar = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isTransparentNavPage = location.pathname === '/' || location.pathname === '/about';

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' },
    { label: 'About', path: '/about' }
  ];

  return (
      <div className="fixed top-4 left-4 right-4 z-50">
        <div className={`navbar-container ${
          isCollapsed 
            ? 'w-48' // Collapsed state - small width, aligned left
            : 'w-full' // Normal state - full width
        }`}>
        <nav 
          className={`transition-all duration-700 ease-out rounded-2xl transform -skew-x-1 ${
            isCollapsed 
              ? 'w-full' // Collapsed state - takes full width of container
              : 'w-full mx-auto max-w-6xl' // Normal state - centered with max width
          } ${
            isTransparentNavPage && !isScrolled
              ? 'bg-black/20 backdrop-blur-sm border border-white/10' 
              : isScrolled || isCollapsed
                ? 'shadow-xl border border-white/20' 
                : 'shadow-lg border border-white/15'
          }`}
          style={{
            backgroundImage: isTransparentNavPage && !isScrolled 
              ? 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2))' 
              : `linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.85)), url('https://images.unsplash.com/photo-1650803321892-efba59b28a60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
      <div className="container mx-auto px-4 transform skew-x-1">
        <div className={`flex items-center transition-all duration-700 ease-out ${isCollapsed ? 'justify-center h-10' : 'justify-between h-12'}`}>
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src={logo} 
              alt="AjoSave Logo" 
              className="w-8 h-8 rounded-xl object-contain"
            />
            <span className="text-lg font-bold text-white">AjoSave</span>
          </div>

          {/* Desktop Navigation */}
          {!isCollapsed && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`font-medium transition-all px-3 py-1.5 rounded-lg text-sm relative ${
                      isActive 
                        ? ' text-blue-200' 
                        : ' text-white hover:text-blue-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Desktop Auth Buttons */}
          {!isCollapsed && (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/auth')}
                className="text-white hover:text-blue-200 font-medium px-4 py-1.5 rounded-lg transition-colors text-sm"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="bg-deepBlue-600 text-white px-5 py-1.5 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors shadow-lg text-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isCollapsed && (
            <button
              className="md:hidden p-2 text-white hover:text-blue-200 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* Mobile Menu - Sidebar */}
        {isMenuOpen && !isCollapsed && (
          <>
            {/* Overlay */}
            <div 
              className="md:hidden fixed inset-0 bg-black/70 z-[60]"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <div 
              className="md:hidden fixed top-2 right-2 h-[calc(50vh] w-80 max-w-[80vw] z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl"
              style={{ 
                backgroundColor: '#1f2937',
                opacity: '1',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              <div 
                className="flex flex-col h-full"
                style={{ 
                  backgroundColor: '#1f2937',
                  opacity: '1',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none'
                }}
              >
                {/* Sidebar Header */}
                <div 
                  className="flex items-center justify-between p-6"
                  style={{ 
                    borderBottom: '1px solid #4b5563',
                    backgroundColor: '#1f2937'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <img 
                      src={logo} 
                      alt="AjoSave Logo" 
                      className="w-8 h-8 rounded-xl object-contain"
                    />
                    <span className="text-lg font-bold text-white">AjoSave</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-white hover:text-blue-200 rounded-lg transition-colors"
                    style={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.7)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.5)'}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6" style={{ backgroundColor: '#1f2937' }}>
                  <nav className="space-y-2 px-4">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group"
                          style={{
                            backgroundColor: isActive ? '#4b5563' : '#1f2937',
                            color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.target.style.backgroundColor = '#4b5563';
                              e.target.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.target.style.backgroundColor = '#1f2937';
                              e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                            }
                          }}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: '#60a5fa' }}
                            ></div>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Auth Buttons */}
                <div 
                  className="p-6 space-y-3"
                  style={{ 
                    borderTop: '1px solid #4b5563',
                    backgroundColor: '#1f2937'
                  }}
                >
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="w-full font-medium text-left px-4 py-3 transition-colors rounded-xl"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      backgroundColor: '#1f2937'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4b5563';
                      e.target.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#1f2937';
                      e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-deepBlue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-deepBlue-500 transition-colors text-center shadow-lg"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Footer */}
                <div 
                  className="p-6"
                  style={{ 
                    borderTop: '1px solid #4b5563',
                    backgroundColor: '#1f2937'
                  }}
                >
                  <p 
                    className="text-xs text-center"
                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    © 2024 AjoSave. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </nav>
    </div>
    
    {/* Content spacer for pages that don't have transparent navbar */}
    {!isTransparentNavPage && <div className="h-24 w-full"></div>}
    </div>
  );
};

export default HomeNavbar;