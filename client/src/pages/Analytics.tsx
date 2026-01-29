import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  MessageSquare,
  Phone,
  Building,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Mail,
  MapPin,
  Clock,
  Globe,
  Edit,
  Trash2,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { adminApi, formatCurrency, formatDate } from '../api';
import { useLocale } from '../contexts/LocaleContext';

interface WAInfo {
  id: number;
  contact_number: string;
  reminder_message: string;
  is_active: boolean;
  updated_at: string;
}

interface Branch {
  id: number;
  name: string;
  phone_number: string;
  Email_Adress: string;
  opening_hours: string;
  closing_hours: string;
  day_from: string;
  day_to: string;
  address: string;
  latitude: number;
  longitude: number;
  facbook_link: string;
  instagram_link: string;
  twitter_link: string;
  linkdin_link: string;
  primery_branch: boolean;
}

interface Message {
  id: number;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface Invoice {
  id: number;
  name: string;
  total: number;
  status: string;
  created_at: string;
  items_count: number;
}

interface AnalyticsData {
  messages: Message[];
  wa_info: WAInfo[];
  sales: {
    total_sales: number;
    total_revenue: number;
    total_invoices: number;
    recent_invoices: Invoice[];
    monthly_revenue: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
  };
  branches: Branch[];
  top_products: Array<{
    id: number;
    name: string;
    category: string;
    sold_quantity: number;
    revenue: number;
  }>;
  stats: {
    unread_messages: number;
    pending_orders: number;
    active_branches: number;
    low_stock_products: number;
  };
}

interface EditModalData {
  type: 'wa_info' | 'branch' | 'message';
  data: any;
}

export default function AdminAnalytics() {
  const { t } = useLocale();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditModalData | null>(null);
  const [showWaForm, setShowWaForm] = useState(false);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [newWaInfo, setNewWaInfo] = useState({ contact_number: '', reminder_message: '' });
  const [newBranch, setNewBranch] = useState<Partial<Branch>>({});
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(t('analytics.error.loading'));
    } finally {
      setLoading(false);
    }
  };

  const updateWaInfo = async (id: number, data: Partial<WAInfo>) => {
    try {
      await adminApi.updateWaInfo(id, data);
      loadAnalytics();
    } catch (err) {
      console.error('Failed to update WA info:', err);
      alert(t('analytics.error.update'));
    }
  };

  const createWaInfo = async () => {
    try {
      await adminApi.createWaInfo(newWaInfo);
      setShowWaForm(false);
      setNewWaInfo({ contact_number: '', reminder_message: '' });
      loadAnalytics();
    } catch (err) {
      console.error('Failed to create WA info:', err);
      alert(t('analytics.error.create'));
    }
  };

  const updateBranch = async (id: number, data: Partial<Branch>) => {
    try {
      await adminApi.updateBranch(id, data);
      loadAnalytics();
    } catch (err) {
      console.error('Failed to update branch:', err);
      alert(t('analytics.error.update'));
    }
  };

  const createBranch = async () => {
    try {
      await adminApi.createBranch(newBranch);
      setShowBranchForm(false);
      setNewBranch({});
      loadAnalytics();
    } catch (err) {
      console.error('Failed to create branch:', err);
      alert(t('analytics.error.create'));
    }
  };

  const deleteBranch = async (id: number) => {
    if (window.confirm(t('analytics.confirm.delete_branch'))) {
      try {
        await adminApi.deleteBranch(id);
        loadAnalytics();
      } catch (err) {
        console.error('Failed to delete branch:', err);
        alert(t('analytics.error.delete'));
      }
    }
  };

  const markMessageRead = async (id: number) => {
    try {
      await adminApi.markMessageRead(id);
      loadAnalytics();
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const filteredMessages = useMemo(() => {
    if (!analytics) return [];
    return analytics.messages.filter(msg => 
      messageFilter === 'all' || !msg.is_read
    );
  }, [analytics, messageFilter]);

  const statsCards = [
    {
      title: t('analytics.stats.total_revenue'),
      value: formatCurrency(analytics?.sales.total_revenue || 0),
      icon: <DollarSign className="w-6 h-6" />,
      change: '+12%',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: t('analytics.stats.total_orders'),
      value: analytics?.sales.total_sales || 0,
      icon: <ShoppingBag className="w-6 h-6" />,
      change: '+8%',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: t('analytics.stats.pending_orders'),
      value: analytics?.stats.pending_orders || 0,
      icon: <Clock className="w-6 h-6" />,
      change: '-3',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: t('analytics.stats.unread_messages'),
      value: analytics?.stats.unread_messages || 0,
      icon: <Mail className="w-6 h-6" />,
      change: '+5',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: t('analytics.stats.active_branches'),
      value: analytics?.stats.active_branches || 0,
      icon: <Building className="w-6 h-6" />,
      change: '+1',
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: t('analytics.stats.low_stock'),
      value: analytics?.stats.low_stock_products || 0,
      icon: <Package className="w-6 h-6" />,
      change: t('analytics.stats.need_attention'),
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('analytics.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">{error || t('analytics.error.loading')}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('analytics.retry')}
          </button>
        </div>
      </div>
    );
  }
return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('analytics.title')}</h1>
          <p className="text-gray-600 mt-1">{t('analytics.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('analytics.refresh')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            {t('analytics.export')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
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
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('analytics.revenue_chart.title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('analytics.revenue_chart.subtitle')}</p>
              </div>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white">
                <option>{t('analytics.revenue_chart.last_12_months')}</option>
                <option>{t('analytics.revenue_chart.last_6_months')}</option>
                <option>{t('analytics.revenue_chart.last_3_months')}</option>
              </select>
            </div>
            <div className="h-64 flex items-end gap-2">
              {analytics.sales.monthly_revenue?.slice(-12).map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition-colors cursor-pointer"
                    style={{ height: `${(month.revenue / Math.max(...analytics.sales.monthly_revenue.map(m => m.revenue))) * 100}%` }}
                    title={`${formatCurrency(month.revenue)} - ${new Date(month.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(month.month).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('analytics.recent_invoices.title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('analytics.recent_invoices.subtitle')}</p>
              </div>
              <button
                onClick={() => window.location.href = '/admin/invoices'}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                {t('analytics.view_all')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{t('analytics.recent_invoices.order')}</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{t('analytics.recent_invoices.customer')}</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{t('analytics.recent_invoices.date')}</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{t('analytics.recent_invoices.amount')}</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">{t('analytics.recent_invoices.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.sales.recent_invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">#{invoice.id}</td>
                      <td className="py-3 px-4">{invoice.name || t('analytics.recent_invoices.guest')}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(invoice.created_at)}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(invoice.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          invoice.status === 'completed' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* WhatsApp Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('analytics.whatsapp.title')}</h2>
                <p className="text-sm text-gray-600 mt-1">{t('analytics.whatsapp.subtitle')}</p>
              </div>
              <button
                onClick={() => setShowWaForm(true)}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-4 h-4" />
                {t('analytics.whatsapp.add_new')}
              </button>
            </div>
            
            <div className="space-y-4">
              {analytics.wa_info.map((wa) => (
                <div key={wa.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{wa.contact_number}</span>
                      {wa.is_active && (
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {t('analytics.whatsapp.active')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setEditing({ type: 'wa_info', data: wa })}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{wa.reminder_message}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {t('analytics.whatsapp.last_updated')}: {formatDate(wa.updated_at)}
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wa.is_active}
                          onChange={(e) => updateWaInfo(wa.id, { is_active: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add WA Info Form */}
            {showWaForm && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-3">{t('analytics.whatsapp.add_new')}</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder={t('analytics.whatsapp.phone_placeholder')}
                    value={newWaInfo.contact_number}
                    onChange={(e) => setNewWaInfo({ ...newWaInfo, contact_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder={t('analytics.whatsapp.message_placeholder')}
                    value={newWaInfo.reminder_message}
                    onChange={(e) => setNewWaInfo({ ...newWaInfo, reminder_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={createWaInfo}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {t('analytics.save')}
                    </button>
                    <button
                      onClick={() => setShowWaForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {t('analytics.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t('analytics.messages.title')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('analytics.messages.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMessageFilter('all')}
                  className={`px-3 py-1 text-sm rounded ${messageFilter === 'all' ? 'bg-white shadow' : ''}`}
                >
                  {t('analytics.messages.all')}
                </button>
                <button
                  onClick={() => setMessageFilter('unread')}
                  className={`px-3 py-1 text-sm rounded ${messageFilter === 'unread' ? 'bg-white shadow' : ''}`}
                >
                  {t('analytics.messages.unread')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 border rounded-lg transition-colors ${message.is_read ? 'border-gray-200 bg-white' : 'border-indigo-200 bg-indigo-50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {message.email || message.phone_number}
                    </p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                  </div>
                  {!message.is_read && (
                    <button
                      onClick={() => markMessageRead(message.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {t('analytics.messages.mark_read')}
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm mb-3">{message.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(message.created_at)}</span>
                  {!message.is_read && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      {t('analytics.messages.new')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branches */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{t('analytics.branches.title')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('analytics.branches.subtitle')}</p>
            </div>
            <button
              onClick={() => setShowBranchForm(true)}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <Plus className="w-4 h-4" />
              {t('analytics.branches.add_new')}
            </button>
          </div>

          <div className="space-y-4">
            {analytics.branches.map((branch) => (
              <div key={branch.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{branch.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {branch.address}
                      </p>
                    </div>
                    {branch.primery_branch && (
                      <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {t('analytics.branches.primary')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing({ type: 'branch', data: branch })}
                      className="p-1 text-gray-400 hover:text-indigo-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBranch(branch.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">{t('analytics.branches.phone')}:</p>
                    <p className="font-medium">{branch.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('analytics.branches.email')}:</p>
                    <p className="font-medium">{branch.Email_Adress}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('analytics.branches.hours')}:</p>
                    <p className="font-medium">{branch.opening_hours} - {branch.closing_hours}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('analytics.branches.days')}:</p>
                    <p className="font-medium">{branch.day_from} - {branch.day_to}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Branch Form */}
          {showBranchForm && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">{t('analytics.branches.add_new')}</h3>
              <div className="space-y-3">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.name')} *
                    </label>
                    <input
                      type="text"
                      placeholder={t('analytics.branches.name_placeholder')}
                      value={newBranch.name || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.phone')} *
                    </label>
                    <input
                      type="text"
                      placeholder={t('analytics.branches.phone_placeholder')}
                      value={newBranch.phone_number || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, phone_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email & Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('analytics.branches.email')} *
                  </label>
                  <input
                    type="email"
                    placeholder={t('analytics.branches.email_placeholder')}
                    value={newBranch.Email_Adress || ''}
                    onChange={(e) => setNewBranch({ ...newBranch, Email_Adress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('analytics.branches.address')} *
                  </label>
                  <textarea
                    placeholder={t('analytics.branches.address_placeholder')}
                    value={newBranch.address || ''}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Business Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.opening_hours')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 09:00"
                      value={newBranch.opening_hours || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, opening_hours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.closing_hours')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 18:00"
                      value={newBranch.closing_hours || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, closing_hours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Working Days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.day_from')}
                    </label>
                    <select
                      value={newBranch.day_from || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, day_from: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.day_to')}
                    </label>
                    <select
                      value={newBranch.day_to || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, day_to: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                </div>

                {/* Coordinates - Google Maps Integration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.latitude')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 32.8872"
                      value={newBranch.latitude || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.longitude')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g., 13.1913"
                      value={newBranch.longitude || ''}
                      onChange={(e) => setNewBranch({ ...newBranch, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">{t('analytics.branches.social_media')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/..."
                        value={newBranch.facbook_link || ''}
                        onChange={(e) => setNewBranch({ ...newBranch, facbook_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        placeholder="https://instagram.com/..."
                        value={newBranch.instagram_link || ''}
                        onChange={(e) => setNewBranch({ ...newBranch, instagram_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Twitter URL</label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/..."
                        value={newBranch.twitter_link || ''}
                        onChange={(e) => setNewBranch({ ...newBranch, twitter_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/..."
                        value={newBranch.linkdin_link || ''}
                        onChange={(e) => setNewBranch({ ...newBranch, linkdin_link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Branch Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="primary-branch"
                    checked={newBranch.primery_branch || false}
                    onChange={(e) => setNewBranch({ ...newBranch, primery_branch: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="primary-branch" className="ml-2 block text-sm text-gray-700">
                    {t('analytics.branches.set_primary')}
                  </label>
                </div>

                {/* Map Preview (if coordinates are set) */}
                {(newBranch.latitude && newBranch.longitude) && (
                  <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-white">
                    <p className="text-sm font-medium text-gray-700 mb-2">Location Preview</p>
                    <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                      {/* Google Maps embed - Note: You'll need a Google Maps API key */}
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${newBranch.latitude},${newBranch.longitude}&zoom=15`}
                        title="Location Preview"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Coordinates: {newBranch.latitude}, {newBranch.longitude}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={createBranch}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {t('analytics.save')}
                  </button>
                  <button
                    onClick={() => setShowBranchForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    {t('analytics.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && editing.type === 'branch' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('analytics.edit_branch')}
              </h3>
              
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.name')} *
                    </label>
                    <input
                      type="text"
                      value={editing.data.name || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.phone')} *
                    </label>
                    <input
                      type="text"
                      value={editing.data.phone_number || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, phone_number: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email & Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('analytics.branches.email')} *
                  </label>
                  <input
                    type="email"
                    value={editing.data.Email_Adress || ''}
                    onChange={(e) => setEditing({
                      ...editing,
                      data: { ...editing.data, Email_Adress: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('analytics.branches.address')} *
                  </label>
                  <textarea
                    value={editing.data.address || ''}
                    onChange={(e) => setEditing({
                      ...editing,
                      data: { ...editing.data, address: e.target.value }
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Business Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.opening_hours')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 09:00"
                      value={editing.data.opening_hours || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, opening_hours: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.closing_hours')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 18:00"
                      value={editing.data.closing_hours || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, closing_hours: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Working Days */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.day_from')}
                    </label>
                    <select
                      value={editing.data.day_from || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, day_from: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.day_to')}
                    </label>
                    <select
                      value={editing.data.day_to || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, day_to: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.latitude')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editing.data.latitude || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, latitude: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('analytics.branches.longitude')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editing.data.longitude || ''}
                      onChange={(e) => setEditing({
                        ...editing,
                        data: { ...editing.data, longitude: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">{t('analytics.branches.social_media')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={editing.data.facbook_link || ''}
                        onChange={(e) => setEditing({
                          ...editing,
                          data: { ...editing.data, facbook_link: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={editing.data.instagram_link || ''}
                        onChange={(e) => setEditing({
                          ...editing,
                          data: { ...editing.data, instagram_link: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Twitter URL</label>
                      <input
                        type="url"
                        value={editing.data.twitter_link || ''}
                        onChange={(e) => setEditing({
                          ...editing,
                          data: { ...editing.data, twitter_link: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={editing.data.linkdin_link || ''}
                        onChange={(e) => setEditing({
                          ...editing,
                          data: { ...editing.data, linkdin_link: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Branch Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-primary-branch"
                    checked={editing.data.primery_branch || false}
                    onChange={(e) => setEditing({
                      ...editing,
                      data: { ...editing.data, primery_branch: e.target.checked }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-primary-branch" className="ml-2 block text-sm text-gray-700">
                    {t('analytics.branches.set_primary')}
                  </label>
                </div>

                {/* Map Preview */}
                {(editing.data.latitude && editing.data.longitude) && (
                  <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-white">
                    <p className="text-sm font-medium text-gray-700 mb-2">Location Preview</p>
                    <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${editing.data.latitude},${editing.data.longitude}&zoom=15`}
                        title="Location Preview"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('analytics.cancel')}
                </button>
                <button
                  onClick={async () => {
                    await updateBranch(editing.data.id, editing.data);
                    setEditing(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {t('analytics.save_changes')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}