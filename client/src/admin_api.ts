// admin/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with interceptors
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
adminApi.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const adminApiService = {
  // Authentication
  login: (credentials: { username: string; password: string }) =>
    adminApi.post('/admin/login/', credentials),

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  // Dashboard
  getDashboardStats: () => adminApi.get('/dashboard/stats/'),

  // Products
  getProducts: (params?: any) => adminApi.get('/products/', { params }),
  getProduct: (id: number) => adminApi.get(`/products/${id}/`),
  createProduct: (data: FormData) => adminApi.post('/products/', data),
  updateProduct: (id: number, data: FormData) => adminApi.put(`/products/${id}/`, data),
  deleteProduct: (id: number) => adminApi.delete(`/products/${id}/`),
  uploadProductImages: (productId: number, data: FormData) =>
    adminApi.post(`/products/${productId}/upload_images/`, data),

  // Categories
  getCategories: () => adminApi.get('/categories/'),
  createCategory: (data: FormData) => adminApi.post('/categories/', data),
  updateCategory: (id: number, data: FormData) => adminApi.put(`/categories/${id}/`, data),
  deleteCategory: (id: number) => adminApi.delete(`/categories/${id}/`),

  // Branches
  getBranches: () => adminApi.get('/branches/'),
  createBranch: (data: any) => adminApi.post('/branches/', data),
  updateBranch: (id: number, data: any) => adminApi.put(`/branches/${id}/`, data),
  deleteBranch: (id: number) => adminApi.delete(`/branches/${id}/`),

  // Banners
  getBanners: () => adminApi.get('/banners/'),
  createBanner: (data: FormData) => adminApi.post('/banners/', data),
  updateBanner: (id: number, data: FormData) => adminApi.put(`/banners/${id}/`, data),
  deleteBanner: (id: number) => adminApi.delete(`/banners/${id}/`),

  // Cities
  getCities: () => adminApi.get('/cities/'),
  createCity: (data: any) => adminApi.post('/cities/', data),
  updateCity: (id: number, data: any) => adminApi.put(`/cities/${id}/`, data),
  deleteCity: (id: number) => adminApi.delete(`/cities/${id}/`),

  // Invoices/Orders
  getInvoices: (params?: any) => adminApi.get('/invoices/', { params }),
  getInvoice: (id: number) => adminApi.get(`/invoices/${id}/`),
  updateInvoiceStatus: (id: number, status: string) =>
    adminApi.patch(`/invoices/${id}/`, { status }),
  getOrderStats: () => adminApi.get('/invoices/stats/'),

  // Contact Messages
  getMessages: () => adminApi.get('/contact-messages/'),
  deleteMessage: (id: number) => adminApi.delete(`/contact-messages/${id}/`),

  // Users
  getUsers: () => adminApi.get('/users/'),
  updateUser: (id: number, data: any) => adminApi.put(`/users/${id}/`, data),

  // File Upload
  uploadFile: (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return adminApi.post('/upload/', formData);
  },

  // Top Products
  getTopProducts: () => adminApi.get('/products/top_products/'),
};

export default adminApiService;