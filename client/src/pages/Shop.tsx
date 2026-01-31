import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { ShopProductCard } from "@/components/ShopProductCard";
import { Check, ArrowRight } from "lucide-react";
import type { Product } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearch } from "wouter";
import { useLocale } from "@/contexts/LocaleContext";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image_url?: string;
}

export default function Shop() {
  const { t, isRTL } = useLocale();
  const search = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/products/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsLoadingCategories(true);
    fetch(`${API_URL}/categories/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      })
      .finally(() => setIsLoadingCategories(false));
  }, []);

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== null) {
      const productCat = String(p.category || '').toLowerCase();
      const selectedCat = selectedCategory.toLowerCase();
      if (productCat !== selectedCat) return false;
    }
    if (selectedEra && p.era !== selectedEra) return false;
    return true;
  });

  const FilterButton = ({ 
    active, 
    onClick, 
    label, 
    count 
  }: { 
    active: boolean; 
    onClick: () => void; 
    label: string;
    count?: number;
  }) => (
    <button
      onClick={onClick}
      className={`
        text-sm text-left py-2.5 px-3 flex items-center justify-between w-full transition-all duration-300 rounded-sm
        ${active 
          ? "bg-ivory-200 text-ivory-900 font-medium border-l-2 border-burgundy" 
          : "text-ivory-600 hover:text-ivory-900 hover:bg-ivory-50/50 border-l-2 border-transparent"
        }
        ${isRTL ? 'text-right flex-row-reverse' : ''}
      `}
    >
      <span className="font-sans">{label}</span>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {count !== undefined && (
          <span className="text-xs text-ivory-400 font-sans">({count})</span>
        )}
        {active && <Check className="w-3.5 h-3.5 text-burgundy" />}
      </div>
    </button>
  );

  const getProductCountForCategory = (categoryName: string | null) => {
    if (categoryName === null) return products.length;
    return products.filter(p => {
      const productCat = String(p.category || '').toLowerCase();
      return productCat === categoryName.toLowerCase();
    }).length;
  };

  const getProductCountForEra = (eraName: string | null) => {
    if (!eraName) return products.length;
    return products.filter(p => p.era === eraName).length;
  };

  return (
    <div className={`min-h-screen bg-texture-paper flex flex-col ${isRTL ? 'rtl' : ''}`}>
      <Navigation />
      
      <div className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-12 md:mb-16 max-w-3xl mx-auto ${isRTL ? 'rtl-text' : ''}`}
        >
          <span className="text-gold text-2xl font-display block mb-4">❦</span>
          <h1 className={`font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t('shop.title')}
          </h1>
          <p className={`text-ivory-600 font-serif italic text-lg leading-relaxed ${isRTL ? 'font-arabic leading-loose' : ''}`}>
            {t('shop.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-32 lg:self-start">
            
            {/* Category Filter */}
            <div className="bg-white/50 border border-ivory-200 p-1">
              <h3 className={`font-display text-lg text-foreground mb-4 pb-3 border-b border-ivory-200 px-2 pt-2 ${isRTL ? 'text-right' : ''}`}>
                {t('shop.filters.category')}
              </h3>
              <div className="space-y-0.5 p-1">
                <FilterButton 
                  active={selectedCategory === null} 
                  onClick={() => setSelectedCategory(null)} 
                  label={t('shop.filters.all_categories')}
                  count={getProductCountForCategory(null)}
                />
                {isLoadingCategories ? (
                  <div className="py-4 text-center">
                    <div className="w-4 h-4 border-2 border-ivory-300 border-t-burgundy rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  categories.map(cat => (
                    <FilterButton 
                      key={cat.id} 
                      active={selectedCategory?.toLowerCase() === cat.name.toLowerCase()} 
                      onClick={() => setSelectedCategory(cat.name)} 
                      label={cat.name}
                      count={getProductCountForCategory(cat.name)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Mobile: Back to Home */}
            <div className="lg:hidden">
              <Link 
                href="/" 
                className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'space-x-2'} text-sm tracking-widest uppercase hover:text-burgundy transition-colors group text-ivory-600`}
              >
                {isRTL ? (
                  <>
                    <span>{t('shop.back_to_home')}</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>{t('shop.back_to_home')}</span>
                  </>
                )}
              </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <div className={`flex ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'} items-center mb-6 md:mb-8`}>
              <p className="text-ivory-600 font-sans text-sm">
                {isLoading ? (
                  t('shop.loading_collection')
                ) : (
                  <>
                    {t('shop.showing')} <span className="font-medium text-ivory-900">{filteredProducts.length}</span> {t('shop.pieces')}
                    {(selectedCategory !== null || selectedEra) && ` ${t('shop.filtered')}`}
                  </>
                )}
              </p>
              
              {(selectedCategory !== null || selectedEra) && (
                <button 
                  onClick={() => { setSelectedCategory(null); setSelectedEra(null); }}
                  className="text-sm text-burgundy hover:text-ivory-900 transition-colors font-sans underline underline-offset-4"
                >
                  {t('shop.clear_filters')}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-ivory-100 animate-pulse aspect-[3/4]" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center py-16 md:py-24 bg-white/70 border border-ivory-200 ${isRTL ? 'rtl-text' : ''}`}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ivory-100 flex items-center justify-center">
                    <span className="text-2xl text-ivory-400">✦</span>
                  </div>
                  <h3 className={`font-serif text-xl text-ivory-900 mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('shop.no_pieces_found')}
                  </h3>
                  <p className="text-ivory-600 font-sans mb-8 px-4">
                    {t('shop.no_pieces_description')}
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory(null); setSelectedEra(null); }}
                    className="bg-gradient-to-r from-ivory-800 to-ivory-900 text-cream px-8 py-3 text-sm uppercase tracking-[0.2em] font-serif border border-ivory-700/30 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {t('shop.view_all_collection')}
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12"
                >
                  {filteredProducts.map(product => (
                    <ShopProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

  
    </div>
  );
}