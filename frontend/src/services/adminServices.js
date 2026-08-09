import { api } from './api';

/**
 * Admin Dashboard Services
 */

// Get dashboard statistics
export const getDashboardStats = async (period = 'today') => {
  const response = await api.get(`/admin/dashboard/stats?period=${period}`);
  return response.data;
};

// Get recent activities
export const getRecentActivities = async (limit = 20, offset = 0) => {
  const response = await api.get(`/admin/dashboard/activities?limit=${limit}&offset=${offset}`);
  return response.data;
};

// Get alerts
export const getAlerts = async (severity = null) => {
  const url = severity ? `/admin/dashboard/alerts?severity=${severity}` : '/admin/dashboard/alerts';
  const response = await api.get(url);
  return response.data;
};

// Dismiss alert
export const dismissAlert = async (alertId) => {
  const response = await api.post(`/admin/dashboard/alerts/${alertId}/dismiss`);
  return response.data;
};

/**
 * Admin User Management Services
 */

// Get paginated users list
export const getUsers = async (params = {}) => {
  const { search, kycStatus, accountStatus, sortBy, sortOrder, limit = 20, offset = 0 } = params;
  
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (kycStatus) queryParams.append('kycStatus', kycStatus);
  if (accountStatus) queryParams.append('accountStatus', accountStatus);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);
  queryParams.append('limit', limit);
  queryParams.append('offset', offset);
  
  const response = await api.get(`/admin/users?${queryParams.toString()}`);
  return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

// Suspend user
export const suspendUser = async (userId, reason) => {
  const response = await api.put(`/admin/users/${userId}/suspend`, { reason });
  return response.data;
};

// Activate user
export const activateUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/activate`);
  return response.data;
};

// Deactivate user
export const deactivateUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/deactivate`);
  return response.data;
};

// Approve KYC
export const approveKyc = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/kyc/approve`);
  return response.data;
};

// Reject KYC
export const rejectKyc = async (userId, reason) => {
  const response = await api.put(`/admin/users/${userId}/kyc/reject`, { reason });
  return response.data;
};

// Get pending KYC users
export const getPendingKyc = async (limit = 20, offset = 0) => {
  const response = await api.get(`/admin/users/kyc/pending?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Admin Group Management Services
 */

// Get paginated groups list
export const getGroups = async (params = {}) => {
  const { search, status, sortBy, sortOrder, limit = 20, offset = 0 } = params;
  
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);
  queryParams.append('limit', limit);
  queryParams.append('offset', offset);
  
  const response = await api.get(`/admin/groups?${queryParams.toString()}`);
  return response.data;
};

// Get group by ID
export const getGroupById = async (groupId) => {
  const response = await api.get(`/admin/groups/${groupId}`);
  return response.data;
};

// Update group status
export const updateGroupStatus = async (groupId, status) => {
  const response = await api.put(`/admin/groups/${groupId}/status`, { status });
  return response.data;
};

// Update group settings
export const updateGroupSettings = async (groupId, settings) => {
  const response = await api.put(`/admin/groups/${groupId}/settings`, settings);
  return response.data;
};

const adminServices = {
  // Dashboard
  getDashboardStats,
  getRecentActivities,
  getAlerts,
  dismissAlert,
  
  // Users
  getUsers,
  getUserById,
  suspendUser,
  activateUser,
  deactivateUser,
  approveKyc,
  rejectKyc,
  getPendingKyc,
  
  // Groups
  getGroups,
  getGroupById,
  updateGroupStatus,
  updateGroupSettings
};

export default adminServices;
