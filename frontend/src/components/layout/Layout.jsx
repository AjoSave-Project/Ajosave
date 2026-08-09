// frontend/src/components/layout/Layout.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, CreditCard, Wallet, LogOut, MessageSquare } from 'lucide-react';

const navigation = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/groups', icon: Users, label: 'Groups' },
  { path: '/chats', icon: MessageSquare, label: 'Chats' },
  { path: '/payment', icon: CreditCard, label: 'Pay' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
];

const isNavActive = (item, pathname) => {
  if (item.path === '/groups') return pathname.startsWith('/groups') && !pathname.includes('/chat');
  if (item.path === '/chats') return pathname === '/chats' || pathname.includes('/chat');
  return pathname === item.path;
};

// Small dropdown that appears below the avatar on mobile
const ProfileDropdown = ({ user, onLogout, onClose }) => {
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-3 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-deepBlue-100 z-50 overflow-hidden"
    >
      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-deepBlue-800 leading-tight">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-deepBlue-400 leading-tight mt-0.5 truncate">{user.email}</p>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500
                   hover:bg-red-50 transition-colors duration-150"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
        Log Out
      </button>
    </div>
  );
};

const Layout = ({ children }) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
      navigate('/auth');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const showNav = isAuthenticated && !loading;

  return (
    <div className="min-h-screen bg-deepBlue-50 flex">

      {/* ── Desktop Sidebar (md and up) ── */}
      {showNav && (
        <aside className="hidden md:flex flex-col w-60 lg:w-64 flex-shrink-0 bg-white border-r border-deepBlue-100 fixed top-0 left-0 bottom-0 z-40">

          {/* Branding */}
          <div className="px-6 py-5 border-b border-deepBlue-100">
            <span className="text-xl font-bold text-deepBlue-700 tracking-tight">Ajosave</span>
          </div>

          {/* User info */}
          {user && (
            <div className="px-4 py-4 border-b border-deepBlue-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: '#3d71d9' }}
                >
                  {user.firstName?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-deepBlue-800 truncate leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-deepBlue-400 truncate leading-tight">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main nav */}
          <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item, location.pathname);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-deepBlue-600 text-white shadow-sm'
                      : 'text-deepBlue-500 hover:bg-deepBlue-50 hover:text-deepBlue-700'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 1.8} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout at the bottom */}
          <div className="px-3 pb-5 border-t border-deepBlue-100 pt-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                         text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
              Log Out
            </button>
          </div>
        </aside>
      )}

      {/* ── Main content area ── */}
      <div className={`flex-1 flex flex-col min-h-screen ${showNav ? 'md:ml-60 lg:ml-64' : ''}`}>

        {/* Mobile top header */}
        {showNav && (
          <header className="md:hidden sticky top-0 z-30 bg-white border-b border-deepBlue-100">
            <div className="relative flex items-center px-4 py-2.5">
              {user && (
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2.5 hover:bg-deepBlue-50 rounded-xl px-2 py-1 transition-colors duration-150"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: '#3d71d9' }}
                  >
                    {user.firstName?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-deepBlue-800 leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-deepBlue-400 leading-tight">{user.email}</p>
                  </div>
                </button>
              )}

              {/* Profile dropdown */}
              {profileOpen && (
                <ProfileDropdown
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setProfileOpen(false)}
                />
              )}
            </div>
          </header>
        )}

        {/* Page content */}
        <main className={`flex-1 ${showNav ? 'pb-16 md:pb-0' : ''}`}>
          {children}
        </main>

        {/* ── Mobile bottom tab bar ── */}
        {showNav && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-around px-2 py-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item, location.pathname);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center justify-center flex-1 py-1.5 gap-0.5 rounded-xl
                               transition-all duration-200 active:scale-95"
                    aria-label={item.label}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className={`flex items-center justify-center rounded-xl px-4 py-1 transition-all duration-200 ${
                      active ? 'bg-deepBlue-100' : 'bg-transparent'
                    }`}>
                      <Icon
                        className={`w-5 h-5 transition-colors duration-200 ${
                          active ? 'text-deepBlue-600' : 'text-gray-400'
                        }`}
                        strokeWidth={active ? 2.5 : 1.8}
                      />
                    </div>
                    <span className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                      active ? 'text-deepBlue-600' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>

    </div>
  );
};

export default Layout;
