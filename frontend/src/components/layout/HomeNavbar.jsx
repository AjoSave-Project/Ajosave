import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const HomeNavbar = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const isTransparentNavPage = location.pathname === '/' || location.pathname === '/about';

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
    <>
      <div className="fixed top-4 left-4 right-4 z-50">
        <nav 
          className={`mx-auto transition-all duration-500 rounded-2xl transform -skew-x-1 ${
            isCollapsed 
              ? 'max-w-48' // Collapsed state - much smaller width
              : 'max-w-6xl' // Normal state
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
        <div className={`flex items-center transition-all duration-500 ${isCollapsed ? 'justify-center h-10' : 'justify-between h-12'}`}>
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

        {/* Mobile Menu */}
        {isMenuOpen && !isCollapsed && (
          <div className={`md:hidden border-t border-white/20 py-4 bg-black/20 backdrop-blur-sm rounded-b-lg mt-2`}>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`font-medium text-left px-4 py-1.5 transition-all rounded-lg text-sm relative ${
                      isActive 
                        ? 'text-white bg-white/20 shadow-lg' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-blue-300 rounded-full"></div>
                    )}
                  </button>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="text-white hover:text-blue-200 font-medium text-left px-4 py-1.5 transition-colors rounded-lg text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="bg-deepBlue-600 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors text-center mx-2 text-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </nav>
    </div>
    
    {/* Content spacer for pages that don't have transparent navbar */}
    {!isTransparentNavPage && <div className="h-24 w-full"></div>}
  </>
  );
};

export default HomeNavbar;