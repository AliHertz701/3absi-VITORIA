import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";
import { Loader2, MapPin, Phone, User, CheckCircle2, Package } from "lucide-react";
import { z } from "zod";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveMediaUrl } from "@/api";
import { useLocale } from "@/contexts/LocaleContext";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface City {
  id: number;
  name: string;
  delivery_fee: string;
}

interface InvoiceResponse {
  success: boolean;
  invoice_id: number;
  subtotal: string;
  delivery_fee: string;
  discount_amount: string;
  total: string;
  client_number: string;
}

// Form schema for Libya invoice
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(9, "Valid phone number required"),
  cityId: z.string().min(1, "Please select a city"),
  address: z.string().min(5, "Full address is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, isRTL } = useLocale();
  
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      cityId: "",
      address: "",
    },
  });

  const selectedCityId = form.watch("cityId");
  const selectedCity = cities.find(c => c.id.toString() === selectedCityId);
  const deliveryFee = selectedCity ? parseFloat(selectedCity.delivery_fee) : 0;
  const finalTotal = total + deliveryFee;

  // Fetch Libyan cities
  useEffect(() => {
    fetch(`${API_URL}/cities/`)
      .then(res => res.json())
      .then((data: { cities: City[] }) => {
        setCities(data.cities || []);
      })
      .catch(err => {
        console.error("Failed to load cities:", err);
        toast({
          title: "Error",
          description: "Failed to load delivery cities",
          variant: "destructive",
        });
      })
      .finally(() => setLoadingCities(false));
  }, []);

  // Redirect if cart empty
  if (items.length === 0 && !showSuccessModal) {
    setLocation("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const invoiceItems = items.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        discount_percentage: item.product.discount_percentage || 0,
      }));

      const response = await fetch(`${API_URL}/invoices/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.customerName,
          phone: data.customerPhone,
          city_id: parseInt(data.cityId),
          address: data.address,
          items: invoiceItems,
        }),
      });

      const result: InvoiceResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create invoice");
      }

      setInvoiceData(result);
      setShowSuccessModal(true);
      clearCart();
      
      toast({
        title: t('checkout.success') || "Order Confirmed",
        description: `Invoice #${result.invoice_id} created successfully`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount) + ' LYD';
  };

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      
      <div className="flex-1 pt-24 md:pt-28 pb-16 md:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl text-ivory-900 mb-2">
              {t('checkout.title') || 'Complete Your Order'}
            </h1>
            <p className="text-ivory-600 font-sans text-sm">
              {t('checkout.subtitle') || 'Fill in your details and we will contact you for confirmation'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left: Form */}
            <div className="space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Contact Info */}
                <div className="bg-white/50 border border-ivory-200 p-5 space-y-4">
                  <h3 className="font-display text-lg text-ivory-900 pb-2 border-b border-ivory-200">
                    {t('checkout.contact_info') || 'Contact Information'}
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-ivory-500 font-sans font-medium">
                        {t('checkout.full_name') || 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400" />
                        <input
                          {...form.register("customerName")}
                          className="w-full bg-white border border-ivory-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-ivory-500 transition-colors font-sans"
                          placeholder={t('checkout.name_placeholder') || 'Your full name'}
                        />
                      </div>
                      {form.formState.errors.customerName && (
                        <p className="text-xs text-burgundy font-sans">{form.formState.errors.customerName.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-ivory-500 font-sans font-medium">
                        {t('checkout.phone') || 'Phone Number'}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400" />
                        <input
                          {...form.register("customerPhone")}
                          type="tel"
                          className="w-full bg-white border border-ivory-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-ivory-500 transition-colors font-sans"
                          placeholder={t('checkout.phone_placeholder') || '0912345678'}
                          dir="ltr"
                        />
                      </div>
                      {form.formState.errors.customerPhone && (
                        <p className="text-xs text-burgundy font-sans">{form.formState.errors.customerPhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-white/50 border border-ivory-200 p-5 space-y-4">
                  <h3 className="font-display text-lg text-ivory-900 pb-2 border-b border-ivory-200">
                    {t('checkout.shipping') || 'Delivery Details'}
                  </h3>
                  
                  <div className="space-y-3">
                    {/* City Selection */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-ivory-500 font-sans font-medium">
                        {t('checkout.city') || 'City'}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-400" />
                        <select
                          {...form.register("cityId")}
                          className="w-full bg-white border border-ivory-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-ivory-500 transition-colors font-sans appearance-none"
                          disabled={loadingCities}
                        >
                          <option value="">
                            {loadingCities 
                              ? (t('checkout.loading_cities') || 'Loading cities...') 
                              : (t('checkout.select_city') || 'Select your city')
                            }
                          </option>
                          {cities.map(city => (
                            <option key={city.id} value={city.id}>
                              {city.name} (+{parseFloat(city.delivery_fee).toFixed(2)} LYD)
                            </option>
                          ))}
                        </select>
                      </div>
                      {form.formState.errors.cityId && (
                        <p className="text-xs text-burgundy font-sans">{form.formState.errors.cityId.message}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-ivory-500 font-sans font-medium">
                        {t('checkout.address') || 'Full Address'}
                      </label>
                      <textarea
                        {...form.register("address")}
                        rows={3}
                        className="w-full bg-white border border-ivory-300 p-3 text-sm focus:outline-none focus:border-ivory-500 transition-colors font-sans resize-none"
                        placeholder={t('checkout.address_placeholder') || 'Street, building, floor, landmarks...'}
                      />
                      {form.formState.errors.address && (
                        <p className="text-xs text-burgundy font-sans">{form.formState.errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gradient-to-r from-ivory-50/50 to-white border border-ivory-200 p-5">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-ivory-900 text-sm mb-1 font-serif">
                        {t('checkout.payment_method') || 'Cash on Delivery'}
                      </h4>
                      <p className="text-ivory-600 text-xs leading-relaxed font-sans">
                        {t('checkout.cod_description') || 'You will pay in cash when the order is delivered to your address. We will contact you via WhatsApp to confirm.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Mobile Only */}
                <div className="lg:hidden">
           <button
  type="submit"
  disabled={isSubmitting || items.length === 0}
  className={`
    w-full
    py-4
    text-sm
    uppercase
    tracking-[0.2em]
    font-serif
    text-ivory-900
    bg-[rgb(197,161,89)]
    hover:bg-[rgb(210,175,95)]
    disabled:bg-ivory-300
    disabled:text-ivory-500
    shadow-lg
    hover:shadow-xl
    transition-all
    duration-300
    flex
    items-center
    justify-center
    gap-2
  `}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      {t('checkout.processing') || 'Processing...'}
    </span>
  ) : (
    <span className="flex items-center justify-center gap-2">
      {t('checkout.place_order') || 'Place Order'}
      <span className="text-xs opacity-90">({formatPrice(finalTotal)})</span>
    </span>
  )}
</button>


                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-white border border-ivory-200 shadow-sm">
                <div className="p-5 border-b border-ivory-100">
                  <h3 className="font-display text-xl text-ivory-900">
                    {t('checkout.order_summary') || 'Order Summary'}
                  </h3>
                </div>
                
                <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
                  {items.map((item) => {
                    const itemPrice = typeof item.product.price === 'string' 
                      ? parseFloat(item.product.price) 
                      : item.product.price;
                    const itemTotal = itemPrice * item.quantity;
                    
                    return (
                      <div key={item.id} className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-16 h-20 bg-ivory-100 flex-shrink-0 border border-ivory-200">
                          <img 
                            src={resolveMediaUrl(item.product.image)} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x120?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm text-ivory-900 line-clamp-1">{item.product.name}</h4>
                          <p className="text-xs text-ivory-500 font-sans mt-0.5">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' / '}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-ivory-400 font-sans">x{item.quantity}</span>
                            <span className="font-serif text-sm text-ivory-900">{formatPrice(itemTotal)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-5 bg-ivory-50/50 border-t border-ivory-200 space-y-2">
                  <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-ivory-600 font-sans">{t('cart.subtotal') || 'Subtotal'}</span>
                    <span className="font-serif text-ivory-900">{formatPrice(total)}</span>
                  </div>
                  
                  <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-ivory-600 font-sans">{t('checkout.delivery_fee') || 'Delivery Fee'}</span>
                    <span className="font-serif text-ivory-900">
                      {selectedCity ? formatPrice(deliveryFee) : '-'}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center pt-3 border-t border-ivory-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-serif text-ivory-900">{t('cart.total') || 'Total'}</span>
                    <span className="font-serif text-xl text-burgundy font-bold">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Desktop Submit */}
                <div className="hidden lg:block p-5 border-t border-ivory-200">
                  <button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || items.length === 0}
                    className="w-full bg-ivory-900 text-cream py-4 text-sm uppercase tracking-[0.2em] font-serif hover:bg-ivory-800 transition-all duration-300 disabled:bg-ivory-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('checkout.processing') || 'Processing...'}
                      </span>
                    ) : (
                      t('checkout.place_order') || 'Place Order'
                    )}
                  </button>
                  <p className="text-center text-[10px] text-ivory-400 mt-3 font-sans uppercase tracking-wider">
                    {t('checkout.whatsapp_notice') || 'WhatsApp confirmation will be sent'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && invoiceData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-ivory-200 shadow-2xl max-w-md w-full p-6 md:p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="font-display text-2xl text-ivory-900 mb-2">
                {t('checkout.order_confirmed') || 'Order Confirmed!'}
              </h2>
              
              <p className="text-ivory-600 font-sans text-sm mb-6">
                {t('checkout.confirmation_text') || 'Thank you for your order. We have sent a confirmation to your WhatsApp.'}
              </p>

              <div className="bg-ivory-50 border border-ivory-200 p-4 mb-6 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-ivory-500 font-sans">{t('checkout.invoice_number') || 'Invoice #'}</span>
                  <span className="font-serif font-bold text-ivory-900">{invoiceData.invoice_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ivory-500 font-sans">{t('checkout.amount') || 'Amount'}</span>
                  <span className="font-serif text-burgundy">{parseFloat(invoiceData.total).toFixed(2)} LYD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ivory-500 font-sans">{t('checkout.phone') || 'Phone'}</span>
                  <span className="font-sans text-ivory-900" dir="ltr">{invoiceData.client_number}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setLocation("/")}
                  className="w-full bg-ivory-900 text-cream py-3 text-sm uppercase tracking-wider font-serif hover:bg-ivory-800 transition-colors"
                >
                  {t('checkout.continue_shopping') || 'Continue Shopping'}
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="w-full border border-ivory-300 text-ivory-700 py-3 text-sm uppercase tracking-wider font-serif hover:bg-ivory-50 transition-colors"
                >
                  {t('checkout.print') || 'Print Invoice'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}