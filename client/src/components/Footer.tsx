import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-display text-2xl">Rare Heritage</h3>
          <p className="text-background/60 text-sm leading-relaxed max-w-xs">
            Curating the finest antique garments from Italy's golden eras. 
            Each piece tells a story of elegance, craft, and history.
          </p>
        </div>
        
        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Shop</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Collections</Link></li>
            <li><Link href="/shop?category=Dresses" className="hover:text-white transition-colors">Dresses</Link></li>
            <li><Link href="/shop?category=Outerwear" className="hover:text-white transition-colors">Coats & Capes</Link></li>
            <li><Link href="/shop?category=Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Client Service</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Authenticity Guarantee</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Care Guide</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-gold">Newsletter</h4>
          <p className="text-xs text-background/60 mb-4">
            Subscribe to receive updates on new acquisitions.
          </p>
          <div className="flex border-b border-white/20 pb-2">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30"
            />
            <button className="text-xs uppercase tracking-widest hover:text-gold transition-colors">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
        <p>&copy; 2024 Rare Heritage. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
        </div>
      </div>
    </footer>
  );
}
