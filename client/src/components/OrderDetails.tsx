// admin/components/OrderDetails.tsx
import { X, MapPin, Phone, Calendar, Package, Tag, User, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';

interface OrderDetailsProps {
  order: any;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}

export function OrderDetails({ order, onClose, onStatusUpdate }: OrderDetailsProps) {
  const { t, isRTL } = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-LY' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string) => {
    return `LYD ${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('admin.orders.order_details') || 'Order Details'} #{order.id}
            </h2>
            <p className="text-gray-600 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  {t('admin.orders.customer_info') || 'Customer Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4" />
                        {order.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.city}</p>
                      <p className="text-sm text-gray-600 mt-1">{order.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('admin.orders.order_status') || 'Order Status'}
                </h3>
                <div className="space-y-3">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => onStatusUpdate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="pending">{t('admin.status.pending') || 'Pending'}</option>
                    <option value="processing">{t('admin.status.processing') || 'Processing'}</option>
                    <option value="shipped">{t('admin.status.shipped') || 'Shipped'}</option>
                    <option value="delivered">{t('admin.status.delivered') || 'Delivered'}</option>
                    <option value="cancelled">{t('admin.status.cancelled') || 'Cancelled'}</option>
                  </select>
                  <div className="text-sm text-gray-600">
                    {t('admin.orders.status_note') || 'Update the order status as it progresses through fulfillment.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  {t('admin.orders.order_items') || 'Order Items'} ({order.items?.length || 0})
                </h3>
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          {item.color && (
                            <span className="flex items-center gap-1">
                              <div 
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: item.color.toLowerCase() }}
                              />
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span>{t('product.size')}: {item.size}</span>
                          )}
                          <span>{t('admin.orders.quantity')}: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatCurrency((parseFloat(item.price) * item.quantity).toString())}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency((parseFloat(item.original_price) * item.quantity).toString())}
                        </div>
                        <div className="text-xs text-green-600">
                          {item.discount_percentage}% {t('admin.orders.off') || 'off'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  {t('admin.orders.payment_summary') || 'Payment Summary'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.orders.subtotal') || 'Subtotal'}</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {parseFloat(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>{t('admin.orders.discount') || 'Discount'}</span>
                      <span>-{formatCurrency(order.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('admin.orders.shipping') || 'Shipping'}</span>
                    <span>{formatCurrency(order.delivery_fee)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-300 font-bold text-lg">
                    <span>{t('admin.orders.total') || 'Total'}</span>
                    <span className="text-indigo-600">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="text-sm text-gray-500 pt-2">
                    {t('admin.orders.payment_method') || 'Payment Method'}: Cash on Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('admin.orders.close') || 'Close'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            {t('admin.orders.print_invoice') || 'Print Invoice'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}