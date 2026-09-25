import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const complaintsAPI = {
  create: (data) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/my'),
  getAll: () => api.get('/complaints'),
  getById: (id) => api.get(`/complaints/${id}`),
  trackByComplaintId: (complaintId) => api.get(`/complaints/track/${complaintId}`),
  getTimeline: (id) => api.get(`/complaints/${id}/timeline`),
  assignWorker: (id, data) => api.put(`/complaints/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  submitFeedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
  getWorkerComplaints: () => api.get('/complaints/worker/my'),
  search: (query, page = 0, size = 10) => api.get(`/complaints/search?q=${query}&page=${page}&size=${size}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllComplaints: (search, page = 0, size = 20) => {
    let url = `/admin/complaints?page=${page}&size=${size}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return api.get(url);
  },
  getWorkers: () => api.get('/admin/workers'),
  getAuditLog: (complaintId) => api.get(`/admin/audit/${complaintId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export default api;
