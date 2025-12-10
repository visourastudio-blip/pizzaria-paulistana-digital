import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, MenuItem, PizzaSize, StuffedCrust, Extra, PIZZA_SIZES } from "@/data/menu";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, { ...item, id: `${item.menuItem.id}-${Date.now()}` }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function calculatePizzaPrice(
  basePrice: number,
  size: PizzaSize,
  stuffedCrust?: StuffedCrust,
  extras?: Extra[]
): number {
  let price = basePrice * size.priceMultiplier;
  if (stuffedCrust) {
    price += stuffedCrust.price;
  }
  if (extras) {
    price += extras.reduce((sum, extra) => sum + extra.price, 0);
  }
  return price;
}
