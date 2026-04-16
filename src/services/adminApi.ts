// src/services/adminApi.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor pour le token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Si c'est FormData, laissez axios définir le Content-Type automatiquement
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Interceptor pour les erreurs
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 422) {
      console.error('Validation errors:', error.response.data.errors);
    } else if (error.response?.status === 401) {
      console.error('Unauthorized - Please login again');
      // Optionnel: rediriger vers la page de login
      // window.location.href = '/admin/login';
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// ==================== TYPES ====================

export interface Booking {
  id: number;
  bitch_reg_name: string;
  owner_name: string;
  email: string;
  phone: string;
  booking_date: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WaitlistEntry {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
}

export interface News {
  id: number;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  image: string | null;
  type: 'event' | 'achievement' | 'announcement';
  event_date: string | null;
  location: string | null;
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  price: number | null;
  currency: string;
  image: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dog {
  id: number;
  name: string;
  role: 'male' | 'female';
  role_label: string;
  description_en: string;
  description_fr: string;
  image: string;
  age: string;
  color: string;
  weight: string;
  registration: string;
  achievements: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  total_messages: number;
  unread_messages: number;
  total_waitlist: number;
  total_news: number;
  total_products: number;
  recent_bookings: Booking[];
  recent_messages: ContactMessage[];
}

export interface Settings {
  site_name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
}

export interface GalleryItem {
  id: number;
  title_en: string | null;
  title_fr: string | null;
  image: string;
  category: 'puppies' | 'dogs' | 'events';
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== API FUNCTIONS ====================

export const adminAPI = {
  // Auth
  login: (data: { email: string; password: string }) => 
    adminApi.post<{ success: boolean; token: string; admin: any }>('/admin/login', data),
  
  logout: () => adminApi.post('/admin/logout'),
  
  getMe: () => adminApi.get('/admin/me'),
  
  // Dashboard
  getStats: () => adminApi.get<DashboardStats>('/admin/stats'),
  
  // Bookings
  getBookings: (params?: { status?: string; start_date?: string; end_date?: string }) => 
    adminApi.get<Booking[]>('/admin/bookings', { params }),
  
  getBooking: (id: number) => adminApi.get<Booking>(`/admin/bookings/${id}`),
  
  updateBookingStatus: (id: number, status: string) => 
    adminApi.put<Booking>(`/admin/bookings/${id}/status`, { status }),
  
  deleteBooking: (id: number) => adminApi.delete(`/admin/bookings/${id}`),
  
  // Messages
  getMessages: (params?: { unread_only?: boolean }) => 
    adminApi.get<ContactMessage[]>('/admin/messages', { params }),
  
  getMessage: (id: number) => adminApi.get<ContactMessage>(`/admin/messages/${id}`),
  
  markMessageRead: (id: number) => adminApi.put<ContactMessage>(`/admin/messages/${id}/read`),
  
  deleteMessage: (id: number) => adminApi.delete(`/admin/messages/${id}`),
  
  // Waitlist
  getWaitlist: () => adminApi.get<WaitlistEntry[]>('/admin/waitlist'),
  
  deleteWaitlistEntry: (id: number) => adminApi.delete(`/admin/waitlist/${id}`),
  
  // News
  getNews: () => adminApi.get<News[]>('/admin/news'),
  
  getNewsItem: (id: number) => adminApi.get<News>(`/admin/news/${id}`),
  
  createNews: (data: FormData) => adminApi.post<News>('/admin/news', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  updateNews: (id: number, data: FormData) => adminApi.post<News>(`/admin/news/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  deleteNews: (id: number) => adminApi.delete(`/admin/news/${id}`),
  
  // Products
  getProducts: () => adminApi.get<Product[]>('/admin/products'),
  
  getProduct: (id: number) => adminApi.get<Product>(`/admin/products/${id}`),
  
  createProduct: (data: FormData) => adminApi.post<Product>('/admin/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  updateProduct: (id: number, data: FormData) => adminApi.post<Product>(`/admin/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  deleteProduct: (id: number) => adminApi.delete(`/admin/products/${id}`),
  
  // Kennel/Dogs
  getDogs: () => adminApi.get<Dog[]>('/admin/dogs'),
  
  getDog: (id: number) => adminApi.get<Dog>(`/admin/dogs/${id}`),
  
  createDog: (data: FormData) => adminApi.post<Dog>('/admin/dogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  updateDog: (id: number, data: FormData) => adminApi.post<Dog>(`/admin/dogs/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  deleteDog: (id: number) => adminApi.delete(`/admin/dogs/${id}`),
  
  // Settings
  getSettings: () => adminApi.get<Settings>('/admin/settings'),
  
  updateSettings: (data: Partial<Settings>) => adminApi.post('/admin/settings', data),

  getGallery: () => adminApi.get<GalleryItem[]>('/admin/gallery'),
getGalleryItem: (id: number) => adminApi.get<GalleryItem>(`/admin/gallery/${id}`),
createGallery: (data: FormData) => adminApi.post<GalleryItem>('/admin/gallery', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
}),
updateGallery: (id: number, data: FormData) => adminApi.post<GalleryItem>(`/admin/gallery/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
}),
deleteGallery: (id: number) => adminApi.delete(`/admin/gallery/${id}`),
};



export default adminApi;