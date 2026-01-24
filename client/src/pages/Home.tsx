import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Unsplash image: Vintage high fashion editorial vibe, elegant woman in silk dress */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1548625361-987820bb353e?q=80&w=2675&auto=format&fit=crop"
            alt="Vintage Fashion Editorial"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 text-center text-white space-y-6 max-w-4xl px-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base tracking-[0.4em] uppercase font-light"
          >
            Curated Italian Antiquities
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight"
          >
            Timeless <span className="italic font-serif">Elegance</span> <br/>
            Reborn
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <Link href="/shop" className="inline-block border border-white/40 px-8 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
              Discover the Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <span className="text-gold text-2xl font-display block mb-4">❦</span>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
          "Fashion fades, only style remains the same."
        </h2>
        <p className="text-muted-foreground leading-relaxed font-serif text-lg">
          We travel the hidden ateliers of Florence, Rome, and Venice to uncover rare, 
          museum-quality garments from the 19th and early 20th centuries. 
          Each piece in our collection has been meticulously preserved, authenticated, 
          and restored to its former glory.
        </p>
      </section>

      {/* Featured Collection */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display text-3xl text-foreground">Curator's Selection</h2>
            <p className="text-muted-foreground mt-2 font-serif italic">The finest pieces of the season</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center space-x-2 text-sm tracking-widest uppercase hover:text-gold transition-colors group">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-muted animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {featuredProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/shop" className="inline-block border-b border-foreground pb-1 text-sm tracking-widest uppercase">
            View All Collections
          </Link>
        </div>
      </section>

      {/* Eras Navigation */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[600px]">
        {/* Unsplash: Victorian aesthetic, lace detail */}
        <div className="relative group overflow-hidden cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1596568297745-31a89b25121c?q=80&w=2574&auto=format&fit=crop" 
            alt="Victorian Era" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 flex flex-col items-center justify-center text-white">
            <h3 className="font-display text-4xl mb-2">The Victorian Era</h3>
            <p className="tracking-widest uppercase text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Explore 1837 – 1901
            </p>
          </div>
        </div>

        {/* Unsplash: 1920s Flapper aesthetic, jazz age, sequins */}
        <div className="relative group overflow-hidden cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1569388330292-7a6a841cd333?q=80&w=2532&auto=format&fit=crop" 
            alt="The Jazz Age" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 flex flex-col items-center justify-center text-white">
            <h3 className="font-display text-4xl mb-2">The Jazz Age</h3>
            <p className="tracking-widest uppercase text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              Explore 1920s
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
