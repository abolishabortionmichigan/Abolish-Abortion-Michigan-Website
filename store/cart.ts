'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/*
 * Shopping cart, persisted to localStorage so it survives reloads and closing
 * the tab. Prices stored here are for DISPLAY ONLY — the checkout action
 * re-reads every product and variant from the database and computes the total
 * server-side, so an edited localStorage cannot change what anyone pays.
 */

export interface CartLine {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string | null;
  unitPriceCents: number;
  image: string | null;
  quantity: number;
}

export const MAX_LINE_QTY = 25;

export const lineKey = (l: Pick<CartLine, 'productId' | 'variantId'>) => `${l.productId}:${l.variantId ?? ''}`;

interface CartState {
  lines: CartLine[];
  add: (line: CartLine) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (line) =>
        set((s) => {
          const key = lineKey(line);
          const existing = s.lines.find((l) => lineKey(l) === key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                lineKey(l) === key
                  ? { ...l, ...line, quantity: Math.min(MAX_LINE_QTY, l.quantity + line.quantity) }
                  : l
              ),
            };
          }
          return { lines: [...s.lines, { ...line, quantity: Math.min(MAX_LINE_QTY, line.quantity) }] };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (lineKey(l) === key ? { ...l, quantity: Math.max(0, Math.min(MAX_LINE_QTY, quantity)) } : l))
            .filter((l) => l.quantity > 0),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'aam-cart', version: 1 }
  )
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity * l.unitPriceCents, 0);
