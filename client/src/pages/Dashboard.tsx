// admin/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Tag,
  MapPin,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  BarChart,
  Image,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { adminApi, formatCurrency, formatDate, getStatusColor, getPaymentStatusColor } from '../api';
import { DashboardStats, RecentOrders, TopProducts } from '../components/DashboardWidgets';
import { useLocation } from 'wouter';
import { useLocale } from '../contexts/LocaleContext';

// Dashboard Widgets Components (Simplified versions)
const RecentOrdersWidget = ({ orders }: { orders: any[] }) => {
  const { t } = useLocale();
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.widgets.recent_orders')}</h2>
        <button
          onClick={() => window.location.href = '/admin/orders'}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {t('dashboard.widgets.view_all_orders')}
        </button>
      </div>
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">#{order.order_number}</p>
                <p className="text-sm text-gray-600">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{t('dashboard.widgets.no_recent_orders')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TopProductsWidget = ({ products }: { products: any[] }) => {
  const { t } = useLocale();
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.widgets.top_products')}</h2>
        <button
          onClick={() => window.location.href = '/admin/analytics'}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {t('dashboard.widgets.view_details')}
        </button>
      </div>
      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                <p className="text-xs text-gray-600">{product.sold_quantity} {t('dashboard.widgets.sold')}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">{t('dashboard.widgets.no_product_data')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { t } = useLocale();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getInvoices({ limit: 5 }),
        adminApi.getTopProducts({ limit: 5 })
      ]);
      
      setStats(statsRes);
      setRecentOrders(ordersRes.results || ordersRes || []);
      setTopProducts(productsRes || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(t('dashboard.error'));
      
      // Fallback data for demo purposes
      setStats({
        total_orders: 0,
        total_products: 0,
        total_revenue: 0,
        total_categories: 0,
        total_branches: 0,
        low_stock_products: 0
      });
      setRecentOrders([]);
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add_product':
        setLocation('/admin/products');
        break;
      case 'create_banner':
        setLocation('/admin/banners/new');
        break;
      case 'view_reports':
        setLocation('/admin/analytics');
        break;
      case 'manage_category':
        setLocation('/admin/categories');
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const statCards = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: t('dashboard.stats.total_orders'),
      value: stats?.total_orders || 0,
      change: '+12%',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      icon: <Package className="w-6 h-6" />,
      label: t('dashboard.stats.total_products'),
      value: stats?.total_products || 0,
      change: '+5%',
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: t('dashboard.stats.total_revenue'),
      value: formatCurrency(stats?.total_revenue || 0),
      change: '+18%',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
    {
      icon: <Tag className="w-6 h-6" />,
      label: t('dashboard.stats.categories'),
      value: stats?.total_categories || 0,
      change: '+2',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: t('dashboard.stats.branches'),
      value: stats?.total_branches || 0,
      change: '+1',
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      label: t('dashboard.stats.low_stock'),
      value: stats?.low_stock_products || 0,
      change: t('dashboard.stats.change.need_attention'),
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
  ];

  const quickActions = [
    { 
      label: t('dashboard.quick_actions.add_product'), 
      icon: <Plus className="w-5 h-5" />, 
      path: '/admin/products',
      action: 'add_product'
    },
    { 
      label: t('dashboard.quick_actions.create_banner'), 
      icon: <Image className="w-5 h-5" />, 
      path: '/admin/banners/new',
      action: 'create_banner'
    },
    { 
      label: t('dashboard.quick_actions.view_reports'), 
      icon: <BarChart className="w-5 h-5" />, 
      path: '/admin/analytics',
      action: 'view_reports'
    },
    { 
      label: t('dashboard.quick_actions.manage_users'), 
      icon: <Users className="w-5 h-5" />, 
      path: '/admin/categories',
      action: 'manage_category'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('dashboard.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <div className={stat.textColor}>{stat.icon}</div>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <RecentOrdersWidget orders={recentOrders} />
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1">
          <TopProductsWidget products={topProducts} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quick_actions.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.action)}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors">
                <div className="text-indigo-600">{action.icon}</div>
              </div>
              <span className="text-sm font-medium text-gray-900">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('dashboard.refresh_data')}
        </button>
      </div>
    </div>
  );
}