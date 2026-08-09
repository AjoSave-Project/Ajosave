import React, { useState, useEffect } from 'react'
import { Search, MoreVertical, CheckCircle, Clock, XCircle, Filter, RefreshCw, AlertCircle } from 'lucide-react'
import adminServices from '../../services/adminServices'

const kycConfig = {
  verified: { icon: CheckCircle, bg: 'bg-green-50',    text: 'text-green-600',    border: 'border-green-200' },
  pending:  { icon: Clock,       bg: 'bg-amber-50',    text: 'text-amber-600',    border: 'border-amber-200' },
  rejected: { icon: XCircle,     bg: 'bg-red-50',      text: 'text-red-600',      border: 'border-red-200' },
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 20 })

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        limit: pagination.pageSize,
        offset: (pagination.page - 1) * pagination.pageSize,
        search: searchTerm || undefined,
        kycStatus: filterStatus !== 'all' ? filterStatus : undefined,
      }

      const response = await adminServices.getUsers(params)
      
      if (response.success) {
        setUsers(response.data.items || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.meta?.total || 0,
        }))
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, filterStatus])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchUsers()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'suspend':
          await adminServices.suspendUser(userId, 'Suspended by admin')
          break
        case 'activate':
          await adminServices.activateUser(userId)
          break
        case 'approveKyc':
          await adminServices.approveKyc(userId)
          break
        case 'rejectKyc':
          await adminServices.rejectKyc(userId, 'Rejected by admin')
          break
        default:
          return
      }
      fetchUsers() // Refresh list
    } catch (err) {
      console.error('Error performing user action:', err)
      alert(err.message || 'Failed to perform action')
    }
  }

  // Helper to determine KYC status display
  const getKycStatus = (user) => {
    if (user.isVerified) return 'verified'
    if (user.isPhoneVerified) return 'pending'
    return 'rejected'
  }

  // Helper to determine account status display
  const getAccountStatus = (user) => {
    if (user.isSuspended) return 'suspended'
    if (user.isDeactivated) return 'deactivated'
    if (user.isActive) return 'active'
    return 'inactive'
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-deepBlue-600 animate-spin" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error && users.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Users</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">User Management</h1>
          <p className="text-gray-600 text-sm mt-0.5">Manage and verify user accounts</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-deepBlue-500"
          >
            <option value="all">All KYC Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">KYC</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const kycStatus = getKycStatus(user)
                const accountStatus = getAccountStatus(user)
                const kyc = kycConfig[kycStatus] || kycConfig.pending
                const KycIcon = kyc.icon
                const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
                
                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.phoneNumber || 'N/A'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.email || 'N/A'}</td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${kyc.bg} ${kyc.border}`}>
                        <KycIcon className={`w-3.5 h-3.5 ${kyc.text}`} />
                        <span className={`text-xs font-bold capitalize ${kyc.text}`}>{kycStatus}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        accountStatus === 'active'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : accountStatus === 'suspended'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        {accountStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{joinDate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {Math.min(users.length, pagination.pageSize)} of {pagination.total} users
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1 || loading}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize) || loading}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
