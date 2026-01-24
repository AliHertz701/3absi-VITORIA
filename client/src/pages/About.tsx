import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <span className="text-gold text-2xl font-display block mb-4">❦</span>
        <h1 className="font-display text-5xl mb-12">Our Heritage</h1>
        
        <div className="space-y-8 text-lg font-serif leading-relaxed text-muted-foreground">
          <p>
            Founded in 1924 as a small atelier in Florence, Rare Heritage has spent a century 
            celebrating the artistry of Italian fashion. We are not merely a shop; we are custodians 
            of history, preserving the stories woven into silk, velvet, and lace.
          </p>
          
          <p>
            Our curators travel across Europe, attending private auctions and visiting estate sales 
            to uncover forgotten treasures. Every piece in our collection is selected for its 
            exceptional condition, historical significance, and enduring beauty.
          </p>
          
          <div className="py-12">
            {/* Unsplash: Artisan hands or vintage workshop */}
            <img 
              src="https://images.unsplash.com/photo-1558542095-2c8032df510a?q=80&w=2670&auto=format&fit=crop" 
              alt="Atelier"
              className="w-full aspect-video object-cover"
            />
            <p className="text-xs uppercase tracking-widest mt-4 text-muted-foreground">Inside our restoration studio</p>
          </div>

          <p>
            We believe that true luxury is timeless. In an age of fast fashion, we invite you 
            to slow down and appreciate the meticulous craftsmanship of a bygone era. 
            When you acquire a piece from Rare Heritage, you are not just buying a garment; 
            you are inheriting a legacy.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
