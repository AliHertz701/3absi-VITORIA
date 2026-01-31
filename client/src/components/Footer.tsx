import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { Loader2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export function Footer() {
  const { t, isRTL } = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    fetch(`${API_URL}/categories/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch(err => {
        console.error("Error fetching footer categories:", err);
        setCategories([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter logic here
    alert(t('footer.newsletter_success') || 'Thank you for subscribing!');
  };

  return (
    <footer className="bg-ivory-900 text-cream py-16 px-4 sm:px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <h3 className="font-display text-2xl text-cream">
            {t('footer.brand') || 'VITORIA'}
          </h3>
          <p className="text-cream/60 text-sm leading-relaxed max-w-xs font-sans">
            {t('footer.description') || "Curating the finest heritage garments from history's most elegant eras. Each piece tells a story of craftsmanship and timeless beauty."}
          </p>
        </div>
        
        {/* Shop Links - Dynamic Categories */}
        <div>
          <h4 className="font-display text-lg mb-4 text-gold">
            {t('footer.shop') || 'Shop'}
          </h4>
          {isLoading ? (
            <div className="flex items-center gap-2 text-cream/60 text-sm">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="font-sans text-xs">{t('loading') || 'Loading...'}</span>
            </div>
          ) : (
            <ul className="space-y-2 text-sm text-cream/60">
              <li>
                <Link 
                  href="/shop" 
                  className="hover:text-cream transition-colors duration-300 font-sans"
                >
                  {t('footer.all_collections') || 'All Collections'}
                </Link>
              </li>
              {categories.slice(0, 5).map((category) => (
                <li key={category.name}>
                  <Link 
                    href={`/shop?category=${category.name}`} 
                    className="hover:text-cream transition-colors duration-300 font-sans capitalize"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length > 5 && (
                <li>
                  <Link 
                    href="/shop" 
                    className="text-gold hover:text-cream transition-colors duration-300 font-sans text-xs uppercase tracking-wider"
                  >
                    {t('footer.view_all') || 'View All →'}
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Client Service */}
        <div>
          <h4 className="font-display text-lg mb-4 text-gold">
            {t('footer.service') || 'Client Service'}
          </h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>
              <a href="/contact" className="hover:text-cream transition-colors duration-300 font-sans">
                {t('footer.contact') || 'Contact Us'}
              </a>
            </li>


            <li>
              <a href="/faq" className="hover:text-cream transition-colors duration-300 font-sans">
                {t('footer.faq') || 'FAQ'}
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-display text-lg mb-4 text-gold">
            {t('footer.newsletter') || 'Newsletter'}
          </h4>
          <p className="text-xs text-cream/60 mb-4 font-sans leading-relaxed">
            {t('footer.newsletter_desc') || 'Subscribe to receive updates on new acquisitions and exclusive offers.'}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex border-b border-cream/20 pb-2">
            <input 
              type="email" 
              placeholder={t('footer.email_placeholder') || 'Email Address'} 
              className="bg-transparent border-none outline-none text-cream text-sm w-full placeholder:text-cream/30 font-sans"
              required
            />
            <button 
              type="submit"
              className="text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 font-sans whitespace-nowrap"
            >
              {t('footer.join') || 'Join'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Bottom Bar */}
      {/* Bottom Bar */}
<div className="max-w-7xl mx-auto mt-12 lg:mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center text-xs text-cream/40 gap-4">
  <p className="font-sans text-center md:text-left">
    &copy; {new Date().getFullYear()} {t('footer.brand') || 'VITORIA'}. {t('footer.rights') || 'All rights reserved.'}
  </p>



    {/* Powered by Sitex */}
    <a
      href="https://sitex.com.ly"
      target="_blank"
      rel="noopener noreferrer"
      className="text-cream/50 font-sans hover:text-cream transition-colors"
    >
      {t('footer.powered_by') || 'Powered by Sitex'}
    </a>
  </div>


    </footer>
  );
}