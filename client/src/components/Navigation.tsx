import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu, X, ChevronRight,Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveMediaUrl } from "@/api";
import { useLocale } from "@/contexts/LocaleContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getColorDisplayName } from "@/lib/colors";
interface Category {
  id: number;
  name: string;
  slug: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export function Navigation() {
  const [location] = useLocation();
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { t, isRTL } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories for mobile menu
  useEffect(() => {
    setLoadingCategories(true);
    fetch(`${API_URL}/categories/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: Category[]) => setCategories(data))
      .catch(err => console.error("Error fetching nav categories:", err))
      .finally(() => setLoadingCategories(false));
  }, []);

  const navLinks = [
    { href: "/shop", label: t('nav.shop') },
    { href: "/about", label: t('nav.heritage') },
  ];

  const LinkItem = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => (
    <Link 
      href={href} 
      className={`
        text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300
        ${location === href ? "text-gold font-medium" : "text-foreground/80"}
        ${mobile ? "text-lg py-2" : ""}
        ${isRTL ? 'font-arabic' : ''}
      `}
      onClick={() => mobile && setIsOpen(false)}
    >
      {label}
    </Link>
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = items.length > 0 ? (total > 1500 ? 0 : 25) : 0;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 ${
        isRTL ? 'font-arabic' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Menu className="w-6 h-6 text-foreground" />
            </SheetTrigger>
            <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] bg-background border-border overflow-y-auto">
              <div className="flex flex-col space-y-6 mt-8">
                
                {/* Main Links */}
                <div className="space-y-3">
                  <Link 
                    href="/" 
                    className="block text-2xl font-display text-foreground hover:text-gold transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.home') || 'Home'}
                  </Link>
                  <Link 
                    href="/shop" 
                    className="block text-lg text-foreground/80 hover:text-gold transition-colors uppercase tracking-widest"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.shop_all') || 'Shop All'}
                  </Link>
                </div>

                {/* Categories Section */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-sans">
                    {t('nav.categories') || 'Categories'}
                  </h3>
                  
                  {loadingCategories ? (
                    <div className="py-4 flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{t('loading') || 'Loading...'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-1">
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="text-sm text-foreground/70 hover:text-foreground hover:bg-accent/50 py-2 px-2 rounded transition-colors capitalize font-sans"
                          onClick={() => setIsOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Other Links */}
                <div className="pt-6 border-t border-border space-y-3">
                  <LinkItem href="/about" label={t('nav.about') || 'About Us'} mobile />
                  <LinkItem href="/contact" label={t('nav.contact') || 'Contact'} mobile />
                </div>

                {/* Language Switcher */}
                <div className="pt-6 border-t border-border">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Left Links */}
        <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          {navLinks.map(link => (
            <LinkItem key={link.href} {...link} />
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className={`absolute left-1/2 -translate-x-1/2 group ${isRTL ? 'font-arabic' : ''}`}>
          <div className="text-center cursor-pointer">
            <h1 className="font-display text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-gold transition-colors duration-500">
              VITORIA
            </h1>
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mt-1">
              {t('nav.est')}
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <button className="hidden md:block hover:text-gold transition-colors" title={t('nav.search')}>
            <Search className="w-5 h-5" />
          </button>
          
          {/* Cart with Sidebar */}
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <button className="relative hover:text-gold transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent 
              side={isRTL ? "left" : "right"} 
              className="w-full sm:w-[440px] p-0 bg-gradient-to-b from-white to-ivory-50/30 border-l border-ivory-200"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Cart content remains the same... */}
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-ivory-200 bg-white">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <h2 className="font-serif text-2xl text-ivory-900">{t('cart.title') || 'Your Collection'}</h2>
                      <p className="text-sm text-ivory-600 font-sans mt-1">
                        {itemCount === 0 
                          ? t('cart.empty') || 'Your cart is empty' 
                          : `${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'} selected`
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-ivory-400 hover:text-ivory-900 transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ivory-100 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-ivory-400" />
                        </div>
                        <h3 className="font-serif text-lg text-ivory-900 mb-2">
                          {t('cart.empty.title') || 'Your Collection Awaits'}
                        </h3>
                        <p className="text-ivory-600 text-sm mb-6 font-sans">
                          {t('cart.empty.description') || 'Discover rare heritage pieces curated just for you.'}
                        </p>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            window.location.href = '/shop';
                          }}
                          className="bg-ivory-900 text-cream px-6 py-2.5 text-sm uppercase tracking-[0.2em] font-serif hover:bg-ivory-800 transition-colors"
                        >
                          {t('cart.empty.browse') || 'Explore Archive'}
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
{items.map((item) => {
  const product = item.product;
  const imageUrl = resolveMediaUrl(product.image || "");
  const discountedPrice = (product.price || 0) - 
    ((product.discount_percentage || 0) * (product.price || 0)) / 100;
  const itemTotal = discountedPrice * item.quantity;

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-ivory-200 p-4 shadow-sm"
    >
      <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-20 h-24 flex-shrink-0 bg-ivory-100">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right pr-2' : 'pr-2'}>
              <h4 className="font-serif text-base text-ivory-900 line-clamp-1">{product.name}</h4>
              <p className="text-xs text-ivory-600 font-sans mt-1">{product.brand || 'Timeless'}</p>
              {(item.selectedSize || item.selectedColor) && (
                <div className={`flex flex-wrap gap-2 mt-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  {item.selectedSize && (
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase bg-ivory-100 text-ivory-700 border border-ivory-200">
                      {isRTL ? `${item.selectedSize} :${t('product.size')}` : `${t('product.size')}: ${item.selectedSize}`}
                    </span>
                  )}
                  {item.selectedColor && (
                    <span className="inline-block px-2 py-0.5 text-[10px] uppercase bg-ivory-100 text-ivory-700 border border-ivory-200">
                      {isRTL 
                        ? `${t(getColorDisplayName(item.selectedColor))} :${t('product.color')}` 
                        : `${t('product.color')}: ${t(getColorDisplayName(item.selectedColor))}`
                      }
                    </span>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-ivory-300 hover:text-burgundy ml-2 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center border border-ivory-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center text-ivory-600 hover:bg-ivory-100 disabled:opacity-50">
                <span className="text-xs">−</span>
              </button>
              <span className="w-10 text-center font-serif text-sm">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-ivory-600 hover:bg-ivory-100">
                <span className="text-xs">+</span>
              </button>
            </div>
            <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
              <p className="font-serif text-ivory-900">LYD {itemTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
})}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {items.length > 0 && (
                  <div className="border-t border-ivory-200 p-6 bg-white">
                    <div className="space-y-4">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-ivory-600 font-sans text-sm">{t('cart.subtotal') || 'Subtotal'}</span>
                        <span className="font-serif text-lg">LYD {total.toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-ivory-600 font-sans text-sm">{t('cart.shipping') || 'Shipping'}</span>
                        <span className="font-serif">{shipping === 0 ? <span className="text-green-600 text-sm">Free</span> : `LYD ${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className={`flex justify-between pt-3 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-serif text-ivory-900">{t('cart.total') || 'Total'}</span>
                        <span className="font-serif text-xl text-burgundy">LYD {(total + shipping).toFixed(2)}</span>
                      </div>
                      <div className="space-y-3 pt-2">
                        <Link href="/cart">
                          <button onClick={() => setIsCartOpen(false)} className="w-full bg-ivory-900 text-cream py-3.5 text-sm uppercase tracking-wider font-serif border hover:bg-ivory-800 transition-all flex items-center justify-center gap-2">
                            {t('cart.view') || 'View Collection'} <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                          </button>
                        </Link>
                      </div>
                      <div className="text-center pt-2">
                        <button onClick={() => setIsCartOpen(false)} className="text-ivory-500 hover:text-ivory-900 text-sm uppercase tracking-wider font-sans">
                          {t('cart.continue') || 'Continue Shopping'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}