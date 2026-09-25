import { CartModel } from '../models/cartModel.js';
import { ProductModel } from '../models/productModel.js';
import { OrderModel } from '../models/orderModel.js';

export class CartService {
  /**
   * Get hydrated cart for user from MongoDB Atlas with line totals, stale item detection, and summary calculations.
   */
  public async getCart(userId: string) {
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
    }

    const hydratedItems: any[] = [];
    const alerts: string[] = [];
    let hasStaleItems = false;

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        alerts.push(`Product is no longer available.`);
        hasStaleItems = true;
        continue;
      }

      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant || !variant.inStock || variant.stock <= 0) {
        alerts.push(`"${product.name}" (${variant?.size || ''} / ${variant?.color || ''}) is now out of stock.`);
        hasStaleItems = true;
        hydratedItems.push({
          id: `${product._id.toString()}_${variant?.id || item.variantId}`,
          productId: product._id.toString(),
          variantId: item.variantId,
          product: product.toJSON(),
          variant: variant || { id: item.variantId, price: item.price, stock: 0, inStock: false },
          quantity: item.quantity,
          serverStock: 0,
          isStale: true,
          staleMessage: 'Out of stock',
          lineTotal: 0,
        });
        continue;
      }

      const availableStock = variant.stock;
      let isStale = false;
      let staleMessage: string | undefined;

      if (item.quantity > availableStock) {
        alerts.push(`"${product.name}" quantity adjusted from ${item.quantity} to available stock of ${availableStock}.`);
        isStale = true;
        staleMessage = `Stock reduced to ${availableStock}`;
        hasStaleItems = true;
      }

      const validQuantity = Math.min(item.quantity, availableStock);

      hydratedItems.push({
        id: `${product._id.toString()}_${variant.id}`,
        productId: product._id.toString(),
        variantId: variant.id,
        product: product.toJSON(),
        variant,
        quantity: validQuantity,
        serverStock: availableStock,
        isStale,
        staleMessage,
        lineTotal: variant.price * validQuantity,
      });
    }

    // Recalculate summary
    const validItems = hydratedItems.filter((i) => !i.isStale || i.serverStock > 0);
    const itemCount = validItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = validItems.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
    const originalTotal = validItems.reduce(
      (acc, item) => acc + (item.variant.originalPrice || item.variant.price) * item.quantity,
      0
    );
    const discount = Math.max(0, originalTotal - subtotal);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const shippingFee = subtotal > 500 || validItems.length === 0 ? 0 : 49;
    const total = subtotal + tax + shippingFee;

    return {
      items: hydratedItems,
      alerts,
      hasStaleItems,
      summary: {
        subtotal,
        discount,
        tax,
        shippingFee,
        total,
        itemCount,
      },
    };
  }

  /**
   * Add product variant item to user's MongoDB cart with stock validation.
   */
  public async addItem(userId: string, productId: string, variantId: string, quantity = 1) {
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error('Product not found.');
    }

    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant || !variant.inStock || variant.stock <= 0) {
      throw new Error(`Variant (${variant?.size || ''} / ${variant?.color || ''}) is out of stock.`);
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await CartModel.create({ userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > variant.stock) {
        throw new Error(`Cannot add more. Maximum available stock is ${variant.stock}.`);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      if (quantity > variant.stock) {
        throw new Error(`Requested quantity exceeds available stock of ${variant.stock}.`);
      }
      cart.items.push({
        productId,
        variantId,
        quantity,
        price: variant.price,
      });
    }

    await cart.save();
    return this.getCart(userId);
  }

  /**
   * Update item quantity in MongoDB cart with stock check.
   */
  public async updateItemQuantity(userId: string, productId: string, variantId: string, quantity: number) {
    let cart = await CartModel.findOne({ userId });
    if (!cart) return this.getCart(userId);

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      );
    } else {
      const product = await ProductModel.findById(productId);
      const variant = product?.variants.find((v) => v.id === variantId);
      const maxStock = variant ? variant.stock : quantity;

      const item = cart.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      if (item) {
        item.quantity = Math.min(quantity, maxStock);
      }
    }

    await cart.save();
    return this.getCart(userId);
  }

  /**
   * Remove item from MongoDB cart.
   */
  public async removeItem(userId: string, productId: string, variantId: string) {
    let cart = await CartModel.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      );
      await cart.save();
    }
    return this.getCart(userId);
  }

  /**
   * Clear user's MongoDB cart.
   */
  public async clearCart(userId: string) {
    let cart = await CartModel.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return this.getCart(userId);
  }

  /**
   * Process checkout with ATOMIC MONGODB STOCK GUARD ($gte & $inc).
   * Prevents overselling under concurrent checkouts and handles stale carts cleanly.
   */
  public async checkout(userId: string, shippingDetails: any) {
    const cartData = await this.getCart(userId);

    if (cartData.items.length === 0) {
      throw new Error('Your cart is empty.');
    }

    // Check for stale/out of stock items before attempting checkout
    const outOfStockItems = cartData.items.filter((i) => i.serverStock < i.quantity || i.isStale);
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((i) => i.product?.name || 'Item').join(', ');
      throw new Error(`Checkout refused: The following items in your cart are out of stock or exceed available quantity: ${names}. Please update your cart.`);
    }

    const successfulDeductions: { productId: string; variantId: string; quantity: number }[] = [];

    try {
      // Perform ATOMIC stock decrements in MongoDB Atlas
      for (const item of cartData.items) {
        const updatedProduct = await ProductModel.findOneAndUpdate(
          {
            _id: item.productId,
            'variants.id': item.variantId,
            'variants.stock': { $gte: item.quantity }, // ATOMIC STOCK GUARD (Must be >= requested quantity)
          },
          {
            $inc: { 'variants.$.stock': -item.quantity }, // ATOMIC DECREMENT
          },
          { returnDocument: 'after' }
        );

        if (!updatedProduct) {
          throw new Error(`Checkout failed: "${item.product?.name}" is out of stock or insufficient stock remains.`);
        }

        // Check if stock reached 0 and set inStock flag to false
        const variantIndex = updatedProduct.variants.findIndex((v) => v.id === item.variantId);
        if (variantIndex > -1 && updatedProduct.variants[variantIndex].stock <= 0) {
          updatedProduct.variants[variantIndex].inStock = false;
          await updatedProduct.save();
        }

        successfulDeductions.push({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
    } catch (error: any) {
      // Rollback any partial deductions if a multi-item checkout fails mid-way
      for (const ded of successfulDeductions) {
        await ProductModel.findOneAndUpdate(
          { _id: ded.productId, 'variants.id': ded.variantId },
          { $inc: { 'variants.$.stock': ded.quantity }, $set: { 'variants.$.inStock': true } }
        );
      }
      throw error;
    }

    // Clear user cart upon successful checkout
    await this.clearCart(userId);

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const orderDoc = await OrderModel.create({
      orderId,
      userId,
      items: cartData.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.product?.name || 'Product',
        size: item.variant?.size || '',
        color: item.variant?.color || '',
        sku: item.variant?.sku || '',
        price: item.variant?.price || 0,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      summary: cartData.summary,
      shippingDetails,
      paymentStatus: shippingDetails.paymentMethod === 'cod' ? 'PENDING_COD' : 'PAID',
      status: 'PLACED',
    });

    return orderDoc.toJSON();
  }
}

export const cartService = new CartService();
