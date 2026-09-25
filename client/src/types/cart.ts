import type { Product, ProductVariant } from './product';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  serverStock?: number;
  isStale?: boolean;
  staleMessage?: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'upi' | 'card';
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  summary: CartSummary;
  shippingDetails: CheckoutDetails;
  paymentStatus: 'PAID' | 'PENDING_COD';
}
