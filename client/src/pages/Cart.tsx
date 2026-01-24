import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, total } = useCart();

  return (
    <div className="min-h-screen bg-texture-paper flex flex-col">
      <Navigation />
      
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl mb-12 text-center">Your Selection</h1>

          {items.length === 0 ? (
            <div className="text-center py-12 bg-white/50 border border-border">
              <p className="text-muted-foreground font-serif mb-6">Your shopping bag is currently empty.</p>
              <Link href="/shop" className="text-gold uppercase tracking-widest text-sm hover:text-brown transition-colors">
                Continue Browsing
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="space-y-8">
                {items.map((item) => {
                  const product = item.product;
                  const images = Array.isArray(product.images) 
                    ? product.images 
                    : JSON.parse(product.images as unknown as string);

                  return (
                    <div key={product.id} className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-border/60">
                      <div className="w-full sm:w-32 aspect-[3/4] bg-muted">
                        <img 
                          src={images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-display text-xl mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{product.era} — {product.category}</p>
                          </div>
                          <div className="text-lg font-serif">
                            ${(product.price / 100).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 sm:mt-8">
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">
                            Quantity: {item.quantity}
                          </div>
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col items-end space-y-6">
                <div className="text-right space-y-2">
                  <div className="flex justify-between w-64 text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(total / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between w-64 text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between w-64 text-xl font-display pt-4 border-t border-border">
                    <span>Total</span>
                    <span>${(total / 100).toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full sm:w-64 bg-foreground text-background py-4 text-sm uppercase tracking-widest hover:bg-gold transition-colors flex items-center justify-center group">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
