// frontend/src/pages/Payment.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  ArrowLeft, CheckCircle, Clock, AlertCircle, Shield,
  CreditCard, Download, Users, Calendar, Wallet, Gift
} from 'lucide-react'
import groupService from '../services/groupServices'
import { api } from '../services/api'
import walletService from '../services/walletServices'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Payment = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [groups, setGroups] = useState([])
  const [walletData, setWalletData] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [paymentStep, setPaymentStep] = useState('selectGroup')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [groupRes, walletRes] = await Promise.all([
        groupService.getUserGroups(),
        walletService.getMyWallet()
      ])
      const activeGroups = (groupRes.data.groups || []).filter(
        g => g.status === 'active' || g.status === 'pending'
      )
      setGroups(activeGroups)
      setWalletData(walletRes.data.wallet)
    } catch (err) {
      setError('Failed to load payment options')
    } finally {
      setLoading(false)
    }
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setPaymentStep('paymentDetails')
    setError(null)
  }

  // Determine if it's the current user's turn for a group
  const isMyTurn = (group) => {
    if (!user || !group.membersList) return false
    const member = group.membersList.find(
      m => (m.userId?._id || m.userId)?.toString() === user._id?.toString()
    )
    return member?.status === 'current'
  }

  // Determine if user is the payout recipient (status === 'current' means they receive payout this round)
  const isPayoutRecipient = (group) => isMyTurn(group)

  const handleClaimPayout = async (group) => {
    if (!group) return
    setProcessing(true)
    setError(null)
    try {
      const response = await api.post('/transactions/payout', { groupId: group._id })
      setSelectedGroup(group)
      setSuccessData({
        transaction: response.data.transaction,
        updatedWallet: response.data.wallet,
        isPayout: true
      })
      setPaymentStep('paymentSuccess')
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to claim payout')
    } finally {
      setProcessing(false)
    }
  }

  const handleWalletPayment = async () => {
    if (!selectedGroup) return
    setProcessing(true)
    setError(null)
    try {
      const response = await api.post('/transactions/contribution/wallet', {
        groupId: selectedGroup._id,
        amount: selectedGroup.contributionAmount
      })
      setSuccessData({
        transaction: response.data.transaction,
        updatedWallet: response.data.wallet,
        updatedGroup: response.data.group
      })
      setPaymentStep('paymentSuccess')
    } catch (err) {
      setError(err.message || 'Wallet payment failed')
    } finally {
      setProcessing(false)
    }
  }

  const initiateCardPayment = () => {
    if (!selectedGroup || !user) return
    setProcessing(true)
    setError(null)
    const reference = `AJO-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
      email: user.email,
      amount: selectedGroup.contributionAmount * 100,
      currency: 'NGN',
      ref: reference,
      onClose: () => { setProcessing(false) },
      callback: (response) => { verifyCardPayment(response.reference) }
    })
    handler.openIframe()
  }

  const verifyCardPayment = async (reference) => {
    try {
      setProcessing(true)
      const response = await api.post('/transactions/contribution', {
        groupId: selectedGroup._id,
        reference,
        amount: selectedGroup.contributionAmount
      })
      setSuccessData({
        transaction: response.data.transaction,
        updatedWallet: response.data.wallet,
        updatedGroup: response.data.group
      })
      setPaymentStep('paymentSuccess')
    } catch (err) {
      setError(err.message || 'Payment verification failed')
    } finally {
      setProcessing(false)
    }
  }

  const handlePay = () => {
    if (paymentMethod === 'wallet') {
      handleWalletPayment()
    } else {
      initiateCardPayment()
    }
  }

  const availableBalance = walletData?.availableBalance ?? 0
  const contributionAmount = selectedGroup?.contributionAmount ?? 0
  const hasEnoughBalance = availableBalance >= contributionAmount
  const myTurn = selectedGroup ? isMyTurn(selectedGroup) : true
  const canPay = !!selectedGroup && !processing && myTurn &&
    (paymentMethod === 'wallet' ? hasEnoughBalance : true)

  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading payment options..." />
      </div>
    )
  }

  // ── Select Group ────────────────────────────────────────────────────────────
  const renderSelectGroup = () => (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-deepBlue-600 hover:text-deepBlue-800">
            <ArrowLeft className="w-5 h-5 mr-2" /><span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">Make Contribution</h1>
          <div className="w-20" />
        </div>

        {/* Wallet balance */}
        <div className="bg-deepBlue-600 text-white rounded-2xl p-4 mb-6">
          <p className="text-blue-100 text-sm mb-1">Wallet Balance</p>
          <p className="text-2xl font-bold">₦{availableBalance.toLocaleString()}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {groups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-deepBlue-100">
            <Users className="w-16 h-16 text-deepBlue-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-deepBlue-800 mb-2">No Active Groups</h3>
            <p className="text-deepBlue-600 mb-6">You don't have any active groups requiring contributions</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-deepBlue-800 mb-2">Select Group to Contribute</h2>
            {groups.map(group => {
              const isDue = group.nextContribution && new Date(group.nextContribution) <= new Date()
              const myTurnForGroup = isMyTurn(group)
              return (
                <div key={group._id} onClick={() => handleGroupSelect(group)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-deepBlue-100 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-deepBlue-800">{group.name}</h3>
                        {isDue && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">Due Now</span>
                        )}
                        {myTurnForGroup ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">Your Turn</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Not Your Turn</span>
                        )}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{group.status.charAt(0).toUpperCase() + group.status.slice(1)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-deepBlue-800">₦{group.contributionAmount.toLocaleString()}</p>
                      <p className="text-xs text-deepBlue-600">{group.frequency}</p>
                    </div>
                  </div>
                  {group.nextContribution && (
                    <div className="flex items-center gap-1 text-sm text-deepBlue-600">
                      <Calendar className="w-4 h-4" />
                      <span className={isDue ? 'text-red-600 font-medium' : ''}>
                        {new Date(group.nextContribution).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {myTurnForGroup && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClaimPayout(group) }}
                      disabled={processing}
                      className="w-full mt-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold text-sm transition disabled:opacity-50"
                    >
                      <Gift className="w-4 h-4" />
                      Claim Payout — ₦{(group.contributionAmount * group.maxMembers).toLocaleString()}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  // ── Payment Details ─────────────────────────────────────────────────────────
  const renderPaymentDetails = () => (
    <div className="min-h-screen bg-deepBlue-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setPaymentStep('selectGroup')} disabled={processing}
            className="flex items-center text-deepBlue-600 hover:text-deepBlue-800">
            <ArrowLeft className="w-5 h-5 mr-2" /><span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-deepBlue-800">Payment Details</h1>
          <div className="w-20" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}



        {/* Turn indicator */}
        {!myTurn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-800 text-sm font-medium">It is not your turn to contribute to this group yet. Please wait for your turn.</p>
          </div>
        )}

        {/* Payment method toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPaymentMethod('wallet')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${
                paymentMethod === 'wallet' ? 'border-deepBlue-600 bg-deepBlue-50' : 'border-deepBlue-200'
              }`}>
              <Wallet className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-deepBlue-600' : 'text-deepBlue-400'}`} />
              <span className={`text-sm font-semibold ${paymentMethod === 'wallet' ? 'text-deepBlue-800' : 'text-deepBlue-500'}`}>Wallet</span>
              <span className="text-xs text-deepBlue-500">₦{availableBalance.toLocaleString()}</span>
            </button>
            <button onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${
                paymentMethod === 'card' ? 'border-deepBlue-600 bg-deepBlue-50' : 'border-deepBlue-200'
              }`}>
              <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-deepBlue-600' : 'text-deepBlue-400'}`} />
              <span className={`text-sm font-semibold ${paymentMethod === 'card' ? 'text-deepBlue-800' : 'text-deepBlue-500'}`}>Card (Paystack)</span>
              <span className="text-xs text-deepBlue-500">Secured</span>
            </button>
          </div>
          {paymentMethod === 'wallet' && !hasEnoughBalance && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              Insufficient balance. Available: ₦{availableBalance.toLocaleString()}, Required: ₦{contributionAmount.toLocaleString()}
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-deepBlue-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-deepBlue-800 mb-4">Payment Summary</h2>
          <div className="space-y-3">
            {[
              ['Group', selectedGroup?.name],
              ['Amount', `₦${selectedGroup?.contributionAmount.toLocaleString()}`],
              ['Method', paymentMethod === 'wallet' ? 'Wallet Balance' : 'Card (Paystack)'],
              ...(paymentMethod === 'wallet' ? [['Balance after', `₦${(availableBalance - contributionAmount).toLocaleString()}`]] : [])
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-deepBlue-100 last:border-0">
                <span className="text-deepBlue-600">{label}</span>
                <span className="font-semibold text-deepBlue-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handlePay} disabled={!canPay}
          className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition ${
            canPay ? 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}>
          {processing ? <><LoadingSpinner size="sm" text="" /><span>Processing...</span></> : (
            <><CreditCard className="w-5 h-5" /><span>Pay ₦{selectedGroup?.contributionAmount.toLocaleString()}</span></>
          )}
        </button>
        {paymentMethod === 'card' && (
          <p className="text-center text-sm text-deepBlue-500 mt-4 flex items-center justify-center gap-1">
            <Shield className="w-4 h-4" /> Secured by Paystack
          </p>
        )}
      </div>
    </div>
  )

  // ── Success ─────────────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center px-4 pb-20">
      <div className="bg-white rounded-2xl shadow-lg border border-deepBlue-100 p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-deepBlue-800 mb-2">
            {successData?.isPayout ? 'Payout Received!' : 'Payment Successful!'}
          </h2>
          <p className="text-deepBlue-600">
            {successData?.isPayout
              ? `Your payout from ${selectedGroup?.name} has been credited to your wallet.`
              : `Your contribution to ${selectedGroup?.name} has been processed.`}
          </p>
        </div>
        {successData?.transaction && (
          <div className="bg-deepBlue-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-deepBlue-600">Transaction ID</span><span className="font-medium">{successData.transaction.transactionId}</span></div>
            <div className="flex justify-between"><span className="text-deepBlue-600">Amount</span><span className="font-medium">₦{successData.transaction.amount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-deepBlue-600">Status</span><span className="font-medium text-green-600">Completed</span></div>
          </div>
        )}
        <div className="space-y-3">
          <button onClick={() => navigate('/dashboard')} className="w-full bg-deepBlue-600 text-white py-3 rounded-xl font-semibold hover:bg-deepBlue-700">Back to Dashboard</button>
          <button onClick={() => { setSelectedGroup(null); setPaymentStep('selectGroup'); setSuccessData(null); setError(null); fetchData() }}
            className="w-full border-2 border-deepBlue-600 text-deepBlue-600 py-3 rounded-xl font-semibold hover:bg-deepBlue-50">
            Make Another Payment
          </button>
        </div>
      </div>
    </div>
  )

  switch (paymentStep) {
    case 'paymentDetails': return renderPaymentDetails()
    case 'paymentSuccess': return renderSuccess()
    default: return renderSelectGroup()
  }
}

export default Payment
