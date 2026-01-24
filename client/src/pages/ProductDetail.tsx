import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Loader2, ArrowLeft, Minus, Plus, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading, isError } = useProduct(id);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <h1 className="font-display text-3xl">Piece Not Found</h1>
        <Link href="/shop" className="text-gold hover:underline">Return to Collection</Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) 
    ? product.images 
    : JSON.parse(product.images as unknown as string);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your selection.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      <div className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`
                      w-24 h-32 flex-shrink-0 border transition-all duration-300
                      ${currentImageIndex === idx ? "border-gold opacity-100" : "border-transparent opacity-50 hover:opacity-100"}
                    `}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:pt-8 flex flex-col h-full">
              <div className="border-b border-border pb-6 mb-8">
                <div className="flex items-center space-x-2 text-gold text-sm tracking-widest uppercase mb-4">
                  <span>{product.era}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                </div>
                
                <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                  {product.name}
                </h1>
                
                <div className="text-2xl font-serif text-foreground">
                  ${(product.price / 100).toLocaleString()}
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <h3 className="font-display text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground font-serif leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-foreground mb-1">Condition</h4>
                    <p className="text-sm text-muted-foreground">{product.condition}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-foreground mb-1">Material</h4>
                    <p className="text-sm text-muted-foreground">{product.material}</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 flex items-start space-x-4">
                  <ShieldCheck className="w-6 h-6 text-gold flex-shrink-0" />
                  <div className="text-sm">
                    <h4 className="font-medium text-foreground mb-1">Authenticity Guaranteed</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Every item is rigorously inspected by our experts to ensure historical accuracy and quality. 
                      Includes a signed certificate of authenticity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-foreground text-background py-5 text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  Acquire This Piece
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
