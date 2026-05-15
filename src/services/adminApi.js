import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://13.62.104.99/api';

console.log('🔗 Admin Panel API URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard APIs
export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getRevenueChart = (period = 'week') => api.get(`/admin/dashboard/revenue-chart?period=${period}`);
export const getRecentActivity = () => api.get('/admin/dashboard/recent-activity');

// Lawyer Management APIs
export const getAllLawyers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/admin/lawyers${query ? `?${query}` : ''}`);
};
export const getLawyerDetails = (id) => api.get(`/admin/lawyers/${id}`);
export const getLawyerDocuments = (id) => api.get(`/admin/lawyers/${id}/documents`);
export const verifyDocument = (documentId, status, rejection_reason) => api.put(`/admin/documents/${documentId}/verify`, { status, rejection_reason });
export const verifyLawyer = (id, status, reason) => api.put(`/admin/lawyers/${id}/verify`, { status, reason });
export const blockLawyer = (id, is_active, reason) => api.put(`/admin/lawyers/${id}/block`, { is_active, reason });
export const deleteLawyer = (id) => api.delete(`/admin/lawyers/${id}`);
export const getLawyerOrders = (id) => api.get(`/admin/lawyers/${id}/orders`);
export const getLawyerEarnings = (id) => api.get(`/admin/lawyers/${id}/earnings`);
export const getPendingLawyers = () => api.get('/admin/lawyers/pending');

// Client Management APIs
export const getAllClients = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/admin/clients${query ? `?${query}` : ''}`);
};
export const getClientDetails = (id) => api.get(`/admin/clients/${id}`);
export const blockClient = (id, is_active) => api.put(`/admin/clients/${id}/block`, { is_active });
export const deleteClient = (id) => api.delete(`/admin/clients/${id}`);

// Order Management APIs
export const getAllOrders = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/admin/orders${query ? `?${query}` : ''}`);
};
export const getOrderDetails = (id) => api.get(`/admin/orders/${id}`);

// Payment Management APIs
export const getAllPayments = () => api.get('/admin/payments');
export const getPlatformEarnings = (period = 'all') => api.get(`/admin/payments/earnings?period=${period}`);

// Payout Account APIs
export const getAllPayoutAccounts = () => api.get('/admin/payout-accounts');
export const verifyPayoutAccount = (id, status) => api.put(`/admin/payout-accounts/${id}/verify`, { status });

// Auth APIs
export const adminLogin = (email, password) => api.post('/auth/admin/login', { email, password });
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  return Promise.resolve();
};

export default api;
