// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  getAvailableDates: () => api.get('/available-dates'),
};

export const waitlistAPI = {
  create: (data: any) => api.post('/waitlist', data),
};

export const contactAPI = {
  send: (data: any) => api.post('/contact', data),
};

export const adminAPI = {
  login: (data: any) => api.post('/admin/login', data),
  logout: () => api.post('/admin/logout'),
  getStats: () => api.get('/admin/stats'),
  getBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id: number, status: string) => api.put(`/admin/bookings/${id}/status`, { status }),
  getMessages: () => api.get('/admin/messages'),
  markMessageRead: (id: number) => api.put(`/admin/messages/${id}/read`),
  getWaitlist: () => api.get('/admin/waitlist'),
};

export default api;