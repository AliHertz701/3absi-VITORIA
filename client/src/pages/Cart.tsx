// Cart.tsx - Updated with localization
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Trash2, ArrowRight, Plus, Minus, ChevronLeft, Package, Shield, Truck, Edit2 } from "lucide-react";
import { resolveMediaUrl } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

// Variant Selector Component
function VariantSelector({ 
  item, 
  onUpdate 
}: { 
  item: import("@/hooks/use-cart").CartItem; 
  onUpdate: (size?: string, color?: string) => void;
}) {
  const { t, isRTL } = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [tempSize, setTempSize] = useState(item.selectedSize);
  const [tempColor, setTempColor] = useState(item.selectedColor);

  const handleSave = () => {
    onUpdate(tempSize, tempColor);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {item.selectedSize && (
          <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-ivory-100 text-ivory-700 border border-ivory-200">
            {t('cart.item.size', { size: item.selectedSize })}
          </span>
        )}
        {item.selectedColor && (
          <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-ivory-100 text-ivory-700 border border-ivory-200">
            {t('cart.item.color', { color: item.selectedColor })}
          </span>
        )}
        <button 
          onClick={() => setIsEditing(true)}
          className="text-ivory-400 hover:text-burgundy transition-colors"
          title={t('cart.item.editVariant')}
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 p-3 bg-ivory-50 border border-ivory-200 rounded-sm">
      <div className="space-y-3">
        {item.product.sizes && item.product.sizes.length > 0 && (
          <div>
            <label className="text-xs uppercase tracking-wider text-ivory-600 block mb-1">
              {t('cart.item.selectSize')}
            </label>
            <select 
              value={tempSize || ''} 
              onChange={(e) => setTempSize(e.target.value || undefined)}
              className="w-full text-sm border border-ivory-300 bg-white px-2 py-1.5 focus:outline-none focus:border-ivory-500"
            >
              <option value="">{t('cart.item.selectSize')}</option>
              {item.product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        
        {item.product.color && item.product.color.length > 0 && (
          <div>
            <label className="text-xs uppercase tracking-wider text-ivory-600 block mb-1">
              {t('cart.item.selectColor')}
            </label>
            <select 
              value={tempColor || ''} 
              onChange={(e) => setTempColor(e.target.value || undefined)}
              className="w-full text-sm border border-ivory-300 bg-white px-2 py-1.5 focus:outline-none focus:border-ivory-500"
            >
              <option value="">{t('cart.item.selectColor')}</option>
              {item.product.color.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            className="flex-1 bg-ivory-800 text-cream text-xs uppercase tracking-wider py-2 hover:bg-ivory-900 transition-colors"
          >
            {t('cart.item.update')}
          </button>
          <button 
            onClick={() => {
              setTempSize(item.selectedSize);
              setTempColor(item.selectedColor);
              setIsEditing(false);
            }}
            className="flex-1 border border-ivory-300 text-ivory-700 text-xs uppercase tracking-wider py-2 hover:bg-ivory-100 transition-colors"
          >
            {t('cart.item.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity, updateVariant, total, uniqueProductCount } = useCart();
  const { t, isRTL } = useLocale();

  // Calculate totals
  const subtotal = total;
  const shipping = items.length > 0 ? (subtotal > 1500 ? 0 : 25) : 0;
  const finalTotal = subtotal + shipping;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-ivory-50 to-cream/30 flex flex-col ${isRTL ? 'rtl' : ''}`}>
      <Navigation />

      <div className="flex-1 pt-28 pb-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={`mb-10 md:mb-16 ${isRTL ? 'rtl-text' : ''}`}>
            <Link href="/shop" className={`inline-flex items-center text-ivory-600 hover:text-burgundy transition-colors mb-6 group ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isRTL ? (
                <>
                  <span className="text-sm tracking-widest uppercase">{t('cart.continueShopping')}</span>
                  <ChevronLeft className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform rotate-180" />
                </>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm tracking-widest uppercase">{t('cart.continueShopping')}</span>
                </>
              )}
            </Link>
            
            <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : 'md:items-end justify-between'} gap-4`}>
              <div className={isRTL ? 'text-right' : ''}>
                <h1 className={`font-serif text-3xl md:text-4xl text-ivory-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('cart.header.title')}
                </h1>
                <p className="text-ivory-600 font-sans text-sm tracking-wide">
                  {t('cart.header.subtitle', { 
                    count: uniqueProductCount.toString(),
                    plural: ''
                  })}
                </p>
              </div>
              
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'space-x-4'}`}>
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="text-xs uppercase tracking-wider text-ivory-500">
                    {t('cart.header.items')}
                  </p>
                  <p className="font-serif text-lg text-ivory-900">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                <div className="w-px h-8 bg-ivory-300" />
                <div className={isRTL ? 'text-left' : 'text-right'}>
                  <p className="text-xs uppercase tracking-wider text-ivory-500">
                    {t('cart.header.total')}
                  </p>
                  <p className="font-serif text-lg text-burgundy"> LYD {finalTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`text-center py-16 md:py-24 bg-white/70 border border-ivory-200 shadow-sm ${isRTL ? 'rtl-text' : ''}`}
              >
                <div className="max-w-md mx-auto px-4">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ivory-100 flex items-center justify-center">
                    <Package className="w-8 h-8 text-ivory-400" />
                  </div>
                  <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('cart.empty.title')}
                  </h3>
                  <p className="text-ivory-600 font-sans mb-8 leading-relaxed">
                    {t('cart.empty.description')}
                  </p>
                  <Link href="/shop">
                    <button className="bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg">
                      {t('cart.empty.browse')}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row gap-8"
              >
                {/* Cart Items */}
                <div className="flex-1 space-y-6">
                  <div className={`hidden md:grid grid-cols-12 gap-4 px-4 pb-4 border-b border-ivory-300 text-xs uppercase tracking-wider text-ivory-500 ${isRTL ? 'rtl-text' : ''}`}>
                    <div className="col-span-5">{isRTL ? 'القطعة' : 'Item'}</div>
                    <div className="col-span-2 text-center">{isRTL ? 'المتغيرات' : 'Variant'}</div>
                    <div className="col-span-2 text-center">{t('cart.item.quantity')}</div>
                    <div className="col-span-2 text-center">{t('cart.item.price')}</div>
                    <div className="col-span-1" />
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => {
                      const product = item.product;
                      const imageUrl = resolveMediaUrl(product.image || "");
                      
                      const discountedPrice = product.price -
                        ((product.discount_percentage || 0) * product.price) / 100;
                      
                      const itemTotal = discountedPrice * item.quantity;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                          className="bg-white border border-ivory-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="p-4 md:p-6">
                            <div className={`flex flex-col md:grid md:grid-cols-12 gap-6 items-start md:items-center ${isRTL ? 'rtl-text' : ''}`}>
                              {/* Product Image & Info */}
                              <div className="md:col-span-5 flex items-center space-x-4 w-full">
                                <div className={`w-24 h-32 md:w-28 md:h-36 flex-shrink-0 bg-ivory-100 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                                  <img
                                    src={imageUrl || "https://via.placeholder.com/400x500?text=No+Image"}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className={`font-serif text-lg text-ivory-900 mb-1 truncate ${isRTL ? 'font-arabic' : ''}`}>
                                    {product.name}
                                  </h3>
                                  <p className={`text-sm text-ivory-600 font-sans mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                                    {product.category}
                                  </p>
                                  
                                  {/* Mobile Variant Info */}
                                  <div className="md:hidden">
                                    <VariantSelector 
                                      item={item} 
                                      onUpdate={(size, color) => updateVariant(item.id, size, color)}
                                    />
                                  </div>

                                  <div className="hidden md:flex flex-wrap gap-2 mt-2">
                                    {product.is_new_arrival && (
                                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-ivory-100 text-ivory-700">
                                        {t('cart.item.newArrival')}
                                      </span>
                                    )}
                                    {product.isFeatured && (
                                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-gold/10 text-gold">
                                        {t('cart.item.heritagePiece')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Variant Info - Desktop */}
                              <div className="hidden md:block md:col-span-2">
                                <VariantSelector 
                                  item={item} 
                                  onUpdate={(size, color) => updateVariant(item.id, size, color)}
                                />
                              </div>

                              {/* Quantity Controls */}
                              <div className="md:col-span-2 w-full md:w-auto">
                                <div className={`md:hidden text-xs uppercase tracking-wider text-ivory-500 mb-2 ${isRTL ? 'text-right' : ''}`}>
                                  {t('cart.item.quantity')}
                                </div>
                                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'md:justify-center space-x-2'}`}>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-ivory-300 text-ivory-600 hover:bg-ivory-100 transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-12 text-center font-serif text-ivory-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-ivory-300 text-ivory-600 hover:bg-ivory-100 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Price */}
                              <div className={`md:col-span-2 ${isRTL ? 'text-right' : 'text-left'} md:text-center w-full md:w-auto flex justify-between md:block`}>
                                <div className={`md:hidden text-xs uppercase tracking-wider text-ivory-500 ${isRTL ? 'text-right' : ''}`}>
                                  {t('cart.item.price')}
                                </div>
                                <div className="font-serif text-ivory-900">
                                  {product.show_price ? (
                                    <div>
                                      <div className="text-lg">LYD. {itemTotal.toFixed(2)}</div>
                                      {item.quantity > 1 && (
                                        <div className="text-xs text-ivory-500">
                                          {t('cart.item.each', { price: discountedPrice.toFixed(2) })}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-ivory-500 italic">{t('cart.item.byRequest')}</span>
                                  )}
                                </div>
                              </div>

                              {/* Remove */}
                              <div className="hidden md:col-span-1 md:flex justify-end">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-ivory-400 hover:text-burgundy transition-colors p-2"
                                  title={t('cart.item.remove')}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Mobile Remove */}
                              <div className="md:hidden absolute top-4 right-4">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-ivory-400 hover:text-burgundy transition-colors p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-96">
                  <div className="sticky top-32 space-y-8">
                    <div className={`bg-white border border-ivory-200 shadow-sm p-6 ${isRTL ? 'rtl-text' : ''}`}>
                      <h3 className={`font-serif text-xl text-ivory-900 mb-6 pb-4 border-b border-ivory-200 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('cart.summary.title')}
                      </h3>
                      
                      <div className="space-y-4">
                        <div className={`flex ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} items-center`}>
                          <span className="text-ivory-600 font-sans">
                            {t('cart.summary.subtotal')}
                          </span>
                          <span className="font-serif text-ivory-900">LYD. {subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className={`flex ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} items-center`}>
                          <div className={isRTL ? 'text-right' : ''}>
                            <span className="text-ivory-600 font-sans">
                              {t('cart.summary.shipping')}
                            </span>
                            {shipping > 0 && (
                              <p className="text-xs text-ivory-500 mt-1">
                                {t('cart.summary.shippingNote')}
                              </p>
                            )}
                          </div>
                          <span className="font-serif">
                            {shipping === 0 ? (
                              <span className="text-green-600">{isRTL ? 'مجانًا' : 'Free'}</span>
                            ) : (
                              `LYD. ${shipping.toFixed(2)}`
                            )}
                          </span>
                        </div>
                        
                        {items.some(item => item.product.discount_percentage) && (
                          <div className={`flex ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} items-center text-burgundy`}>
                            
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-ivory-300">
                          <div className={`flex ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} items-center`}>
                            <span className="font-serif text-lg text-ivory-900">
                              {t('cart.summary.total')}
                            </span>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <div className="font-serif text-2xl text-burgundy">LYD. {finalTotal.toFixed(2)}</div>
                              {shipping > 0 && (
                                <p className="text-xs text-ivory-500 mt-1">
                                  + LYD. {shipping.toFixed(2)} {isRTL ? 'شحن' : 'shipping'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Link href="/checkout" className="block mt-8">
                        <button className={`w-full bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream py-4 text-sm uppercase tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-md hover:shadow-lg flex items-center justify-center group ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span>{t('cart.summary.checkout')}</span>
                          {isRTL ? (
                            <ArrowRight className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform rotate-180" />
                          ) : (
                            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                          )}
                        </button>
                      </Link>
                      
                      {/* Variant Warning */}
                      {items.some(item => !item.selectedSize && item.product.sizes?.length > 0) && (
                        <p className="mt-4 text-xs text-burgundy text-center">
                          {t('cart.summary.variantWarning')}
                        </p>
                      )}
                    </div>

                    {/* Trust & Services */}
                    <div className="space-y-4">
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-3'} text-ivory-600`}>
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-sans">
                          {t('cart.trust.authenticity')}
                        </span>
                      </div>
                      <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-3'} text-ivory-600`}>
                        <Truck className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-sans">
                          {t('cart.trust.delivery')}
                        </span>
                      </div>
                      <div className={`text-xs text-ivory-500 font-sans leading-relaxed pt-4 border-t border-ivory-200 ${isRTL ? 'font-arabic leading-loose' : ''}`}>
                        {t('cart.trust.note')}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
}