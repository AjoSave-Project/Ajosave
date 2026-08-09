import React, { useState } from 'react'
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import NotificationsDropdown from '../common/NotificationsDropdown'
import LanguageToggle from '../common/LanguageToggle'

export default function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const roleLabel = {
    admin: 'Administrator',
    moderator: 'Moderator',
    user: 'User',
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Right */}
      <div className="flex items-center space-x-3">
        {/* Language Toggle */}
        <LanguageToggle />

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition"
          >
            <div className="w-8 h-8 bg-deepBlue-100 rounded-full flex items-center justify-center ring-2 ring-deepBlue-500">
              <User className="w-4 h-4 text-deepBlue-600" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-green-500">{roleLabel[user?.role] || user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { logout(); setShowUserMenu(false) }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
