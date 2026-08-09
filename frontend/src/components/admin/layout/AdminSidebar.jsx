import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Activity, TrendingUp, MessageSquare,
  BarChart3, FileText, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'
import LanguageToggle from '../common/LanguageToggle'

export default function AdminSidebar({ isOpen, onToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const adminRole = localStorage.getItem('adminRole') || 'admin'

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken')
    localStorage.removeItem('isAdminSession')
    localStorage.removeItem('adminRole')
    navigate('/admin/login', { replace: true })
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard',        path: '/admin/dashboard',    roles: ['super_admin', 'admin', 'moderator'] },
    { icon: Users,           label: 'User Management',  path: '/admin/users',        roles: ['super_admin', 'admin', 'moderator'] },
    { icon: Activity,        label: 'Groups',           path: '/admin/groups',       roles: ['super_admin', 'admin', 'moderator'] },
  ]

  const filtered = menuItems.filter(item => item.roles.includes(adminRole))
  const isActive = (path) => location.pathname === path

  return (
    <div className={`${isOpen ? 'w-64' : 'w-[72px]'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 flex-shrink-0`}>

      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-deepBlue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <span className="text-gray-900 font-black text-base tracking-tight">AjoSave</span>
              <span className="block text-green-500 text-[10px] font-semibold tracking-widest uppercase -mt-0.5">Admin</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filtered.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : ''}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                active
                  ? 'bg-deepBlue-600 text-white shadow-lg shadow-deepBlue-500/20'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
              {active && isOpen && (
                <span className="ml-auto w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        {/* Language Toggle */}
        <div className={`${isOpen ? 'block' : 'flex justify-center'}`}>
          <LanguageToggle />
        </div>
        
        <button
          onClick={handleLogout}
          title={!isOpen ? 'Logout' : ''}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </div>
  )
}
