import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@/api";
import { useCart } from "@/hooks/use-cart";
import { resolveMediaUrl } from "@/api";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { ShoppingBag, Check, X, ChevronDown } from "lucide-react";
import { getColorCode, getColorDisplayName, isPatternColor } from "@/lib/colors";

interface ShopProductCardProps {
  product: Product;
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLocale();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.color?.[0]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);

  // Fix API string numbers
  const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  const discountPercentage = typeof product.discount_percentage === 'string' 
    ? parseFloat(product.discount_percentage) 
    : (product.discount_percentage || 0);
  
  const hasDiscount = discountPercentage > 0;
  const finalPrice = hasDiscount ? price - (price * (discountPercentage / 100)) : price;
  const hasStock = product.quantity_available > 0 && product.place_orders !== false;

  // SAFER Media handling with validation
  const mediaUrls: string[] = [];
  
  if (product.image) {
    if (Array.isArray(product.image)) {
      product.image.forEach(img => {
        const url = resolveMediaUrl(img);
        if (url) mediaUrls.push(url);
      });
    } else if (typeof product.image === "string") {
      const url = resolveMediaUrl(product.image);
      if (url) mediaUrls.push(url);
    }
  }
  
  if (product.additional_images && Array.isArray(product.additional_images)) {
    product.additional_images.forEach(img => {
      const url = resolveMediaUrl(img);
      if (url) mediaUrls.push(url);
    });
  }
  
  if (mediaUrls.length === 0) {
    mediaUrls.push("https://via.placeholder.com/400x500?text=No+Image");
  }

  useEffect(() => {
    if (isHovering && mediaUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
      }, 2500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentImageIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering, mediaUrls.length]);

  const handleAddToCart = () => {
    if (!hasStock) return;
    
    if (product.sizes?.length > 0 && !selectedSize) {
      setShowSizeSelector(true);
      return;
    }
    if (product.color?.length > 0 && !selectedColor) {
      setShowColorSelector(true);
      return;
    }

    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor);
    
    setTimeout(() => setIsAdding(false), 1500);
  };

  // Format price with LYD currency
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LYD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace('LYD', '').trim() + ' LYD';
  };

  // Mobile-friendly variant selectors
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white border border-ivory-200 hover:border-ivory-300 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Section - Reduced height on mobile */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-ivory-50">
        <Link href={`/product/${product.id}`}>
          <div className="relative w-full h-full">
            {mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            ))}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            
            {mediaUrls.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {mediaUrls.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-ivory-900 w-3' : 'bg-ivory-400/60 w-1'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

       {/* Badges - Smaller on mobile */}
<div className="absolute top-2 left-2 flex flex-col gap-1">
  {product.isFeatured && (
    <span className="bg-ivory-900/95 text-gold text-[8px] xs:text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-serif shadow-md">
      {t('product.heritage_piece') || 'Heritage'}
    </span>
  )}
  {product.is_new_arrival && (
    <span className="bg-gold/10 text-gold text-[8px] xs:text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-serif shadow-sm">
      {t('product.new_arrival') || 'New'}
    </span>
  )}
</div>

{hasDiscount && (
  <div className="absolute top-2 right-2 bg-burgundy/90 text-cream text-[9px] uppercase tracking-wider px-1.5 py-1 font-serif shadow-md">
    -{Math.round(discountPercentage)}%
  </div>
)}
</div>

      {/* Content Section - Reduced padding on mobile */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col">
        <div className="mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-sm sm:text-base md:text-lg text-ivory-900 hover:text-burgundy transition-colors line-clamp-2 mb-1 leading-tight">
              {product.name}
            </h3>
          </Link>
          {product.brand && (
            <p className="text-[11px] sm:text-xs text-ivory-500 uppercase tracking-wider font-sans truncate">
              {product.brand}
            </p>
          )}
        </div>

        {/* Product Details Grid - More compact */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs mb-2 text-ivory-600 font-sans">
          {product.era && (
            <div className="truncate">
              <span className="text-ivory-400 uppercase text-[10px] tracking-wider block">
                {t('product.era') || 'Era'}
              </span>
              <span className="font-medium text-ivory-700 truncate block">{product.era}</span>
            </div>
          )}
          {product.material && (
            <div className="truncate">
              <span className="text-ivory-400 uppercase text-[10px] tracking-wider block">
                {t('product.material') || 'Material'}
              </span>
              <span className="font-medium text-ivory-700 truncate block">{product.material}</span>
            </div>
          )}
          {product.category && (
            <div className="truncate">
              <span className="text-ivory-400 uppercase text-[10px] tracking-wider block">
                {t('product.category') || 'Category'}
              </span>
              <span className="font-medium text-ivory-700 truncate block">
                {typeof product.category === 'number' 
                  ? (t('product.collection') || 'Collection') 
                  : String(product.category)}
              </span>
            </div>
          )}
          {product.gender && (
            <div className="truncate">
              <span className="text-ivory-400 uppercase text-[10px] tracking-wider block">
                {t('product.gender') || 'Gender'}
              </span>
              <span className="font-medium text-ivory-700 capitalize truncate block">
                {t(`product.gender.${product.gender}`) || product.gender}
              </span>
            </div>
          )}
        </div>

        {/* Variant Selection Section - Optimized for mobile */}
        <div className="space-y-2 mb-3 flex-1">
          
          {/* Size Selection - Compact dropdown for mobile */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-ivory-500 font-sans">
                  {t('product.size') || 'Size'}
                </label>
                {selectedSize && (
                  <span className="text-[10px] text-burgundy font-medium flex items-center gap-1 px-1.5 py-0.5 bg-burgundy/5 rounded">
                    <Check className="w-2.5 h-2.5" />
                    {selectedSize}
                  </span>
                )}
              </div>
              
              {/* Mobile: Select dropdown */}
              {isMobile && product.sizes.length > 3 ? (
                <div className="relative">
                  <select
                    value={selectedSize || ''}
                    onChange={(e) => setSelectedSize(e.target.value || undefined)}
                    className="w-full text-xs border border-ivory-300 bg-white px-2 py-1.5 pr-6 appearance-none focus:outline-none focus:border-ivory-500 rounded-sm"
                  >
                    <option value="">{t('product.select_size') || 'Select size'}</option>
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-ivory-400 pointer-events-none" />
                </div>
              ) : (
                // Desktop/Tablet: Compact button grid
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[1.75rem] h-6 sm:h-7 px-1 sm:px-1.5 text-[10px] sm:text-xs font-sans border transition-all duration-150 flex items-center justify-center flex-1 ${
                        selectedSize === size
                          ? 'bg-ivory-900 text-cream border-ivory-900 shadow-sm'
                          : 'bg-white text-ivory-700 border-ivory-200 hover:border-ivory-400 hover:bg-ivory-50'
                      }`}
                      title={`${t('product.select_size') || 'Select size'} ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Color Selection - Compact dropdown for mobile */}

{product.color && product.color.length > 0 && (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="text-[10px] uppercase tracking-wider text-ivory-500 font-sans">
        {t('product.color') || 'Color'}
      </label>
      {selectedColor && (
        <span className="text-[10px] text-burgundy font-medium flex items-center gap-1 px-1.5 py-0.5 bg-burgundy/5 rounded capitalize">
          <Check className="w-2.5 h-2.5" />
          {getColorDisplayName(selectedColor)}
        </span>
      )}
    </div>
    
    {/* Always use select dropdown for color selection */}
    <div className="relative">
      <select
        value={selectedColor || ''}
        onChange={(e) => setSelectedColor(e.target.value || undefined)}
        className="w-full text-xs border border-ivory-300 bg-white px-2 py-1.5 pr-8 appearance-none focus:outline-none focus:border-ivory-500 rounded-sm capitalize hover:border-ivory-400 transition-colors duration-200"
      >
        <option value="">{t('product.select_color') || 'Select color'}</option>
        {product.color.map((color) => {
          const colorCode = getColorCode(color);
          const isPattern = isPatternColor(color);
          const displayName = getColorDisplayName(color);
          
          return (
            <option key={color} value={color} className="capitalize">
              {displayName}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-ivory-500 pointer-events-none" />
    </div>
    
    {/* Color preview for selected color */}
    {selectedColor && (
      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-ivory-600">
        <div 
          className="w-4 h-4 rounded-full border border-ivory-300 flex-shrink-0"
          style={{ 
            backgroundColor: isPatternColor(selectedColor) ? undefined : getColorCode(selectedColor),
            backgroundImage: isPatternColor(selectedColor) ? getColorCode(selectedColor) : undefined,
            backgroundSize: isPatternColor(selectedColor) ? 'cover' : undefined
          }}
        />
        <span className="truncate">{getColorDisplayName(selectedColor)}</span>
        <span className="text-[9px] text-ivory-400 ml-auto font-mono truncate">
          {selectedColor}
        </span>
      </div>
    )}
  </div>
)}
          {/* SKU - Smaller on mobile */}

        </div>

        {/* Price Section with LYD - More compact */}
        {product.show_price && (
          <div className="mb-3 pt-2 border-t border-ivory-100">
            {hasDiscount ? (
              <div className="flex flex-col xs:flex-row xs:items-baseline gap-1 xs:gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-lg sm:text-xl text-burgundy font-bold leading-none">
                    {formatPrice(finalPrice)}
                  </span>
                  <span className="text-xs sm:text-sm text-ivory-400 line-through font-sans leading-none">
                    {formatPrice(price)}
                  </span>
                </div>
                <span className="text-[10px] bg-burgundy/10 text-burgundy px-1.5 py-0.5 rounded uppercase tracking-wider font-sans inline-block w-fit">
                  {t('product.save')} {formatPrice(price - finalPrice)}
                </span>
              </div>
            ) : (
              <span className="font-serif text-lg sm:text-xl text-ivory-900 font-bold">
                {formatPrice(price)}
              </span>
            )}
            
            {/* Stock Status - Compact */}
            <div className="mt-1.5 text-[11px] font-sans flex items-center justify-between">
              {hasStock ? (
                <span className="text-green-600 flex items-center gap-1.5 bg-green-50 px-1.5 py-0.5 rounded-sm border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="hidden xs:inline">{t('product.in_stock') || 'In Stock'}</span>
                  <span className="xs:hidden">{t('product.in_stock_short') || 'Available'}</span>
                </span>
              ) : (
                <span className="text-burgundy flex items-center gap-1.5 bg-burgundy/10 px-1.5 py-0.5 rounded-sm border border-burgundy/20">
                  <X className="w-3 h-3" />
                  <span>{t('product.out_of_stock') || 'Out of Stock'}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button - More compact */}
        <motion.button
          whileHover={hasStock && !isAdding ? { scale: 1.02 } : {}}
          whileTap={hasStock && !isAdding ? { scale: 0.98 } : {}}
          onClick={handleAddToCart}
          disabled={!hasStock || isAdding}
          className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm uppercase tracking-[0.1em] font-serif transition-all duration-300 flex items-center justify-center gap-1.5 border ${
            isAdding 
              ? 'bg-green-600 text-white border-green-600 shadow-md' 
              : hasStock
                ? 'bg-ivory-900 text-cream border-ivory-900 hover:bg-ivory-800 hover:shadow-lg active:scale-95'
                : 'bg-ivory-200 text-ivory-500 border-ivory-300 cursor-not-allowed'
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5 animate-bounce" />
              <span className="truncate">{t('product.added') || 'Added'}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {!hasStock 
                  ? (t('product.out_of_stock') || 'Out of Stock')
                  : (product.sizes?.length || product.color?.length)
                    ? (t('product.add_selected') || 'Add Selected')
                    : (t('product.add_to_collection') || 'Add to Collection')
                }
              </span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}