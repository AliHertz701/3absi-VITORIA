// pages/AdminProducts.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductForm from '@/components/ProductForm';
import StockUpdateModal from '@/components/StockUpdateModal';
import ImageUploadModal from '@/components/ImageUploadModal';
import formatCurrency from '@/lib/utils';
import { useLocale } from '@/contexts/LocaleContext'; // Add this import

// API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const productApi = {
  // Get products list
  getProducts: async (params: any) => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  // Get product stats
  getStats: async () => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/stats/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Get categories
  getCategories: async () => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/categories/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Delete product
  deleteProduct: async (id: number) => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Toggle active status
  toggleActive: async (id: number) => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/toggle-active/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to toggle status');
    return response.json();
  },

  // Toggle featured
  toggleFeatured: async (id: number) => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/toggle-featured/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to toggle featured');
    return response.json();
  },

  // Update stock
  updateStock: async (id: number, quantity: number) => {
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;
    
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/update-stock/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    
    if (!response.ok) throw new Error('Failed to update stock');
    return response.json();
  },
};

export default function AdminProducts() {
  const { t, locale } = useLocale(); // Add localization
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    category: '',
    featured: '',
    new_arrival: '',
    sort_by: '-created_at',
  });

  // Fetch products with caching
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
    staleTime: 60000, // 1 minute
    cacheTime: 300000, // 5 minutes
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['productStats'],
    queryFn: productApi.getStats,
    staleTime: 30000, // 30 seconds
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
    staleTime: 300000, // 5 minutes
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });
      toast.success(t('admin.products.delete_success'));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: productApi.toggleActive,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: productApi.toggleFeatured,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      productApi.updateStock(id, quantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });
      toast.success(data.message);
      setShowStockModal(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: any) => {
    if (window.confirm(`${t('admin.products.confirm_delete')} "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const handleToggleActive = (product: any) => {
    toggleActiveMutation.mutate(product.id);
  };

  const handleToggleFeatured = (product: any) => {
    toggleFeaturedMutation.mutate(product.id);
  };

  const handleStockUpdate = (product: any) => {
    setSelectedProduct(product);
    setShowStockModal(true);
  };

  const handleImageUpload = (product: any) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  const handleSubmitStock = (quantity: number) => {
    if (selectedProduct) {
      updateStockMutation.mutate({ id: selectedProduct.id, quantity });
    }
  };

  // Reset form
  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Refresh data
  const handleRefresh = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['productStats'] });
    toast.success(t('admin.products.refresh_success'));
  };

  // Fix data extraction - Access the correct response structure
  const stats = statsData?.stats || {};
  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};
  const categories = categoriesData?.categories || [];

  console.log('Debug - Products Data:', productsData);
  console.log('Debug - Products:', products);
  console.log('Debug - Stats:', statsData);
  console.log('Debug - Categories:', categoriesData);

  if (isLoading && !productsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('general.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t('admin.products.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('admin.products.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('admin.products.refresh')}
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.products.add_product')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.products.total_products')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_products || 0}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.products.active')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_products || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.products.low_stock')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.low_stock || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.products.out_of_stock')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.out_of_stock || 0}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.products.featured')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featured_products || 0}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('admin.products.new_arrivals')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new_arrivals || 0}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder={t('admin.products.search_placeholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Status Filter */}
            <Select
            value={filters.status || "all_status"}
            onValueChange={(value) => handleFilterChange('status', value === "all_status" ? "" : value)}
            >
            <SelectTrigger>
                <SelectValue placeholder={t('admin.products.status')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all_status">{t('admin.products.all_status')}</SelectItem>
                <SelectItem value="active">{t('admin.products.active')}</SelectItem>
                <SelectItem value="inactive">{t('admin.products.inactive')}</SelectItem>
                <SelectItem value="low_stock">{t('admin.products.low_stock')}</SelectItem>
                <SelectItem value="out_of_stock">{t('admin.products.out_of_stock')}</SelectItem>
            </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
            value={filters.category || "all_categories"}
            onValueChange={(value) => handleFilterChange('category', value === "all_categories" ? "" : value)}
            >
            <SelectTrigger>
                <SelectValue placeholder={t('admin.products.category')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all_categories">{t('admin.products.all_categories')}</SelectItem>
                {categories.map((category: any) => (
                <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>

            {/* Sort By Filter */}
            <Select
            value={filters.sort_by || "default_sort"}
            onValueChange={(value) => handleFilterChange('sort_by', value === "default_sort" ? "" : value)}
            >
            <SelectTrigger>
                <SelectValue placeholder={t('admin.products.sort_by')} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="default_sort">{t('admin.products.sort_by')}</SelectItem>
                <SelectItem value="-created_at">{t('admin.products.newest_first')}</SelectItem>
                <SelectItem value="created_at">{t('admin.products.oldest_first')}</SelectItem>
                <SelectItem value="name">{t('admin.products.name_az')}</SelectItem>
                <SelectItem value="-name">{t('admin.products.name_za')}</SelectItem>
                <SelectItem value="price">{t('admin.products.price_low_high')}</SelectItem>
                <SelectItem value="-price">{t('admin.products.price_high_low')}</SelectItem>
                <SelectItem value="quantity_available">{t('admin.products.stock_low_high')}</SelectItem>
                <SelectItem value="-quantity_available">{t('admin.products.stock_high_low')}</SelectItem>
            </SelectContent>
            </Select>

          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge
              variant={filters.featured === 'true' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleFilterChange('featured', filters.featured === 'true' ? '' : 'true')}
            >
              <Star className="w-3 h-3 mr-1" />
              {t('admin.products.featured')}
            </Badge>
            <Badge
              variant={filters.new_arrival === 'true' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleFilterChange('new_arrival', filters.new_arrival === 'true' ? '' : 'true')}
            >
              <Package className="w-3 h-3 mr-1" />
              {t('admin.products.new_arrivals')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.products.products')}</CardTitle>
          <CardDescription>
            {t('admin.products.showing_products', { 
              count: products.length, 
              total: pagination.total || 0 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">{t('admin.products.load_error')}</p>
              <Button onClick={() => refetch()} variant="outline" className="mt-4">
                {t('admin.products.retry')}
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{t('admin.products.no_products')}</p>
              <Button onClick={() => setShowForm(true)} variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.products.add_first_product')}
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">{t('admin.products.product')}</th>
                      <th className="text-left py-3 px-4">{t('admin.products.category')}</th>
                      <th className="text-left py-3 px-4">{t('admin.products.price')}</th>
                      <th className="text-left py-3 px-4">{t('admin.products.stock')}</th>
                      <th className="text-left py-3 px-4">{t('admin.products.status')}</th>
                      <th className="text-left py-3 px-4">{t('admin.products.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {product.main_image ? (
                              <img
                                src={product.main_image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.sku || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {product.category?.name || t('admin.products.uncategorized')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {product.show_price !== false ? (
                            <>
                              {product.discount_percentage > 0 ? (
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {formatCurrency(product.discounted_price || product.price)}
                                  </p>
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatCurrency(product.price)}
                                  </p>
                                </div>
                              ) : (
                                <p className="font-medium text-gray-900">
                                  {formatCurrency(product.price || 0)}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500">{t('admin.products.price_hidden')}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${
                              product.quantity_available === 0
                                ? 'text-red-600'
                                : product.quantity_available <= 10
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}>
                              {product.quantity_available}
                            </span>
                            {product.quantity_available <= 10 && product.quantity_available > 0 && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                {t('admin.products.low')}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant={product.is_active ? 'default' : 'outline'}
                              className={product.is_active ? 'bg-green-100 text-green-800' : ''}
                            >
                              {product.is_active ? t('admin.products.active') : t('admin.products.inactive')}
                            </Badge>
                            {product.is_featured && (
                              <Badge variant="outline" className="text-purple-600 border-purple-200">
                                <Star className="w-3 h-3 mr-1" />
                                {t('admin.products.featured')}
                              </Badge>
                            )}
                            {product.is_new_arrival && (
                              <Badge variant="outline" className="text-blue-600 border-blue-200">
                                {t('admin.products.new')}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  {t('admin.products.actions')}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={locale === 'ar' ? 'start' : 'end'}>
                                <DropdownMenuLabel>{t('admin.products.actions')}</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {t('admin.products.edit')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleActive(product)}>
                                  {product.is_active ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      {t('admin.products.deactivate')}
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      {t('admin.products.activate')}
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                                  <Star className="w-4 h-4 mr-2" />
                                  {product.is_featured 
                                    ? t('admin.products.remove_featured')
                                    : t('admin.products.add_featured')
                                  }
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStockUpdate(product)}>
                                  <Package className="w-4 h-4 mr-2" />
                                  {t('admin.products.update_stock')}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleImageUpload(product)}>
                                  <Upload className="w-4 h-4 mr-2" />
                                  {t('admin.products.upload_images')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(product)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t('admin.products.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    {t('admin.products.page_info', {
                      current: pagination.current_page,
                      total: pagination.pages
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={!pagination.has_previous}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('admin.products.previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={!pagination.has_next}
                    >
                      {t('admin.products.next')}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={handleFormClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['productStats'] });
            setShowForm(false);
            setEditingProduct(null);
            toast.success(
              editingProduct 
                ? t('admin.products.update_success')
                : t('admin.products.create_success')
            );
          }}
        />
      )}

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onClose={() => setShowStockModal(false)}
          onSubmit={handleSubmitStock}
          isLoading={updateStockMutation.isPending}
        />
      )}

      {/* Image Upload Modal */}
      {showImageModal && selectedProduct && (
        <ImageUploadModal
          product={selectedProduct}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
}