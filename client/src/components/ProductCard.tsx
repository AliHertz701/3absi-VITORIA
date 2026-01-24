import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  // Parse images if stored as JSON string, otherwise assume array
  const images = Array.isArray(product.images) 
    ? product.images 
    : JSON.parse(product.images as unknown as string);

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group cursor-pointer"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
          <img 
            src={images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-gold/90 text-white text-[10px] uppercase tracking-widest px-3 py-1">
              Rarity
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-display text-lg text-foreground group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {product.era} — {product.category}
          </p>
          <p className="font-serif text-sm pt-1 text-foreground">
            ${(product.price / 100).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
