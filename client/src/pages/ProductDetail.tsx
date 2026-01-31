import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { 
  Loader2, ArrowLeft, Check, ShoppingBag, Shield, Package, 
  ChevronLeft, ChevronRight, ChevronDown, Play, Pause,
  Volume2, VolumeX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { resolveMediaUrl } from "@/api";
import type { Product } from "@/api";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getColorDisplayName, getColorCode, isPatternColor } from "@/lib/colors";

interface ProductResponse {
  product: Product & {
    sizes?: string[];
    color?: string[];
    sku?: string;
    season?: string;
    care_instructions?: string;
    is_featured?: boolean;
    is_new_arrival?: boolean;
  };
  similar_products: Array<{
    id: number;
    name: string;
    image: string;
    price: number | string;
    category?: string;
    brand?: string;
  }>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { t, isRTL } = useLocale();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    fetch(`${API_URL}/products/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data: ProductResponse) => {
        setProductData(data);
        if (data.product.sizes?.length) setSelectedSize(data.product.sizes[0]);
        if (data.product.color?.length) setSelectedColor(data.product.color[0]);
        setIsError(false);
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Auto-play video when it's the current media and handle sound
  useEffect(() => {
    if (!productData || !mediaItems[currentMediaIndex]) return;

    const currentMedia = mediaItems[currentMediaIndex];
    
    if (currentMedia.type === 'video' && videoRef.current) {
      // Reset video state
      videoRef.current.currentTime = 0;
      
      // Try to autoplay with sound
      const playVideo = async () => {
        try {
          // First, unmute the video
          videoRef.current!.muted = false;
          
          // Try to play with sound
          await videoRef.current!.play();
          setIsPlaying(true);
          setIsMuted(false);
          
          // If autoplay with sound fails, try muted autoplay
        } catch (err) {
          console.log("Autoplay with sound failed, trying muted:", err);
          try {
            videoRef.current!.muted = true;
            await videoRef.current!.play();
            setIsPlaying(true);
            setIsMuted(true);
          } catch (mutedErr) {
            console.log("Muted autoplay also failed:", mutedErr);
            setIsPlaying(false);
          }
        }
      };

      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(playVideo, 300);
      
      return () => {
        clearTimeout(timeoutId);
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      };
    }
  }, [currentMediaIndex, productData]);

  // Reset video when changing media
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentMediaIndex]);

  const formatPrice = (amount: number | string | undefined) => {
    if (!amount) return "0 LYD";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num) + ' LYD';
  };

  // Handle video playback
  const toggleVideoPlayback = async () => {
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // If video is muted and user clicks play, try to unmute
        if (videoRef.current.muted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error toggling video playback:", err);
      // Fallback: try muted playback
      if (!isPlaying) {
        videoRef.current.muted = true;
        setIsMuted(true);
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (mutedErr) {
          console.error("Muted playback also failed:", mutedErr);
        }
      }
    }
  };

  // Toggle mute state
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-texture-paper flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-24 px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-burgundy mx-auto mb-4" />
            <p className="font-serif text-ivory-600 italic text-lg">{t('loading') || 'Loading piece...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !productData?.product) {
    return (
      <div className="min-h-screen bg-texture-paper flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ivory-100 flex items-center justify-center">
            <span className="text-3xl text-ivory-400">✦</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-ivory-900 mb-3">{t('product.not_found') || 'Piece Not Found'}</h1>
          <p className="text-ivory-600 font-sans mb-8 max-w-md">
            {t('product.not_found_desc') || 'The requested item could not be found in our archive.'}
          </p>
          <Link href="/shop">
            <button className="inline-flex items-center bg-ivory-900 text-cream px-8 py-3 text-sm uppercase tracking-wider font-serif hover:bg-ivory-800 transition-colors border border-ivory-800">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'} `} />
              {t('product.back_to_shop') || 'Return to Collection'}
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { product, similar_products } = productData;

  // Handle media (images + video)
  const mediaItems: Array<{ type: 'image' | 'video', url: string }> = [];
  
  // Add video as first item if exists
  if (product.video) {
    mediaItems.push({
      type: 'video',
      url: resolveMediaUrl(product.video)
    });
  }
  
  // Add main image
  if (product.image) {
    mediaItems.push({
      type: 'image',
      url: resolveMediaUrl(product.image)
    });
  }
  
  // Add additional images
  if (product.additional_images?.length) {
    product.additional_images.forEach(img => mediaItems.push({
      type: 'image',
      url: resolveMediaUrl(img)
    }));
  }
  
  // Fallback if no media
  if (mediaItems.length === 0) {
    mediaItems.push({
      type: 'image',
      url: "https://via.placeholder.com/600x800?text=No+Image"
    });
  }

  // Price calculations
  const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  const discountPercentage = typeof product.discount_percentage === 'string' 
    ? parseFloat(product.discount_percentage) 
    : (product.discount_percentage || 0);
  const hasDiscount = discountPercentage > 0;
  const finalPrice = hasDiscount ? price - (price * (discountPercentage / 100)) : price;
  const hasStock = (product.quantity_available || 0) > 0 && product.place_orders !== false;

  const handleAddToCart = () => {
    if (!hasStock) return;
    
    if (product.sizes?.length && !selectedSize) {
      toast({ title: t('product.select_size_first') || "Select size", variant: "destructive", duration: 2000 });
      return;
    }
    if (product.color?.length && !selectedColor) {
      toast({ title: t('product.select_color_first') || "Select color", variant: "destructive", duration: 2000 });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product as Product, selectedSize, selectedColor);
    }
    
    toast({
      title: t('product.added_to_cart') || "Added to Collection",
      description: `${product.name} ×${quantity}`,
      duration: 3000,
    });
  };

  const nextMedia = () => setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  const prevMedia = () => setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      <div className="flex-1 pt-24 md:pt-28 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            href="/shop" 
            className="inline-flex items-center text-sm text-ivory-600 hover:text-burgundy transition-colors mb-6 md:mb-8 font-sans group"
          >
            <ChevronLeft className={`w-4 h-4 ${isRTL ? 'ml-1 rotate-180' : 'mr-1'} group-hover:-translate-x-1 transition-transform`} />
            {t('product.back') || 'Back to Collection'}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Left: Media Gallery */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[3/4] bg-ivory-50 overflow-hidden border border-ivory-200 group">
                <AnimatePresence mode="wait">
                  {mediaItems[currentMediaIndex].type === 'video' ? (
                    <motion.div
                      key={`video-${currentMediaIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative w-full h-full"
                    >
                      <video
                        ref={videoRef}
                        src={mediaItems[currentMediaIndex].url}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted={isMuted}
                        loop
                        playsInline
                        onClick={toggleVideoPlayback}
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      
                      {/* Custom Video Controls */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <button
                          onClick={toggleVideoPlayback}
                          className="w-8 h-8 bg-black/70 backdrop-blur-sm text-white flex items-center justify-center rounded-full hover:bg-black/90 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                        
                        {/* Mute/Unmute Button */}
                        <button
                          onClick={toggleMute}
                          className="w-8 h-8 bg-black/70 backdrop-blur-sm text-white flex items-center justify-center rounded-full hover:bg-black/90 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        
                        <div className="text-white text-[9px] bg-black/50 px-2 py-1 rounded-sm font-sans">
                          VIDEO
                        </div>
                      </div>
                      
                      {/* Video playing indicator */}
                      {isPlaying && (
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-sm">
                            <div className="flex space-x-[1px]">
                              <div className="w-[2px] h-1.5 bg-white animate-pulse"></div>
                              <div className="w-[2px] h-2 bg-white animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-[2px] h-2.5 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span>Playing</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Play overlay when paused */}
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 cursor-pointer">
                          <div className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.img
                      key={`image-${currentMediaIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      src={mediaItems[currentMediaIndex].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
                
                {mediaItems.length > 1 && (
                  <>
                    <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm border border-ivory-200 flex items-center justify-center text-ivory-800 hover:bg-white hover:text-burgundy transition-all shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm border border-ivory-200 flex items-center justify-center text-ivory-800 hover:bg-white hover:text-burgundy transition-all shadow-sm opacity-0 group-hover:opacity-100 md:opacity-100">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-sm font-sans">
                      {currentMediaIndex + 1} / {mediaItems.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.is_featured && (
                    <span className="bg-ivory-900/95 text-cream text-[9px] uppercase tracking-wider px-2 py-1 font-serif shadow-sm">
                      {t('product.heritage_piece') || 'Heritage'}
                    </span>
                  )}
                  {product.is_new_arrival && (
                    <span className="bg-burgundy text-cream text-[9px] uppercase tracking-wider px-2 py-1 font-serif shadow-sm">
                      {t('product.new_arrival') || 'New'}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-burgundy/90 text-cream text-[10px] uppercase tracking-wider px-2 py 1 font-serif shadow-sm">
                      -{Math.round(discountPercentage)}%
                    </span>
                  )}
                </div>
              </div>
              
              {/* Media Thumbnails */}
              {mediaItems.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (videoRef.current && isPlaying) {
                          videoRef.current.pause();
                          setIsPlaying(false);
                        }
                        setCurrentMediaIndex(idx);
                      }}
                      className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 border-2 transition-all duration-200 overflow-hidden relative ${
                        currentMediaIndex === idx 
                          ? "border-ivory-900 opacity-100" 
                          : "border-ivory-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {item.type === 'video' ? (
                        <>
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      )}
                      
                      {/* Badge for video */}
                      {item.type === 'video' && (
                        <div className="absolute top-1 left-1 bg-black/80 text-white text-[6px] px-1 py-0.5 rounded">
                          VIDEO
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="border-b border-ivory-200 pb-3 mb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-burgundy tracking-wider uppercase mb-2 font-sans">
                  {product.category && <span className="bg-ivory-50 px-2 py-0.5 border border-ivory-200">{product.category}</span>}
                  {product.season && (
                    <>
                      <span className="text-ivory-300">•</span>
                      <span className="text-ivory-500 normal-case">{product.season}</span>
                    </>
                  )}
                </div>
                
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-ivory-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                
                {product.brand && (
                  <p className="text-xs text-ivory-500 uppercase tracking-wider font-sans mb-3">{product.brand}</p>
                )}

                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  {hasDiscount ? (
                    <>
                      <span className="font-serif text-xl sm:text-2xl text-burgundy font-bold">
                        {formatPrice(finalPrice)}
                      </span>
                      <span className="text-sm text-ivory-400 line-through font-sans">
                        {formatPrice(price)}
                      </span>
                      <span className="text-[10px] bg-burgundy/10 text-burgundy px-1.5 py-0.5 uppercase tracking-wider font-sans">
                        {t('product.save_short') || 'Save'} {Math.round(discountPercentage)}%
                      </span>
                    </>
                  ) : (
                    <span className="font-serif text-xl sm:text-2xl text-ivory-900 font-bold">
                      {formatPrice(price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-sans mt-2">
                  {hasStock ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-600">{t('product.in_stock') || 'In Stock'}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 bg-burgundy rounded-full"></span>
                      <span className="text-burgundy">{t('product.out_of_stock') || 'Out of Stock'}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-ivory-700 font-serif leading-relaxed text-sm line-clamp-4 sm:line-clamp-none">
                  {product.description}
                </p>
              </div>

              {/* VARIANTS */}
              <div className="space-y-3 mb-4">
                
                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider text-ivory-500 font-sans">
                        {t('product.size') || 'Size'}
                      </label>
                      {selectedSize && (
                        <span className="text-[10px] text-burgundy font-medium flex items-center gap-1 px-1.5 py-0.5 bg-burgundy/5 rounded">
                          <Check className="w-2.5 h-2.5" /> {selectedSize}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[2.25rem] h-8 px-2 text-xs font-sans border transition-all duration-150 flex items-center justify-center relative ${
                            selectedSize === size
                              ? 'bg-ivory-900 text-cream border-ivory-900 shadow-sm'
                              : 'bg-white text-ivory-700 border-ivory-200 hover:border-ivory-400'
                          }`}
                        >
                          {size}
                          {selectedSize === size && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-burgundy rounded-full border border-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection - With Visual Swatches */}
                {product.color && product.color.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-wider text-ivory-500 font-sans">
                        {t('product.color') || 'Color'}
                      </label>
                      {selectedColor && (
                        <span className="text-[10px] text-burgundy font-medium flex items-center gap-1 px-1.5 py-0.5 bg-burgundy/5 rounded capitalize">
                          <Check className="w-2.5 h-2.5" />
                          {t(getColorDisplayName(selectedColor))}
                        </span>
                      )}
                    </div>
                    
                    {/* Mobile: Select dropdown when many colors */}
                    {isMobile && product.color.length > 4 ? (
                      <div className="relative">
                        <select
                          value={selectedColor || ''}
                          onChange={(e) => setSelectedColor(e.target.value || undefined)}
                          className="w-full text-xs border border-ivory-300 bg-white px-2 py-2 pr-8 appearance-none focus:outline-none focus:border-ivory-500 rounded-sm capitalize"
                        >
                          <option value="">{t('product.select_color') || 'Select color'}</option>
                          {product.color.map((color) => {
                            const translationKey = getColorDisplayName(color);
                            return (
                              <option key={color} value={color}>
                                {t(translationKey)}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ivory-400 pointer-events-none" />
                      </div>
                    ) : (
                      // Desktop/Mobile with few colors: Visual color chips
                      <div className="flex flex-wrap gap-1.5">
                        {product.color.map((color) => {
                          const colorCode = getColorCode(color);
                          const isPattern = isPatternColor(color);
                          const isLight = ['white', 'cream', 'beige', 'ivory', 'eggshell', 'vanilla', 'parchment'].includes(color.toLowerCase());
                          const translationKey = getColorDisplayName(color);
                          
                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`relative group flex items-center gap-1.5 h-9 px-2.5 border transition-all duration-150 ${
                                selectedColor === color
                                  ? 'border-ivory-900 bg-ivory-50 shadow-sm ring-1 ring-ivory-900 ring-offset-1'
                                  : 'border-ivory-200 bg-white hover:border-ivory-400'
                              }`}
                              title={`${t('product.select_color') || 'Select'} ${t(translationKey)}`}
                            >
                              {/* Color Swatch Circle */}
                              <div 
                                className={`w-4 h-4 rounded-full flex-shrink-0 border ${isLight ? 'border-ivory-300' : 'border-transparent'} shadow-sm`}
                                style={{ 
                                  backgroundColor: isPattern ? undefined : colorCode,
                                  backgroundImage: isPattern ? colorCode : undefined,
                                  backgroundSize: isPattern ? 'cover' : undefined
                                }}
                              />
                              
                              {/* Color Name - Hidden on very small screens */}
                              <span className="text-[11px] font-sans text-ivory-700 capitalize hidden xs:inline truncate max-w-[60px]">
                                {t(translationKey)}
                              </span>
                              
                              {/* Selected Checkmark */}
                              {selectedColor === color && (
                                <Check className="w-3 h-3 text-burgundy flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-ivory-500 font-sans block mb-1">
                      {t('product.quantity') || 'Qty'}
                    </label>
                    <div className="flex items-center border border-ivory-300 w-fit h-8">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="w-8 h-full flex items-center justify-center text-ivory-600 hover:bg-ivory-50 border-r border-ivory-300 disabled:opacity-50 text-sm"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-serif text-sm text-ivory-900">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.quantity_available || 10, quantity + 1))} 
                        className="w-8 h-full flex items-center justify-center text-ivory-600 hover:bg-ivory-50 border-l border-ivory-300 disabled:opacity-50 text-sm"
                        disabled={quantity >= (product.quantity_available || 10)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {product.material && (
                  <div className="bg-ivory-50/50 p-2 border border-ivory-100 text-center sm:text-left">
                    <span className="text-ivory-400 uppercase text-[9px] tracking-wider block">{t('product.material') || 'Material'}</span>
                    <span className="font-medium text-ivory-700 text-xs font-sans">{product.material}</span>
                  </div>
                )}
                {product.gender && (
                  <div className="bg-ivory-50/50 p-2 border border-ivory-100 text-center sm:text-left">
                    <span className="text-ivory-400 uppercase text-[9px] tracking-wider block">{t('product.gender') || 'Gender'}</span>
                    <span className="font-medium text-ivory-700 text-xs font-sans capitalize">{product.gender}</span>
                  </div>
                )}
              </div>

              {/* Trust Badge */}
              <div className="bg-gradient-to-r from-ivory-50/50 to-white border border-ivory-200 p-3 flex items-start gap-2 mb-4">
                <Shield className="w-4 h-4 text-burgundy flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-ivory-900 text-xs mb-0.5 font-serif">{t('product.authenticity') || 'Authenticity Guaranteed'}</h4>
                  <p className="text-ivory-600 text-[10px] leading-relaxed font-sans">
                    {t('product.authenticity_desc') || 'Rigorously inspected by experts.'}
                  </p>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="mt-auto pt-3 border-t border-ivory-200 space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  className={`w-full py-3.5 text-xs sm:text-sm uppercase tracking-[0.15em] font-serif transition-all duration-300 flex items-center justify-center gap-2 border ${
                    hasStock ? 'bg-ivory-900 text-cream border-ivory-900 hover:bg-ivory-800 hover:shadow-md' : 'bg-ivory-200 text-ivory-500 border-ivory-300 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {hasStock ? (t('product.add_to_collection') || 'Add to Collection') : (t('product.out_of_stock') || 'Out of Stock')}
                </button>
                
                <p className="text-center text-[9px] text-ivory-400 font-sans uppercase tracking-wider flex items-center justify-center gap-1">
                  <Package className="w-3 h-3" />
                  {t('product.shipping_info') || 'Free shipping over 500 LYD'}
                </p>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similar_products && similar_products.length > 0 && (
            <div className="mt-12 md:mt-16 pt-8 border-t border-ivory-200">
              <div className="text-center mb-6 md:mb-8">
                <span className="text-gold text-lg font-display block mb-2">❦</span>
                <h2 className="font-display text-xl md:text-2xl text-ivory-900 mb-1">
                  {t('product.similar_pieces') || 'You May Also Like'}
                </h2>
                <p className="text-ivory-600 font-sans text-xs">
                  {t('product.similar_desc') || 'From the same collection'}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {similar_products.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/product/${item.id}`}>
                      <div className="group cursor-pointer">
                        <div className="aspect-[3/4] bg-ivory-50 overflow-hidden border border-ivory-200 mb-2 relative">
                          <img
                            src={resolveMediaUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>
                        <div className="text-center px-1">
                          <h3 className="font-serif text-xs sm:text-sm text-ivory-900 group-hover:text-burgundy transition-colors line-clamp-1 mb-0.5">
                            {item.name}
                          </h3>
                          <p className="text-[10px] text-ivory-500 mb-0.5">{item.brand || item.category}</p>
                          <p className="font-serif text-burgundy font-medium text-xs sm:text-sm">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}