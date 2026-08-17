"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppliedCoupon, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  cep: string | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  setCep: (cep: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      cep: null,
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.variantId === item.variantId);
        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, item.maxStock);
          set({
            items: get().items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: Math.min(quantity, item.maxStock) }],
          });
        }
        set({ isOpen: true });
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        });
      },

      clear: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      setCep: (cep) => set({ cep }),
    }),
    {
      name: "liva-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        cep: state.cep,
      }),
    }
  )
);

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}
