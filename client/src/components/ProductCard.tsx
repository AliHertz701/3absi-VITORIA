import { Link } from "wouter";
import { motion } from "framer-motion";
import type { Product } from "@/api";
import { useCart } from "@/hooks/use-cart";
import { resolveMediaUrl } from "@/api";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { getColorCode, getColorDisplayName, isPatternColor } from "@/lib/colors";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t } = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Variant selection state
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.color?.[0]
  );
  const [showVariants, setShowVariants] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // --- MEDIA HANDLING ---
  let mediaUrls: string[] = [];
  
  if (product.video) {
    mediaUrls.push(resolveMediaUrl(product.video));
  }
  
  if (product.image) {
    if (Array.isArray(product.image)) {
      mediaUrls.push(...product.image.map(img => resolveMediaUrl(img)));
    } else if (typeof product.image === "string" && product.image.trim() !== "") {
      mediaUrls.push(resolveMediaUrl(product.image));
    }
  }
  
  if (product.additional_images?.length) {
    mediaUrls.push(...product.additional_images.map(img => resolveMediaUrl(img)));
  }
  
  if (mediaUrls.length === 0) {
    mediaUrls = ["https://via.placeholder.com/400x500?text=No+Image"];
  }

  const hasVideo = product.video && mediaUrls[0] === resolveMediaUrl(product.video);
  const hasDiscount = !!product.discount_percentage && product.discount_percentage > 0;
  const finalPrice = hasDiscount && product.price
    ? product.price - (product.price * (product.discount_percentage / 100))
    : product.price;

  // --- AUTO-SWIPE LOGIC ---
  useEffect(() => {
    if (isHovering && mediaUrls.length > 1 && !showVideo) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % mediaUrls.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, mediaUrls.length, showVideo]);

  // --- VIDEO HANDLING ---
  useEffect(() => {
    if (showVideo && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(e => console.log("Autoplay prevented:", e));
      
      const timeout = setTimeout(() => {
        setShowVideo(false);
        setVideoLoaded(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      };
    }
  }, [showVideo]);

  const handleMediaClick = (e: React.MouseEvent) => {
    if (hasVideo && !showVideo) {
      e.preventDefault();
      setShowVideo(true);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has variants but none selected, show selector
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.color && product.color.length > 0;
    
    if ((hasSizes && !selectedSize) || (hasColors && !selectedColor)) {
      setShowVariants(true);
      return;
    }
    
    // Add to cart with selected variants
    addToCart(product, selectedSize, selectedColor);
    setShowVariants(false);
  };

  const hasVariants = (product.sizes && product.sizes.length > 0) || 
                      (product.color && product.color.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group cursor-pointer bg-white border border-ivory-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0);
        setShowVideo(false);
        setVideoLoaded(false);
        // Don't hide variants on mouse leave to allow selection
      }}
    >
      <Link href={`/product/${product.id}`}>
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-ivory-50"
          onClick={handleMediaClick}
        >
          {/* VIDEO PLAYER */}
          {hasVideo && showVideo ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                loop={false}
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
              >
                <source src={mediaUrls[0]} type="video/mp4" />
              </video>
              {!videoLoaded && (
                <div className="absolute inset-0 bg-ivory-100 animate-pulse" />
              )}
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black/30 backdrop-blur-sm text-cream text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-sm font-serif tracking-wide">
                {t('product.video_preview')}
              </div>
            </div>
          ) : (
            <>
              {/* IMAGE SLIDESHOW */}
              {mediaUrls.slice(hasVideo ? 1 : 0).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} - ${t('product.view')} ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                />
              ))}

              {/* VIDEO PLAY BUTTON */}
              {hasVideo && !showVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/10 to-transparent">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-cream/20 backdrop-blur-md border border-cream/30 rounded-full p-2 md:p-4"
                  >
                    <svg
                      className="w-4 h-4 md:w-6 md:h-6 text-ivory-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:via-black/5 group-hover:to-black/10 transition-all duration-700" />
            </>
          )}

          {/* IMAGE COUNTER */}
          {!showVideo && mediaUrls.length > (hasVideo ? 2 : 1) && (
            <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 md:gap-1.5">
              {mediaUrls.slice(hasVideo ? 1 : 0).map((_, index) => (
                <button
                  key={index}
                  className={`transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-4 md:w-8 bg-ivory-900' 
                      : 'w-1 md:w-1.5 bg-ivory-900/30 hover:bg-ivory-900/50'
                  } h-0.5`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`${t('product.go_to_image')} ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* BADGES */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 flex justify-between">
            {/* LEFT BADGES */}
            <div className="flex flex-col gap-1 md:gap-2 items-start">
              {product.isFeatured && (
                <div className="bg-ivory-900/95 text-cream text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] px-2 py-1 md:px-3 md:py-1.5 font-serif italic border border-cream/20 shadow-sm md:shadow-lg leading-none">
                  {t('product.heritage_piece')}
                </div>
              )}
              {hasVideo && !showVideo && (
                <div className="bg-ivory-700/90 text-cream text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] px-2 py-1 md:px-3 md:py-1.5 font-serif border border-cream/20 leading-none">
                  {t('product.video_preview_badge')}
                </div>
              )}
            </div>

            {/* RIGHT BADGES */}
            <div className="flex flex-col gap-1 md:gap-2 items-end">
              {product.is_new_arrival && (
                <div className="bg-gradient-to-r from-ivory-800 to-ivory-900 text-cream text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] px-2 py-1 md:px-4 md:py-1.5 font-serif border border-cream/20 shadow-sm md:shadow-lg leading-none">
                  {t('product.new_arrival')}
                </div>
              )}
              {hasDiscount && (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-burgundy/95 text-cream text-[9px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.15em] px-2 py-1 md:px-4 md:py-2 font-serif border border-cream/20 shadow-sm md:shadow-lg leading-none"
                >
                  {t('product.save_percentage', { percent: Math.round(product.discount_percentage || 0).toString() })}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* PRODUCT INFO */}
      <div className="p-3 md:p-5 border-t border-ivory-100 bg-gradient-to-b from-white to-ivory-50/50">
        <div className="text-center space-y-2 md:space-y-3">
          {/* PRODUCT NAME */}
          <h3 className="font-serif text-sm md:text-lg text-ivory-900 tracking-wide group-hover:text-burgundy transition-colors duration-300 leading-tight line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>

          {/* ERA & CATEGORY */}
          <div className="hidden sm:flex flex-col gap-1">
            {product.era && (
              <p className="font-serif text-xs md:text-sm text-ivory-700 italic">
                {t('product.era')}: {product.era}
              </p>
            )}
            {product.category && (
              <p className="font-sans text-[10px] md:text-xs text-ivory-600 uppercase tracking-wider">
                {t('product.category')}: {product.category}
              </p>
            )}
          </div>

          {/* DETAILS WITH CLEAR LABELS */}
          <div className="space-y-1 md:space-y-2 pt-1 md:pt-2">
            {product.brand && (
              <div className="flex items-center justify-center gap-1 md:gap-2">
                <span className="hidden sm:inline font-sans text-[10px] md:text-xs text-ivory-500 uppercase tracking-wider">
                  {t('product.brand')}:
                </span>
                <span className="font-medium text-xs md:text-base text-ivory-700 truncate max-w-[100px] sm:max-w-none">
                  {product.brand}
                </span>
              </div>
            )}

            {product.material && (
              <div className="hidden sm:flex items-center justify-center gap-2">
                <span className="font-sans text-[10px] md:text-xs text-ivory-500 uppercase tracking-wider">
                  {t('product.material')}:
                </span>
                <span className="font-medium text-xs md:text-base text-ivory-700">
                  {product.material}
                </span>
              </div>
            )}
          </div>

          {/* VARIANT SELECTION UI */}
          {showVariants && hasVariants && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="py-3 space-y-3 bg-ivory-50/50 -mx-3 px-3 md:-mx-5 md:px-5 border-y border-ivory-200"
            >
              {/* SIZE SELECTION */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="text-[9px] md:text-[10px] uppercase tracking-wider text-ivory-600 block mb-2">
                    {t('product.select_size') || 'Select Size'}
                  </label>
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={`px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs border transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-ivory-900 text-cream border-ivory-900 shadow-md'
                            : 'bg-white text-ivory-700 border-ivory-300 hover:border-ivory-500 hover:bg-ivory-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COLOR SELECTION */}
              {product.color && product.color.length > 0 && (
                <div>
                  <label className="text-[9px] md:text-[10px] uppercase tracking-wider text-ivory-600 block mb-2">
                    {t('product.select_color') || 'Select Color'}
                  </label>
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    {product.color.map((color) => {
                      const colorCode = getColorCode(color);
                      const isPattern = isPatternColor(color);
                      const translationKey = getColorDisplayName(color);
                      
                      return (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedColor(color);
                          }}
                          className="relative group"
                          title={t(translationKey)}
                          aria-label={t(translationKey)}
                        >
                          {/* Color Circle */}
                          <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-200 ${
                              selectedColor === color
                                ? 'border-ivory-900 scale-110 shadow-md'
                                : 'border-ivory-300 hover:border-ivory-500 hover:scale-105'
                            }`}
                            style={{
                              background: colorCode,
                              backgroundSize: isPattern ? 'cover' : 'auto'
                            }}
                          />
                          
                          {/* Selection Indicator */}
                          {selectedColor === color && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-ivory-900 rounded-full border-2 border-cream flex items-center justify-center">
                              <svg className="w-2 h-2 md:w-2.5 md:h-2.5 text-cream" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-ivory-900 text-cream text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                            {t(translationKey)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CONFIRM SELECTION BUTTON (Mobile optimization) */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-2 bg-ivory-800 text-cream py-2 text-[10px] uppercase tracking-wider hover:bg-ivory-900 transition-colors md:hidden"
              >
                {t('product.confirm_selection') || 'Confirm Selection'}
              </button>
            </motion.div>
          )}

          {/* AVAILABLE SIZES DISPLAY (When not selecting) */}
          {!showVariants && product.sizes?.length > 0 && (
            <div className="pt-2 md:pt-3 border-t border-ivory-200">
              <p className="font-sans text-[9px] md:text-xs text-ivory-500 uppercase tracking-wider mb-1 md:mb-2 hidden sm:block">
                {t('product.available_sizes')}:
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {product.sizes.slice(0, 4).map((size) => (
                  <span 
                    key={size}
                    className="inline-block px-1.5 py-0.5 text-[9px] md:text-xs border border-ivory-300 text-ivory-700 bg-ivory-50/50 rounded-sm leading-none"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="inline-block text-[9px] text-ivory-500 leading-none self-center">
                    +{product.sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AVAILABLE COLORS DISPLAY (When not selecting) */}
          {!showVariants && product.color?.length > 0 && (
            <div className="pt-2 md:pt-3 border-t border-ivory-200">
              <p className="font-sans text-[10px] md:text-xs text-ivory-500 uppercase tracking-wider mb-2 md:mb-3 text-center">
                {t('product.available_colors')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {product.color.map((color) => {
                  const colorCode = getColorCode(color);
                  const isPattern = isPatternColor(color);
                  const translationKey = getColorDisplayName(color);
                  
                  return (
                    <div
                      key={color}
                      className="relative group"
                      title={t(translationKey)}
                      aria-label={t(translationKey)}
                    >
                      {/* Color Circle */}
                      <div
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-ivory-300 hover:border-ivory-400 transition-colors"
                        style={{
                          background: colorCode,
                          backgroundSize: isPattern ? 'cover' : 'auto'
                        }}
                      />
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-ivory-900 text-cream text-[8px] md:text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                        {t(translationKey)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRICE */}
          {product.show_price && product.price !== undefined && (
            <div className="pt-2 md:pt-4 font-serif border-t border-ivory-200">
              {hasDiscount && (
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1">
                  <span className="text-[10px] md:text-xs text-ivory-500 line-through">
                    LYD {product.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] md:text-xs text-burgundy font-sans font-medium">
                    {t('product.save_amount', { amount: (product.price - (finalPrice || 0)).toFixed(2) })}
                  </span>
                </div>
              )}
              <div className="text-base md:text-lg text-ivory-900 tracking-wide font-medium">
                LYD {finalPrice?.toFixed(2)}
                {hasDiscount && (
                  <span className="ml-1 md:ml-2 text-[10px] md:text-xs text-burgundy font-sans font-medium">
                    ({Math.round(product.discount_percentage || 0)}%)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ADD TO CART BUTTON */}
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-ivory-200">
          {product.can_order && product.in_stock ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-ivory-800 to-ivory-900 hover:from-ivory-900 hover:to-ivory-950 text-cream py-2 md:py-3 text-[10px] md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all duration-300 font-serif border border-ivory-700/30 shadow-sm md:shadow-md hover:shadow-md md:hover:shadow-lg"
            >
              <span className="hidden sm:inline">
                {showVariants ? (t('product.add_selected') || 'Add Selection') : t('product.add_to_collection')}
              </span>
              <span className="sm:hidden">
                {showVariants ? (t('product.confirm') || 'Done') : (t('product.add_to_collection') || 'Add')}
              </span>
            </motion.button>
          ) : (
            <button
              disabled
              className="w-full bg-ivory-200 text-ivory-500 py-2 md:py-3 text-[10px] md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em] font-serif border border-ivory-300 cursor-not-allowed"
            >
              <span className="hidden sm:inline">
                {product.in_stock === false 
                  ? t('product.out_of_stock')
                  : t('product.by_appointment')
                }
              </span>
              <span className="sm:hidden">
                {product.in_stock === false 
                  ? (t('product.out_of_stock_short') || t('product.out_of_stock'))
                  : (t('product.appointment_short') || t('product.by_appointment'))
                }
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}