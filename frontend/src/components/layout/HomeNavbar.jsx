import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, HelpCircle, Mail, LogIn, UserPlus } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
  { label: 'About', path: '/about', icon: Info },
  { label: 'Contact', path: '/contact', icon: Mail },
];

const HomeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-4 right-4 z-50">
      {/* ── Trigger Bar (Aligned Top-Left) ─────────────────────────────── */}
      <div className="relative z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/60 shadow-xl backdrop-blur-md text-white transition-all duration-200 active:scale-95"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <img src={logo} alt="AjoSave" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-sm font-semibold tracking-tight pr-1">AjoSave</span>
          <div className="pl-1 border-l border-slate-700/80 text-slate-300">
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* ── Backdrop Overlay ──────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 -z-10 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* ── Slide-Down Collapsible Menu Container ─────────────────────────── */}
      <div
        className={`absolute top-0 right-0 pt-16 w-72 transition-all duration-300 ease-out origin-top-right -z-10 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl p-3 space-y-3">
          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 pt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('/auth')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/50 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => handleNav('/auth')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-900/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          <div className="pt-1 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              © {new Date().getFullYear()} AjoSave • Community Savings
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;