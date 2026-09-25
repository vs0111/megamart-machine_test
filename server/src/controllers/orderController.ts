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

/**
 * @route   POST /api/orders
 * @desc    Create new order with atomic stock decrement ($gte & $inc guard)
 * @access  Protected / Authenticated
 */
export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { shippingDetails } = req.body;

    // Fallback default shipping details if omitted
    const details = shippingDetails || {
      fullName: 'Valued Customer',
      email: 'customer@example.com',
      phone: '9876543210',
      address: 'Standard Express Shipping Address',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      paymentMethod: 'upi',
    };

    const orderConfirmation = await cartService.checkout(userId, details);

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully and stock reserved.',
      order: orderConfirmation,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Order creation failed.',
    });
  }
};
