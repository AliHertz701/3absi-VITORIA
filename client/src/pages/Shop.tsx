import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Check } from "lucide-react";

export default function Shop() {
  const { data: products, isLoading } = useProducts();
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const eras = ["Victorian", "Edwardian", "1920s", "1950s"];
  const categories = ["Dresses", "Outerwear", "Accessories", "Jewelry"];

  const filteredProducts = products?.filter(p => {
    if (selectedEra && p.era !== selectedEra) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  const FilterButton = ({ active, onClick, label }: any) => (
    <button
      onClick={onClick}
      className={`
        text-sm text-left py-2 px-3 flex items-center justify-between w-full transition-colors
        ${active ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}
      `}
    >
      <span>{label}</span>
      {active && <Check className="w-3 h-3" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto w-full">
        <h1 className="font-display text-4xl md:text-5xl text-center mb-4">The Collection</h1>
        <p className="text-center text-muted-foreground font-serif italic mb-16 max-w-2xl mx-auto">
          Browse our complete archive of historical garments, categorized by era and style.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="space-y-8">
            <div>
              <h3 className="font-display text-lg mb-4 border-b border-border pb-2">Era</h3>
              <div className="space-y-1">
                <FilterButton 
                  active={selectedEra === null} 
                  onClick={() => setSelectedEra(null)} 
                  label="All Eras" 
                />
                {eras.map(era => (
                  <FilterButton 
                    key={era} 
                    active={selectedEra === era} 
                    onClick={() => setSelectedEra(era)} 
                    label={era} 
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg mb-4 border-b border-border pb-2">Category</h3>
              <div className="space-y-1">
                <FilterButton 
                  active={selectedCategory === null} 
                  onClick={() => setSelectedCategory(null)} 
                  label="All Categories" 
                />
                {categories.map(cat => (
                  <FilterButton 
                    key={cat} 
                    active={selectedCategory === cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    label={cat} 
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="bg-muted animate-pulse aspect-[3/4]" />
                    <div className="h-4 bg-muted animate-pulse w-2/3 mx-auto" />
                  </div>
                ))}
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-20 bg-muted/30">
                <p className="font-serif text-lg text-muted-foreground">No pieces found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedEra(null); setSelectedCategory(null); }}
                  className="mt-4 text-gold underline hover:text-brown transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts?.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
