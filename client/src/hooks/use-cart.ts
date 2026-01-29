import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@shared/schema';

export interface CartItem {
  id: string; // Unique ID combining productId_size_color
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Create an event emitter for cart updates
const cartEvent = {
  listeners: new Set<() => void>(),
  subscribe: (callback: () => void) => {
    cartEvent.listeners.add(callback);
    return () => {
      cartEvent.listeners.delete(callback);
    };
  },
  emit: () => {
    cartEvent.listeners.forEach(callback => callback());
  }
};

// Create a singleton cart state that can be accessed globally
let globalCartItems: CartItem[] = [];

// Generate unique cart item ID based on product and variants
const generateCartItemId = (productId: number, size?: string, color?: string) => {
  return `${productId}_${size || 'default'}_${color || 'default'}`;
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rare_heritage_cart');
    const initial = saved ? JSON.parse(saved) : [];
    globalCartItems = initial;
    return initial;
  });

  // Listen for external cart updates
  useEffect(() => {
    const unsubscribe = cartEvent.subscribe(() => {
      const saved = localStorage.getItem('rare_heritage_cart');
      const updatedItems = saved ? JSON.parse(saved) : [];
      setItems(updatedItems);
    });
    return unsubscribe;
  }, []);

  const updateCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    globalCartItems = newItems;
    localStorage.setItem('rare_heritage_cart', JSON.stringify(newItems));
    cartEvent.emit();
  }, []);

  const addToCart = useCallback((product: Product, selectedSize?: string, selectedColor?: string) => {
    const cartItemId = generateCartItemId(product.id, selectedSize, selectedColor);
    const updated = [...globalCartItems];
    const existing = updated.find(item => item.id === cartItemId);
    
    if (existing) {
      // Update quantity if same variant exists
      updated.forEach(item => {
        if (item.id === cartItemId) {
          item.quantity += 1;
        }
      });
    } else {
      // Add new variant
      updated.push({ 
        id: cartItemId,
        product, 
        quantity: 1,
        selectedSize,
        selectedColor
      });
    }
    
    updateCart(updated);
  }, [updateCart]);

  const removeFromCart = useCallback((cartItemId: string) => {
    const updated = globalCartItems.filter(item => item.id !== cartItemId);
    updateCart(updated);
  }, [updateCart]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    const updated = [...globalCartItems];
    const item = updated.find(item => item.id === cartItemId);
    if (item) {
      if (quantity <= 0) {
        return removeFromCart(cartItemId);
      }
      item.quantity = quantity;
      updateCart(updated);
    }
  }, [updateCart, removeFromCart]);

  const updateVariant = useCallback((cartItemId: string, newSize?: string, newColor?: string) => {
    const updated = [...globalCartItems];
    const itemIndex = updated.findIndex(item => item.id === cartItemId);
    
    if (itemIndex === -1) return;

    const item = updated[itemIndex];
    const newCartItemId = generateCartItemId(item.product.id, newSize, newColor);
    
    // Check if the new variant already exists
    const existingVariant = updated.find((item, idx) => 
      item.id === newCartItemId && idx !== itemIndex
    );

    if (existingVariant) {
      // Merge quantities if variant already exists
      existingVariant.quantity += item.quantity;
      updated.splice(itemIndex, 1); // Remove duplicate
    } else {
      // Update the variant
      updated[itemIndex] = {
        ...item,
        id: newCartItemId,
        selectedSize: newSize,
        selectedColor: newColor
      };
    }
    
    updateCart(updated);
  }, [updateCart]);

  const clearCart = useCallback(() => {
    updateCart([]);
  }, [updateCart]);

  // Calculate total with discount consideration
  const total = items.reduce((sum, item) => {
    const price = item.product.price || 0;
    const discount = item.product.discount_percentage || 0;
    const discountedPrice = price - (price * discount) / 100;
    return sum + (discountedPrice * item.quantity);
  }, 0);

  // Get unique product count (regardless of variants)
  const uniqueProductCount = new Set(items.map(item => item.product.id)).size;

  return { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    updateVariant,
    clearCart, 
    total,
    uniqueProductCount
  };
}

// Export helper functions for non-React contexts
export function getCartItemCount(): number {
  return globalCartItems.reduce((count, item) => count + item.quantity, 0);
}

export function getCartUniqueCount(): number {
  return globalCartItems.length;
}