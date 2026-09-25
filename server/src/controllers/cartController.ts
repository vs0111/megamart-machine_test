import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService.js';
import { AuthenticatedRequest } from '../types/index.js';

const getUserId = (req: Request): string => {
  const authReq = req as AuthenticatedRequest;
  if (authReq.user && authReq.user.id) {
    return authReq.user.id;
  }
  const sessionHeader = req.headers['x-session-id'] as string;
  return sessionHeader || 'guest_default_session';
};

export const getCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const cartData = await cartService.getCart(userId);
    res.status(200).json({
      status: 'success',
      ...cartData,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { productId, variantId, quantity } = req.body;

    if (!productId || !variantId) {
      res.status(400).json({
        status: 'fail',
        message: 'productId and variantId are required.',
      });
      return;
    }

    const cartData = await cartService.addItem(userId, productId, variantId, Number(quantity) || 1);
    res.status(200).json({
      status: 'success',
      message: 'Item added to cart successfully.',
      ...cartData,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to add item to cart.',
    });
  }
};

export const updateCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { productId, variantId, quantity } = req.body;

    const cartData = await cartService.updateItemQuantity(
      userId,
      productId,
      variantId,
      Number(quantity)
    );
    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully.',
      ...cartData,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { productId, variantId } = req.body;

    const cartData = await cartService.removeItem(userId, productId, variantId);
    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart.',
      ...cartData,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const cartData = await cartService.clearCart(userId);
    res.status(200).json({
      status: 'success',
      message: 'Cart cleared.',
      ...cartData,
    });
  } catch (error) {
    next(error);
  }
};

export const checkoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { shippingDetails } = req.body;

    if (!shippingDetails) {
      res.status(400).json({
        status: 'fail',
        message: 'Shipping details are required for checkout.',
      });
      return;
    }

    const orderConfirmation = await cartService.checkout(userId, shippingDetails);
    res.status(200).json({
      status: 'success',
      message: 'Order placed successfully!',
      order: orderConfirmation,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Checkout failed.',
    });
  }
};
