import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/api';
import { useLocale } from '@/contexts/LocaleContext';
import { getColorDisplayName, getColorCode } from '@/lib/colors'; // Add these imports
import { usePrintInvoice } from '@/hooks/usePrintInvoice'; // Add this import

import { 
  Eye, 
  Trash2, 
  Printer, 
  Download, 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  XCircle, 
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  ChevronDown,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  Hash,
  ShoppingBag,
  Tag,
  Copy,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface InvoiceItem {
  id: number;
  product: number;
  name: string;
  quantity: number;
  color: string;
  size: string;
  price: string;
  discount_percentage: string;
  original_price: string;
}

interface Invoice {
  id: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  status: string;
  total: string;
  subtotal: string;
  delivery_fee: string;
  discount_amount: string;
  created_at: string;
  delivered_by?: string;
  items?: InvoiceItem[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Status colors mapping
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

// Status icons mapping
const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  processing: <RefreshCw className="w-4 h-4" />,
  shipped: <Truck className="w-4 h-4" />,
  completed: <CheckCircle className="w-4 h-4" />,
  canceled: <XCircle className="w-4 h-4" />,
  refunded: <Package className="w-4 h-4" />,
};

export default function AdminOrders() {
  const { t, isRTL } = useLocale();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { printInvoice } = usePrintInvoice(); // Add this line

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;

      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/invoices/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) setInvoices(data.invoices);
      else toast.error(data.error || t('admin.orders.fetch_error'));
    } catch (err) {
      console.error(err);
      toast.error(t('admin.orders.fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const updateStatus = async (invoiceId: number, status: string) => {
    try {
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;

      // If status is shipped, prompt for delivered_by
      let delivered_by_value = '';
      if (status === 'shipped') {
        delivered_by_value = prompt(t('admin.orders.enter_delivered_by') || 'Enter delivered by:') || '';
        if (!delivered_by_value) {
          toast.error(t('admin.orders.delivered_by_required'));
          return;
        }
      }

      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/invoices/${invoiceId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, delivered_by: delivered_by_value }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(t('admin.orders.status_updated'));
        fetchInvoices();
      } else toast.error(data.error || t('admin.orders.update_error'));
    } catch (err) {
      console.error(err);
      toast.error(t('admin.orders.update_error'));
    }
  };

  const deleteInvoice = async (invoiceId: number) => {
    if (!confirm(t('admin.orders.confirm_delete'))) return;
    try {
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;

      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/invoices/${invoiceId}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        fetchInvoices();
      } else toast.error(data.error || t('admin.orders.delete_error'));
    } catch (err) {
      console.error(err);
      toast.error(t('admin.orders.delete_error'));
    }
  };

  const openInvoiceModal = async (invoiceId: number) => {
    try {
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;

      const res = await fetchWithAuth(`${API_BASE_URL}/api/admin/invoices/${invoiceId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (res.ok && data.success) setSelectedInvoice(data.invoice);
      else toast.error(data.error || t('admin.orders.fetch_error'));
    } catch (err) {
      console.error(err);
      toast.error(t('admin.orders.fetch_error'));
    }
  };

  const closeModal = () => setSelectedInvoice(null);

  const handlePrintInvoice = () => {
    if (!selectedInvoice) return;
    
    printInvoice({
      id: selectedInvoice.id,
      invoice_number: `INV-${String(selectedInvoice.id).padStart(6, '0')}`,
      created_at: selectedInvoice.created_at,
      name: selectedInvoice.name,
      phone: selectedInvoice.phone,
      city: selectedInvoice.city,
      address: selectedInvoice.address,
      status: selectedInvoice.status as 'pending' | 'completed' | 'canceled',
      items: selectedInvoice.items?.map(item => ({
        id: item.id,
        name: item.name,
        color: t(getColorDisplayName(item.color)),
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        discount_percentage: parseFloat(item.discount_percentage) || 0,
        image: undefined // Add product image URL here if available
      })) || [],
      subtotal: parseFloat(selectedInvoice.subtotal),
      delivery_fee: parseFloat(selectedInvoice.delivery_fee),
      discount_amount: parseFloat(selectedInvoice.discount_amount),
      total: parseFloat(selectedInvoice.total),
      payment_method: 'cod', // or get from your data
      notes: selectedInvoice.delivered_by 
        ? `تم التوصيل بواسطة: ${selectedInvoice.delivered_by}` 
        : undefined
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('admin.orders.copied'));
  };

  const sendWhatsAppMessage = (phone: string) => {
    const message = t('admin.orders.whatsapp_message', { invoiceNumber: selectedInvoice?.id });
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.phone.includes(searchTerm) ||
                         invoice.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('admin.orders.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('admin.orders.subtitle', { count: invoices.length })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInvoices}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.orders.refresh')}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.orders.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">{t('admin.orders.all_status')}</option>
              <option value="pending">{t('admin.status.pending')}</option>
              <option value="processing">{t('admin.status.processing')}</option>
              <option value="shipped">{t('admin.status.shipped')}</option>
              <option value="completed">{t('admin.status.completed')}</option>
              <option value="canceled">{t('admin.status.canceled')}</option>
              <option value="refunded">{t('admin.status.refunded')}</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{invoices.length}</div>
              <div className="text-sm text-gray-600">{t('admin.orders.total')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {invoices.filter(i => i.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">{t('admin.orders.completed')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {invoices.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">{t('admin.orders.pending')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">{t('general.loading')}</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('admin.orders.no_orders')}
            </h3>
            <p className="text-gray-600">{t('admin.orders.no_orders_desc')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.order')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.orders.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">#{invoice.id}</div>
                          <div className="text-sm text-gray-500">{invoice.items?.length} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invoice.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {invoice.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        {invoice.total} LYD
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.delivery_fee} LYD delivery
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                          {statusIcons[invoice.status as keyof typeof statusIcons]}
                          {t(`admin.status.${invoice.status}`)}
                        </div>
                        <select
                          value={invoice.status}
                          onChange={(e) => updateStatus(invoice.id, e.target.value)}
                          className="text-sm border-none bg-transparent focus:ring-0"
                        >
                          <option value="pending">{t('admin.status.pending')}</option>
                          <option value="processing">{t('admin.status.processing')}</option>
                          <option value="shipped">{t('admin.status.shipped')}</option>
                          <option value="completed">{t('admin.status.completed')}</option>
                          <option value="canceled">{t('admin.status.canceled')}</option>
                          <option value="refunded">{t('admin.status.refunded')}</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInvoiceModal(invoice.id)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title={t('admin.orders.view')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title={t('admin.orders.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    {t('admin.orders.invoice')} #{selectedInvoice.id}
                  </h2>
                  <p className="text-indigo-100">
                    {new Date(selectedInvoice.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-indigo-200 p-2"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('admin.orders.customer_info')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.name')}:</span>
                      <span className="font-medium">{selectedInvoice.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.phone')}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedInvoice.phone}</span>
                        <button
                          onClick={() => copyToClipboard(selectedInvoice.phone)}
                          className="text-gray-400 hover:text-gray-600"
                          title={t('admin.orders.copy')}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => sendWhatsAppMessage(selectedInvoice.phone)}
                          className="text-green-400 hover:text-green-600"
                          title={t('admin.orders.whatsapp')}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.city')}:</span>
                      <span className="font-medium">{selectedInvoice.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.address')}:</span>
                      <span className="font-medium text-right">{selectedInvoice.address}</span>
                    </div>
                    {selectedInvoice.delivered_by && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('admin.orders.delivered_by')}:</span>
                        <span className="font-medium">{selectedInvoice.delivered_by}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    {t('admin.orders.order_info')}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.status')}:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedInvoice.status as keyof typeof statusColors]}`}>
                        {t(`admin.status.${selectedInvoice.status}`)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.date')}:</span>
                      <span className="font-medium">
                        {new Date(selectedInvoice.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.items')}:</span>
                      <span className="font-medium">{selectedInvoice.items?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('admin.orders.items')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('admin.orders.product')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('product.color')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('product.size')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('product.quantity')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('product.price')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('product.discount')}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          {t('admin.orders.subtotal')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">#{item.product}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: getColorCode(item.color) }}
                              />
                              {t(getColorDisplayName(item.color))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {item.size}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{item.quantity}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.price} LYD</div>
                            <div className="text-sm text-gray-500 line-through">
                              {item.original_price} LYD
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-red-600 font-medium">
                              {item.discount_percentage}%
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} LYD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.subtotal')}:</span>
                      <span className="font-medium">{selectedInvoice.subtotal} LYD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('admin.orders.delivery_fee')}:</span>
                      <span className="font-medium">{selectedInvoice.delivery_fee} LYD</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>{t('admin.orders.discount')}:</span>
                      <span>-{selectedInvoice.discount_amount} LYD</span>
                    </div>
                  </div>
                  <div className="border-l pl-6 md:pl-6 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {t('admin.orders.total')}:
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {selectedInvoice.total} LYD
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('admin.orders.payment_note')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  {t('admin.orders.invoice_footer')}
                </div>
                <div className="flex items-center gap-3">
                  <button
  onClick={handlePrintInvoice} // Change from printInvoice to handlePrintInvoice
  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
>
  <Printer className="w-4 h-4" />
  {t('admin.orders.print')}
</button>
                  <button
                    onClick={() => {
                      // Implement download functionality
                      toast.success(t('admin.orders.download_success'));
                    }}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                    {t('admin.orders.download')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}