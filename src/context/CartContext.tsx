'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────────────── */
export interface CartItem {
  id:       string;
  name:     string;
  subtitle: string;
  price:    number;
  qty:      number;
}

interface CartContextValue {
  items:     CartItem[];
  totalQty:  number;
  subtotal:  number;
  addItem:   (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem:(id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
}

/* ─── Context ────────────────────────────────────────────────────────────────── */
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((incoming: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === incoming.id);
      if (existing) {
        return prev.map(i => i.id === incoming.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...incoming, qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, totalQty, subtotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
