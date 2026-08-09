import React, { useState, useEffect } from 'react'
import { Search, Users, TrendingUp, Calendar, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import adminServices from '../../services/adminServices'

const statusConfig = {
  active:    { bg: 'bg-green-50',    text: 'text-green-600',    border: 'border-green-200' },
  pending:   { bg: 'bg-amber-50',    text: 'text-amber-600',    border: 'border-amber-200' },
  completed: { bg: 'bg-gray-50',     text: 'text-gray-600',     border: 'border-gray-200' },
  cancelled: { bg: 'bg-red-50',      text: 'text-red-600',      border: 'border-red-200' },
}

export default function GroupManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 20 })
  const navigate = useNavigate()

  // Fetch groups from backend
  const fetchGroups = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        limit: pagination.pageSize,
        offset: (pagination.page - 1) * pagination.pageSize,
        search: searchTerm || undefined,
      }

      const response = await adminServices.getGroups(params)
      
      if (response.success) {
        setGroups(response.data.items || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.meta?.total || 0,
        }))
      }
    } catch (err) {
      console.error('Error fetching groups:', err)
      setError(err.message || 'Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [pagination.page])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchGroups()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  if (loading && groups.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-deepBlue-600 animate-spin" />
          <p className="text-gray-600">Loading groups...</p>
        </div>
      </div>
    )
  }

  if (error && groups.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Groups</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchGroups}
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
          <h1 className="text-2xl font-black text-gray-900">Group Management</h1>
          <p className="text-gray-600 text-sm mt-0.5">Monitor and manage savings groups</p>
        </div>
        <button
          onClick={fetchGroups}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          const sc = statusConfig[group.status] || statusConfig.active
          const nextPayout = group.nextPayout ? new Date(group.nextPayout).toLocaleDateString() : 'N/A'
          const memberCount = group.memberCount || group.members?.length || 0
          const totalSavings = group.totalPool || 0
          
          return (
            <div key={group._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">{group.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                  {group.status}
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="w-4 h-4 text-deepBlue-600" />
                  <span className="text-sm">{memberCount} members</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">₦{totalSavings.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">Next payout: {nextPayout}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/admin/groups/${group._id}`)}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-gray-50 hover:bg-deepBlue-600 border border-gray-200 hover:border-deepBlue-500 text-gray-700 hover:text-white rounded-lg transition-all duration-200 text-sm font-semibold">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {groups.length === 0 && !loading && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500">No groups found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {Math.min(groups.length, pagination.pageSize)} of {pagination.total} groups
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
