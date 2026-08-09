import React from 'react';
import { CheckCircle, AlertCircle, Users, PauseCircle, ArrowRight } from 'lucide-react';

const typeConfig = {
  user_verified:       { icon: CheckCircle,  color: 'text-green-600',    bg: 'bg-green-50' },
  user_suspended:      { icon: PauseCircle,  color: 'text-red-600',      bg: 'bg-red-50' },
  user_activated:      { icon: CheckCircle,  color: 'text-green-600',    bg: 'bg-green-50' },
  kyc_approved:        { icon: CheckCircle,  color: 'text-blue-600',     bg: 'bg-blue-50' },
  kyc_rejected:        { icon: AlertCircle,  color: 'text-orange-600',   bg: 'bg-orange-50' },
  group_created:       { icon: Users,        color: 'text-deepBlue-600', bg: 'bg-deepBlue-50' },
  group_modified:      { icon: AlertCircle,  color: 'text-purple-600',   bg: 'bg-purple-50' },
};

export default function RecentActivityCard({ activities, onViewAll }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-deepBlue-600 hover:text-deepBlue-700 font-semibold transition flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No recent activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const cfg = typeConfig[activity.type] || typeConfig.group_created;
            const Icon = cfg.icon;
            return (
              <div
                key={activity._id || index}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                    {activity.adminName && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">by {activity.adminName}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
