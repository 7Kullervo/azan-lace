"use client";

// ============================================================
// Cart context.
// Phase 1 keeps the cart in localStorage so it works instantly
// for both guests and logged-in users with zero setup. When the
// checkout/orders phase is built, this same context can also
// sync to /api/cart so a logged-in user's cart follows them
// across devices — the component API below won't need to change.
// ============================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartLineItem } from "@/types";

const STORAGE_KEY = "azan-lace-cart";

const CartContext = createContext<{
  items: CartLineItem[];
  addItem: (item: CartLineItem) => void;
  updateQuantity: (productId: string, colorId: string | null, quantity: number) => void;
  removeItem: (productId: string, colorId: string | null) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage once on mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        // ignore corrupted cart data
      }
    }
    setHydrated(true);
  }, []);

  // Persist any cart change back to localStorage.
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(newItem: CartLineItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.colorId === newItem.colorId
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
  }

  function updateQuantity(productId: string, colorId: string | null, quantity: number) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.colorId === colorId ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId: string, colorId: string | null) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.colorId === colorId)));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
