// admin/components/DashboardWidgets.tsx
import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  MoreVertical,
  Star,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getPaymentStatusColor } from '../api';
import { motion } from 'framer-motion';

// ==================== DASHBOARD STATS ====================
interface DashboardStatsProps {
  stats: {
    total_orders: number;
    total_products: number;
    total_revenue: number;
    total_categories: number;
    total_branches: number;
    low_stock_products: number;
    pending_orders?: number;
    completed_orders?: number;
    average_order_value?: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: <ShoppingBag className="w-5 h-5" />,
      change: '+12.5%',
      trend: 'up',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      icon: <DollarSign className="w-5 h-5" />,
      change: '+18.2%',
      trend: 'up',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Products',
      value: stats.total_products,
      icon: <Package className="w-5 h-5" />,
      change: '+5.3%',
      trend: 'up',
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Low Stock',
      value: stats.low_stock_products,
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+2 items',
      trend: 'down',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders || 0,
      icon: <Clock className="w-5 h-5" />,
      change: '−3 from yesterday',
      trend: 'down',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(stats.average_order_value || 0),
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+8.7%',
      trend: 'up',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <div className={stat.textColor}>{stat.icon}</div>
            </div>
            <div className="flex items-center gap-1">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

// ==================== RECENT ORDERS ====================
interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  items_count?: number;
  branch?: string;
}

interface RecentOrdersProps {
  orders: Order[];
  onViewOrder?: (orderId: number) => void;
  title?: string;
  maxItems?: number;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ 
  orders, 
  onViewOrder, 
  title = 'Recent Orders',
  maxItems = 5 
}) => {
  const displayedOrders = orders.slice(0, maxItems);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">Latest customer orders</p>
          </div>
          {orders.length > maxItems && (
            <button
              onClick={() => window.location.href = '/admin/orders'}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                        {order.items_count && (
                          <div className="text-sm text-gray-500">
                            {order.items_count} items
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{order.customer_name}</div>
                    {order.customer_email && (
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.created_at).split(',')[0]}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(order.created_at).split(',')[1]}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        order.status === 'completed' ? 'bg-green-500' :
                        order.status === 'processing' ? 'bg-blue-500' :
                        order.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrder ? onViewOrder(order.id) : window.location.href = `/admin/orders/${order.id}`}
                        className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.location.href = `/admin/orders/${order.id}/edit`}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 font-medium mb-2">No orders yet</p>
                    <p className="text-gray-500 text-sm">Orders will appear here once customers start shopping</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {displayedOrders.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {displayedOrders.length} of {orders.length} orders
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== TOP PRODUCTS ====================
interface TopProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  sold_quantity: number;
  revenue: number;
  stock_quantity: number;
  image?: string;
  rating?: number;
  price?: number;
  discount_percentage?: number;
}

interface TopProductsProps {
  products: TopProduct[];
  title?: string;
  maxItems?: number;
  showRevenue?: boolean;
}

export const TopProducts: React.FC<TopProductsProps> = ({ 
  products, 
  title = 'Top Selling Products',
  maxItems = 5,
  showRevenue = true
}) => {
  const displayedProducts = products.slice(0, maxItems);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    if (quantity <= 10) return { text: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const getPopularityColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-gray-100 text-gray-800';
      case 2: return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">Based on sales performance</p>
          </div>
          {products.length > maxItems && (
            <button
              onClick={() => window.location.href = '/admin/products'}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="divide-y divide-gray-200">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => {
            const stockStatus = getStockStatus(product.stock_quantity);
            return (
              <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${getPopularityColor(index)} text-sm font-bold`}>
                    #{index + 1}
                  </div>

                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><Package class="w-6 h-6 text-gray-400" /></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      {product.rating && (
                        <div className="flex items-center gap-1 ml-2">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                      <span className="text-xs text-gray-600">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                  </div>

                  {/* Sales Info */}
                  <div className="text-right">
                    {showRevenue ? (
                      <>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(product.revenue)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {product.sold_quantity} sold
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-gray-900">
                          {product.sold_quantity} sold
                        </div>
                        {product.price && (
                          <div className="text-xs text-gray-600 mt-1">
                            {formatCurrency(product.price)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {index === 0 && displayedProducts.length > 1 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Performance</span>
                      <span>{Math.round((product.sold_quantity / displayedProducts[1]?.sold_quantity || 1) * 100)}% better than #2</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (product.sold_quantity / (displayedProducts.reduce((acc, p) => acc + p.sold_quantity, 0) / displayedProducts.length)) * 50)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">No product data</p>
            <p className="text-gray-500 text-sm">Sales data will appear here</p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {displayedProducts.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Revenue: {formatCurrency(displayedProducts.reduce((acc, p) => acc + p.revenue, 0))}
            </div>
            <div className="text-sm text-gray-600">
              Total Sold: {displayedProducts.reduce((acc, p) => acc + p.sold_quantity, 0)} units
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== SALES CHART (Simplified) ====================
interface SalesChartProps {
  data: { date: string; revenue: number; orders: number }[];
  period?: 'day' | 'week' | 'month' | 'year';
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, period = 'month' }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Revenue over time</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <div className="h-64">
        {data.length > 0 ? (
          <div className="flex items-end h-48 gap-2 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  title={`${formatCurrency(item.revenue)} - ${item.date}`}
                ></div>
                <div className="text-xs text-gray-500 mt-2 truncate">
                  {period === 'day' ? item.date.split(' ')[1] : item.date}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No sales data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Orders</span>
        </div>
      </div>
    </div>
  );
};

// ==================== EXPORT DEFAULT ====================
export default {
  DashboardStats,
  RecentOrders,
  TopProducts,
  SalesChart
};