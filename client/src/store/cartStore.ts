import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartSummary } from '../types/cart';
import type { Product, ProductVariant } from '../types/product';
import { cartService } from '../services/cartService';

interface CartState {
  items: CartItem[];
  staleAlerts: string[];
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => Promise<{ success: boolean; message?: string }>;
  updateQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCartWithServer: () => Promise<void>;
  clearStaleAlerts: () => void;
  getSummary: () => CartSummary;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      staleAlerts: [],
      isLoading: false,
      error: null,

      addItem: async (product: Product, variant: ProductVariant, quantity = 1) => {
        if (!variant.inStock || variant.stock <= 0) {
          return { success: false, message: 'This variant is currently out of stock.' };
        }

        set({ isLoading: true, error: null });

        try {
          // Attempt API call to backend
          const res = await cartService.addItem(product.id, variant.id, quantity);
          set({ items: res.items, staleAlerts: res.alerts, isLoading: false });
          return { success: true, message: 'Added to cart successfully.' };
        } catch (err: any) {
          // Local fallback in state if backend unavailable
          const cartItemId = `${product.id}_${variant.id}`;
          const existingItems = get().items;
          const existingIndex = existingItems.findIndex((item) => item.id === cartItemId);

          if (existingIndex > -1) {
            const currentQty = existingItems[existingIndex].quantity;
            const newQty = currentQty + quantity;

            if (newQty > variant.stock) {
              set({ isLoading: false });
              return {
                success: false,
                message: `Cannot add more. Maximum available stock is ${variant.stock}.`,
              };
            }

            const updatedItems = [...existingItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
              variant,
            };
            set({ items: updatedItems, isLoading: false });
            return { success: true, message: `Updated quantity to ${newQty} in cart.` };
          } else {
            if (quantity > variant.stock) {
              set({ isLoading: false });
              return {
                success: false,
                message: `Requested quantity exceeds available stock of ${variant.stock}.`,
              };
            }

            const newItem: CartItem = {
              id: cartItemId,
              productId: product.id,
              variantId: variant.id,
              product,
              variant,
              quantity,
              serverStock: variant.stock,
            };
            set({ items: [...existingItems, newItem], isLoading: false });
            return { success: true, message: 'Added to cart successfully.' };
          }
        }
      },

      updateQuantity: async (cartItemId: string, newQuantity: number) => {
        const itemToUpdate = get().items.find((i) => i.id === cartItemId);
        if (!itemToUpdate) return;

        set({ isLoading: true });

        try {
          const res = await cartService.updateQuantity(
            itemToUpdate.productId,
            itemToUpdate.variantId,
            newQuantity
          );
          set({ items: res.items, staleAlerts: res.alerts, isLoading: false });
        } catch {
          // State fallback
          const items = get().items;
          if (newQuantity <= 0) {
            set({ items: items.filter((item) => item.id !== cartItemId), isLoading: false });
            return;
          }

          const updated = items.map((item) => {
            if (item.id === cartItemId) {
              const maxStock = item.variant.stock;
              const cappedQty = Math.min(newQuantity, maxStock);
              return { ...item, quantity: cappedQty };
            }
            return item;
          });

          set({ items: updated, isLoading: false });
        }
      },

      removeItem: async (cartItemId: string) => {
        const itemToRemove = get().items.find((i) => i.id === cartItemId);
        set({ isLoading: true });

        if (itemToRemove) {
          try {
            const res = await cartService.removeItem(itemToRemove.productId, itemToRemove.variantId);
            set({ items: res.items, staleAlerts: res.alerts, isLoading: false });
            return;
          } catch {
            // State fallback
          }
        }

        set({ items: get().items.filter((item) => item.id !== cartItemId), isLoading: false });
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartService.clearCart();
        } catch {
          // ignore
        }
        set({ items: [], staleAlerts: [], isLoading: false });
      },

      syncCartWithServer: async () => {
        try {
          const res = await cartService.getCart();
          if (res.items && res.items.length > 0) {
            set({ items: res.items, staleAlerts: res.alerts });
          }
        } catch {
          // Keep persistent local cart if server down
        }
      },

      clearStaleAlerts: () => {
        set({ staleAlerts: [] });
      },

      getSummary: (): CartSummary => {
        const items = get().items;
        const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = items.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
        const originalTotal = items.reduce(
          (acc, item) => acc + (item.variant.originalPrice || item.variant.price) * item.quantity,
          0
        );
        const discount = Math.max(0, originalTotal - subtotal);
        const tax = Math.round(subtotal * 0.05); // 5% GST
        const shippingFee = subtotal > 500 || items.length === 0 ? 0 : 49;
        const total = subtotal + tax + shippingFee;

        return {
          subtotal,
          discount,
          tax,
          shippingFee,
          total,
          itemCount,
        };
      },
    }),
    {
      name: 'megamart_cart_storage',
    }
  )
);
