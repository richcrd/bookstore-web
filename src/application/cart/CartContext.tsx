import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Book, Cart, CartItem } from '../../domain/models';
import { ports } from '../../infrastructure/di';

interface CartContextValue {
  cart: Cart;
  count: number;
  total: number;
  currency: string;
  add: (book: Book, quantity?: number) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => ports.cart.load());

  useEffect(() => {
    ports.cart.save(cart);
  }, [cart]);

  const value = useMemo<CartContextValue>(() => {
    const add = (book: Book, quantity = 1) =>
      setCart((prev) => {
        const existing = prev.items.find((item) => item.bookId === book.id);
        if (existing) {
          return {
            items: prev.items.map((item) =>
              item.bookId === book.id ? { ...item, quantity: item.quantity + quantity } : item
            ),
          };
        }
        const item: CartItem = {
          bookId: book.id,
          title: book.title,
          author: book.author,
          unitPrice: book.price,
          currency: book.currency,
          quantity,
        };
        return { items: [...prev.items, item] };
      });

    const setQuantity = (bookId: string, quantity: number) =>
      setCart((prev) => ({
        items:
          quantity <= 0
            ? prev.items.filter((item) => item.bookId !== bookId)
            : prev.items.map((item) => (item.bookId === bookId ? { ...item, quantity } : item)),
      }));

    const remove = (bookId: string) =>
      setCart((prev) => ({ items: prev.items.filter((item) => item.bookId !== bookId) }));

    const clear = () => setCart({ items: [] });

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const currency = cart.items[0]?.currency ?? 'USD';

    return { cart, count, total, currency, add, setQuantity, remove, clear };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}