import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminDashboard from '../../../pages/admin/AdminDashboard'
import UserManagement from '../../../pages/admin/UserManagement'
import GroupManagement from '../../../pages/admin/GroupManagement'
import GroupDetail from '../../../pages/admin/GroupDetail'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/dashboard"        element={<AdminDashboard />} />
            <Route path="/users"            element={<UserManagement />} />
            <Route path="/groups"           element={<GroupManagement />} />
            <Route path="/groups/:id"       element={<GroupDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
