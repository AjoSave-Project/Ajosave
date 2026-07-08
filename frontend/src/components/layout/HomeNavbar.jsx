import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

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
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage && !isScrolled
          ? 'bg-black/2' 
          : isScrolled 
            ? 'shadow-lg' 
            : 'shadow-sm'
      }`}
      style={{
        backgroundImage: isHomePage && !isScrolled 
          ? 'none' 
          : `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.85)), url('https://images.unsplash.com/photo-1650803321892-efba59b28a60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src={logo} 
              alt="AjoSave Logo" 
              className="w-10 h-10 rounded-xl object-contain"
            />
            <span className="text-xl font-bold text-white">AjoSave</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-white hover:text-blue-200 font-medium transition-colors px-3 py-2 rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/auth')}
              className="text-white hover:text-blue-200 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="bg-deepBlue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors shadow-lg"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-blue-200 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t border-white/20 py-4 bg-black/20 backdrop-blur-sm rounded-b-lg mt-2`}>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="text-white hover:text-blue-200 font-medium text-left px-4 py-2 transition-colors rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="text-white hover:text-blue-200 font-medium text-left px-4 py-2 transition-colors rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="bg-deepBlue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-deepBlue-700 transition-colors text-center mx-2"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;