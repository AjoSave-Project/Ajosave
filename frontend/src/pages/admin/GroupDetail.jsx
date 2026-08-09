import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Users, TrendingUp, Calendar, Clock, RefreshCw, AlertCircle
} from 'lucide-react'
import adminServices from '../../services/adminServices'

const statusConfig = {
  active:    { bg: 'bg-green-50',    text: 'text-green-600',    border: 'border-green-200' },
  pending:   { bg: 'bg-amber-50',    text: 'text-amber-600',    border: 'border-amber-200' },
  completed: { bg: 'bg-gray-50',     text: 'text-gray-600',     border: 'border-gray-200' },
  cancelled: { bg: 'bg-red-50',      text: 'text-red-600',      border: 'border-red-200' },
}

export default function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('members')

  // Fetch group details
  const fetchGroupDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await adminServices.getGroupById(id)
      
      if (response.success) {
        setGroup(response.data)
      }
    } catch (err) {
      console.error('Error fetching group details:', err)
      setError(err.message || 'Failed to load group details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchGroupDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-deepBlue-600 animate-spin" />
          <p className="text-gray-600">Loading group details...</p>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/groups')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Back to Groups</span>
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error Loading Group</h3>
              <p className="text-sm text-red-700 mt-1">{error || 'Group not found'}</p>
            </div>
          </div>
          <button
            onClick={fetchGroupDetails}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const sc = statusConfig[group.status] || statusConfig.active
  const memberCount = group.membersList?.length || group.members?.length || 0
  const totalSavings = group.totalPool || 0
  const nextPayout = group.nextPayout ? new Date(group.nextPayout).toLocaleDateString() : 'N/A'
  const createdAt = group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'N/A'

  const tabs = [
    { key: 'members', label: 'Members', count: memberCount },
    { key: 'transactions', label: 'Transactions', count: group.recentTransactions?.length || 0 },
    { key: 'details', label: 'Details' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/admin/groups')}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900 flex-shrink-0 mt-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900">{group.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
              {group.status}
            </span>
          </div>
          {group.description && (
            <p className="text-gray-600 text-sm mt-1">{group.description}</p>
          )}
        </div>
        <button
          onClick={fetchGroupDetails}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Members', value: memberCount, icon: Users, color: 'text-deepBlue-600', bg: 'bg-deepBlue-50' },
          { label: 'Total Savings', value: `₦${totalSavings.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Contribution', value: `₦${(group.contributionAmount || 0).toLocaleString()}`, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Next Payout', value: nextPayout, icon: Clock, color: 'text-deepBlue-600', bg: 'bg-deepBlue-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-5 py-3.5 text-sm font-semibold transition border-b-2 ${
                activeTab === tab.key
                  ? 'border-deepBlue-600 text-deepBlue-600 bg-deepBlue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key ? 'bg-deepBlue-100 text-deepBlue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="divide-y divide-gray-200">
            {(group.membersList || []).map((member, index) => {
              const user = typeof member.userId === 'object' ? member.userId : null
              const memberName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User'
              const memberPhone = user?.phoneNumber || 'N/A'
              const joinDate = member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'
              
              return (
                <div key={index} className="flex items-center px-5 py-4 hover:bg-gray-50 transition">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-deepBlue-100 flex items-center justify-center flex-shrink-0 mr-3 ring-2 ring-deepBlue-500">
                    <span className="text-sm font-bold text-deepBlue-600">
                      {memberName.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{memberName}</p>
                      {member.role === 'admin' && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{memberPhone}</p>
                  </div>

                  {/* Status */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Joined: {joinDate}</p>
                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      member.status === 'active'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}>
                      {member.status || 'active'}
                    </span>
                  </div>
                </div>
              )
            })}
            {memberCount === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No members found</p>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(group.recentTransactions || []).map((txn) => {
                  const txnDate = txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : 'N/A'
                  return (
                    <tr key={txn._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold text-deepBlue-600">
                        {txn._id?.slice(-8) || 'N/A'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold capitalize text-gray-700">
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                        ₦{(txn.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-600">{txnDate}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          txn.status === 'completed'
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : txn.status === 'pending'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {(!group.recentTransactions || group.recentTransactions.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-500">No transactions found</p>
              </div>
            )}
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Group Name</p>
                <p className="text-sm font-bold text-gray-900">{group.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                  {group.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Created Date</p>
                <p className="text-sm font-bold text-gray-900">{createdAt}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Frequency</p>
                <p className="text-sm font-bold text-gray-900">{group.frequency || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Max Members</p>
                <p className="text-sm font-bold text-gray-900">{group.maxMembers || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Admin</p>
                <p className="text-sm font-bold text-gray-900">
                  {group.admin ? `${group.admin.firstName} ${group.admin.lastName}` : 'N/A'}
                </p>
              </div>
            </div>
            {group.description && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-700">{group.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
