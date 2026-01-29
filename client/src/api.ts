const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").trim().replace(/\/+$/, '');
const API_URL = `${BASE_URL}/api`;
const MEDIA_BASE = (import.meta.env.VITE_MEDIA_URL || BASE_URL).trim().replace(/\/+$/, '');
import axios from 'axios';
// ================= PRODUCTS =================
export interface Product {
  id: number;
  name: string;
  description: string;
  price?: number;                     // Original price, e.g., 21.0
  discount_percentage?: number;       // e.g., 2.0
  discounted_price?: number;          // Calculated price after discount
  category?: string;                  // Category name
  category_slug?: string;             // Category slug
  image?: string;                     // Main image URL/path
  additional_images?: string[];       // Any other images (if available)
  video?: string;                     // Product video URL/path
  in_stock?: boolean;                 // True if product is available to order
  stock_quantity?: number;            // Quantity available (if visible)
  can_order?: boolean;                // True if orders can be placed
  show_price?: boolean;               // Show price on frontend
  show_quantity?: boolean;            // Show quantity on frontend
  isFeatured?: boolean;               // Featured product flag
  is_new_arrival?: boolean;           // New arrival flag
  is_active?: boolean;                // Product active status
  sku?: string;                       // Stock keeping unit
  sizes?: string[];                   // Available sizes, e.g., ["S", "M", "L"]
  material?: string;                  // Material, e.g., "Cotton"
  season?: string;                    // Season/collection, e.g., "Summer 2026"
  gender?: 'male' | 'female' | 'unisex'; // Gender
  brand?: string;                     // Brand name
  care_instructions?: string;         // Care instructions
  era?: string;                       // Historical era, e.g., "1920s" (optional)
  color?: string[];                   // Available colors
}
export interface AdminBanner {
  id?: number;
  title: string;
  subtitle?: string;
  image?: File | string;
  button_text?: string;
  button_link?: string;
  text_color?: string;
  order?: number;
  is_active?: boolean;
  video?: File | string;
}

export interface ContactFormData {
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
  error?: string;
}

// ================= HOME =================
export interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface HomeData {
  banners: Banner[];
  featured_products: Product[];
  new_arrivals: Product[];
  categories: Category[];
}

// ================= FETCHERS =================
export async function fetchHome(): Promise<HomeData> {
  const res = await fetch(`${API_URL}/home-data/`);
  if (!res.ok) throw new Error("Failed to fetch home data");
  return res.json();
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}/`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export function resolveMediaUrl(path?: string | number | object | null | any): string {
  // Handle null, undefined, or empty values
  if (!path) return "";
  
  // Log for debugging (remove in production)
  if (typeof path !== 'string') {
    console.warn('resolveMediaUrl received non-string path:', path, 'Type:', typeof path);
  }
  
  // Convert numbers to strings
  if (typeof path === 'number') {
    return `${MEDIA_BASE}${path}`;
  }
  
  // Handle objects (in case API returns {url: "..."} or similar)
  if (typeof path === 'object') {
    // If it's an object with a url property, use that
    if (path && 'url' in path && typeof path.url === 'string') {
      return resolveMediaUrl(path.url);
    }
    // If it has a src property (common image object pattern)
    if (path && 'src' in path && typeof path.src === 'string') {
      return resolveMediaUrl(path.src);
    }
    // Try to convert to string as last resort
    const stringified = String(path);
    if (stringified === '[object Object]') {
      return "";
    }
    return resolveMediaUrl(stringified);
  }
  
  // Ensure it's a string before calling string methods
  const strPath = String(path).trim();
  
  if (!strPath) return "";
  
  // Check if it's already a full URL
  if (strPath.startsWith("http://") || strPath.startsWith("https://")) {
    return strPath;
  }
  
  // Check if it's a data URL
  if (strPath.startsWith("data:")) {
    return strPath;
  }
  
  // Prepend media base
  return `${MEDIA_BASE}${strPath}`;
}

export const contactApi = {
  sendMessage: async (formData: ContactFormData): Promise<ContactResponse> => {
    try {
      const response = await fetch(`${API_URL}/contact/message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone_number: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending contact message:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send message',
      };
    }
  },
};
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_tokens');
  const access = token ? JSON.parse(token).access : null;
  return access ? { Authorization: `Bearer ${access}` } : {};
};
export interface DashboardStats {
  total_orders: number;
  total_products: number;
  total_revenue: number;
  total_categories: number;
  total_branches: number;
  low_stock_products: number;
  pending_orders?: number;
  completed_orders?: number;
  average_order_value?: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  branch?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  sold_quantity: number;
  revenue: number;
  stock_quantity: number;
  image?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  message?: string;
  errors?: Record<string, string[]>;
}

// ================= ADMIN API =================
export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/admin/dashboard/stats/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  

  // Recent Orders
  getInvoices: async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<Order>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);

      const url = `${API_URL}/admin/orders/?${queryParams.toString()}`;
      const response = await fetchWithAuth(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Top Products
  getTopProducts: async (params?: {
    limit?: number;
    period?: 'day' | 'week' | 'month' | 'year';
  }): Promise<TopProduct[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.period) queryParams.append('period', params.period);

      const url = `${API_URL}/admin/products/top/?${queryParams.toString()}`;
      const response = await fetchWithAuth(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch top products: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },
  getBanners: async (): Promise<AdminBanner[]> => {
    const { data } = await axios.get(`${API_URL}/admin/banners/`, {
      headers: getAuthHeader(),
    });
    return data;
  },
  createBanner: async (formData: FormData): Promise<AdminBanner> => {
    const { data } = await axios.post(`${API_URL}/admin/banners/`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  updateBanner: async (formData: FormData): Promise<AdminBanner> => {
    const { data } = await axios.put(`${API_URL}/admin/banners/`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  deleteBanner: async (id: number): Promise<{ success: boolean }> => {
    const { data } = await axios.delete(`${API_URL}/admin/banners/`, {
      headers: getAuthHeader(),
      data: { id },
    });
    return data;
  },

  getCategories: async (): Promise<any[]> => {
    const { data } = await axios.get(`${API_URL}/admin/categories/`, { headers: getAuthHeader() });
    return data;
  },
  createCategory: async (formData: FormData): Promise<any> => {
    const { data } = await axios.post(`${API_URL}/admin/categories/`, formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  updateCategory: async (formData: FormData): Promise<any> => {
    const { data } = await axios.put(`${API_URL}/admin/categories/`, formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  deleteCategory: async (id: number): Promise<{ success: boolean }> => {
    const { data } = await axios.delete(`${API_URL}/admin/categories/`, {
      headers: getAuthHeader(),
      data: { id },
    });
    return data;
  },
   getAnalytics: async () => {
    const response = await fetch(`${API_URL}/admin/analytics/`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  },

  updateWaInfo: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/admin/wa-info/${id}/update/`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update WA info');
    return await response.json();
  },
   createWaInfo: async (data: any) => {
    const response = await fetch(`${API_URL}/admin/wa-info/create/`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create WA info');
    return await response.json();
  },
  getBranches: async () => {
    const response = await fetch(`${API_URL}/admin/branches/`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch branches');
    return await response.json();
  },

  updateBranch: async (id: number, data: any) => {
    const response = await fetch(`${API_URL}/admin/branches/${id}/update/`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update branch');
    return await response.json();
  },

  createBranch: async (data: any) => {
    const response = await fetch(`${API_URL}/admin/branches/`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create branch');
    return await response.json();
  },

  deleteBranch: async (id: number) => {
    const response = await fetch(`${API_URL}/admin/branches/${id}/delete/`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to delete branch');
    return response.status === 204 ? {} : await response.json();
  },
   markMessageRead: async (id: number) => {
    const response = await fetch(`${API_URL}/admin/messages/${id}/read/`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to mark message as read');
    return await response.json();
  },
};

// ================= HELPER FUNCTIONS =================
export const formatCurrency = (amount: number): string => {
  return `LYD ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const api = {
  get: async (endpoint: string, options?: RequestInit): Promise<Response> => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options?.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        return api.get(endpoint, options); // Retry with new token
      }
      throw new Error('Authentication failed');
    }

    return response;
  },

  post: async (endpoint: string, data: any, options?: RequestInit): Promise<Response> => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        return api.post(endpoint, data, options);
      }
      throw new Error('Authentication failed');
    }

    return response;
  },
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Get token from localStorage
  const tokens = localStorage.getItem('auth_tokens');
  let accessToken = null;
  
  if (tokens) {
    try {
      const parsedTokens = JSON.parse(tokens);
      accessToken = parsedTokens.access;
    } catch (e) {
      console.error('Error parsing auth tokens:', e);
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 unauthorized
  if (response.status === 401) {
    // Try to refresh token
    const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
      // Get new token and retry
      const newTokens = localStorage.getItem('auth_tokens');
      if (newTokens) {
        const parsedTokens = JSON.parse(newTokens);
        const newHeaders = {
          ...headers,
          'Authorization': `Bearer ${parsedTokens.access}`,
        };
        
        response = await fetch(url, {
          ...options,
          headers: newHeaders,
        });
      }
    } else {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('auth_user');
      window.location.href = '/admin/login';
    }
  }

  return response;
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const tokens = localStorage.getItem('auth_tokens');
    if (!tokens) return false;

    const parsedTokens = JSON.parse(tokens);
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: parsedTokens.refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      parsedTokens.access = data.access;
      localStorage.setItem('auth_tokens', JSON.stringify(parsedTokens));
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  return false;
};