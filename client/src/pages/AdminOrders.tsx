import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/api';
import { useLocale } from '@/contexts/LocaleContext';

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount_percentage: number;
  original_price: number;
  subtotal: number;
}

interface Invoice {
  id: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  status: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  created_at: string;
  delveried_by?: string;
  items?: InvoiceItem[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AdminOrders() {
  const { t } = useLocale();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deliveredBy, setDeliveredBy] = useState('');

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
      else toast.error(data.error || 'Failed to fetch invoices');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch invoices');
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
        delivered_by_value = prompt('Enter delivered by:') || '';
        if (!delivered_by_value) {
          toast.error('Delivered by is required for shipped orders');
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
        toast.success('Status updated');
        fetchInvoices();
      } else toast.error(data.error || 'Failed to update status');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const deleteInvoice = async (invoiceId: number) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
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
      } else toast.error(data.error || 'Failed to delete invoice');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete invoice');
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
      else toast.error(data.error || 'Failed to fetch invoice');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch invoice');
    }
  };

  const closeModal = () => setSelectedInvoice(null);

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">{t('admin.orders.title')}</h1>
        {loading ? (
          <p>{t('general.loading')}</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="text-center border-t">
                  <td className="p-2">{inv.id}</td>
                  <td className="p-2">{inv.name || 'Guest'}</td>
                  <td className="p-2">{inv.total}</td>
                  <td className="p-2">
                    <select
                      value={inv.status}
                      onChange={e => updateStatus(inv.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="completed">مكتملة</option>
                      <option value="canceled">ملغاة</option>
                      <option value="refunded">مسترجعة</option>
                    </select>
                  </td>
                  <td className="p-2">{new Date(inv.created_at).toLocaleString()}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => openInvoiceModal(inv.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteInvoice(inv.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Invoice #{selectedInvoice.id}</h2>
              <button onClick={closeModal} className="text-red-500 font-bold">X</button>
            </div>

            <div className="mb-4">
              <p><strong>Name:</strong> {selectedInvoice.name || 'Guest'}</p>
              <p><strong>Phone:</strong> {selectedInvoice.phone}</p>
              <p><strong>City:</strong> {selectedInvoice.city}</p>
              <p><strong>Address:</strong> {selectedInvoice.address}</p>
              <p><strong>Delivered By:</strong> {selectedInvoice.delveried_by || '-'}</p>
              <p><strong>Total:</strong> {selectedInvoice.total}</p>
              <p><strong>Delivery Fee:</strong> {selectedInvoice.delivery_fee}</p>
              <p><strong>Discount:</strong> {selectedInvoice.discount_amount}</p>
              <p><strong>Subtotal:</strong> {selectedInvoice.subtotal}</p>
            </div>

            <h3 className="font-semibold mb-2">Items</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Discount %</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items?.map(item => (
                  <tr key={item.id} className="text-center border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{item.price}</td>
                    <td className="p-2">{item.discount_percentage}</td>
                    <td className="p-2">{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
