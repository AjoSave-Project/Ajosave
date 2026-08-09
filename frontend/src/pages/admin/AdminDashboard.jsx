import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminServices from '../../services/adminServices';
import StatCard from '../../components/admin/dashboard/StatCard';
import RecentActivityCard from '../../components/admin/dashboard/RecentActivityCard';
import AlertsCard from '../../components/admin/dashboard/AlertsCard';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const navigate = useNavigate();
  
  // Get admin info from localStorage
  const adminName = localStorage.getItem('adminName') || 'Admin User';

  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, activitiesResponse, alertsResponse] = await Promise.all([
        adminServices.getDashboardStats(timeRange),
        adminServices.getRecentActivities(10, 0),
        adminServices.getAlerts()
      ]);

      setStats(statsResponse.data);
      setActivities(activitiesResponse.data?.items || []);
      setAlerts(alertsResponse.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const handleDismissAlert = async (alertId) => {
    try {
      await adminServices.dismissAlert(alertId);
      setAlerts(alerts.filter(alert => alert._id !== alertId));
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-deepBlue-600 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Dashboard</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Welcome back, <span className="text-deepBlue-600 font-semibold">{adminName}</span>
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
          {['today', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition ${
                timeRange === range
                  ? 'bg-deepBlue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={null}
          color="blue"
        />
        <StatCard
          title="Active Groups"
          value={stats?.activeGroups || 0}
          icon={Activity}
          trend={null}
          color="green"
        />
        <StatCard
          title="Total Savings"
          value={`₦${(stats?.totalSavings || 0).toLocaleString()}`}
          icon={DollarSign}
          trend={null}
          color="purple"
        />
        <StatCard
          title="24h Transactions"
          value={stats?.transactionsCount24h || 0}
          icon={TrendingUp}
          trend={null}
          color="orange"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityCard
            activities={activities}
            onViewAll={() => navigate('/admin/audit-logs')}
          />
        </div>

        {/* Alerts */}
        <div>
          <AlertsCard
            alerts={alerts}
            onDismiss={handleDismissAlert}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 bg-deepBlue-50 hover:bg-deepBlue-100 rounded-lg transition text-left"
          >
            <Users className="w-6 h-6 text-deepBlue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
          </button>

          <button
            onClick={() => navigate('/admin/groups')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-left"
          >
            <Activity className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Groups</h3>
            <p className="text-sm text-gray-600 mt-1">Monitor and manage groups</p>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left"
          >
            <RefreshCw className="w-6 h-6 text-gray-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Refresh Data</h3>
            <p className="text-sm text-gray-600 mt-1">Update dashboard statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
}
