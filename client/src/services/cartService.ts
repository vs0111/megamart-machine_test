import type { CartItem, CartSummary, CheckoutDetails, OrderConfirmation } from '../types/cart';

const API_BASE_URL = 'http://localhost:5000/api/cart';

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('megamart_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('megamart_session_id', sessionId);
  }
  return sessionId;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('megamart_jwt_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export interface ApiCartResponse {
  items: CartItem[];
  alerts: string[];
  summary: CartSummary;
}

export const cartService = {
  /**
   * Fetch user cart from real MongoDB Atlas backend.
   */
  async getCart(): Promise<ApiCartResponse> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart from server.');
    }

    const resData = await response.json();
    return {
      items: resData.items || [],
      alerts: resData.alerts || [],
      summary: resData.summary,
    };
  },

  /**
   * Add item to cart with backend stock verification.
   */
  async addItem(productId: string, variantId: string, quantity = 1): Promise<ApiCartResponse> {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, variantId, quantity }),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to add item to cart.');
    }

    return {
      items: resData.items || [],
      alerts: resData.alerts || [],
      summary: resData.summary,
    };
  },

  /**
   * Update item quantity in MongoDB cart.
   */
  async updateQuantity(productId: string, variantId: string, quantity: number): Promise<ApiCartResponse> {
    const response = await fetch(`${API_BASE_URL}/item`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, variantId, quantity }),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to update quantity.');
    }

    return {
      items: resData.items || [],
      alerts: resData.alerts || [],
      summary: resData.summary,
    };
  },

  /**
   * Remove item from MongoDB cart.
   */
  async removeItem(productId: string, variantId: string): Promise<ApiCartResponse> {
    const response = await fetch(`${API_BASE_URL}/item`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, variantId }),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to remove item.');
    }

    return {
      items: resData.items || [],
      alerts: resData.alerts || [],
      summary: resData.summary,
    };
  },

  /**
   * Clear user's MongoDB cart.
   */
  async clearCart(): Promise<ApiCartResponse> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Failed to clear cart.');
    }

    return {
      items: [],
      alerts: [],
      summary: resData.summary,
    };
  },

  /**
   * Process Checkout button click, update stock in MongoDB Atlas, and place order.
   */
  async checkout(shippingDetails: CheckoutDetails): Promise<OrderConfirmation> {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ shippingDetails }),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Checkout failed. Please try again.');
    }

    return resData.order;
  },
};
