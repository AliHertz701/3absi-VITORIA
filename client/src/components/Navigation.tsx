import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/eras", label: "Eras" },
    { href: "/about", label: "Heritage" },
  ];

  const LinkItem = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => (
    <Link 
      href={href} 
      className={`
        text-sm tracking-widest uppercase hover:text-gold transition-colors duration-300
        ${location === href ? "text-gold font-medium" : "text-foreground/80"}
        ${mobile ? "text-xl py-2" : ""}
      `}
      onClick={() => mobile && setIsOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Menu className="w-6 h-6 text-foreground" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background border-r border-border">
              <div className="flex flex-col space-y-8 mt-12">
                {navLinks.map(link => (
                  <LinkItem key={link.href} {...link} mobile />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Left Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <LinkItem key={link.href} {...link} />
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 group">
          <div className="text-center cursor-pointer">
            <h1 className="font-display text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-gold transition-colors duration-500">
              Rare Heritage
            </h1>
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mt-1">Est. 1924</span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center space-x-6">
          <button className="hidden md:block hover:text-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href="/cart" className="relative hover:text-gold transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
