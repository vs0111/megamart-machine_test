import { Router } from 'express';
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
  checkoutController,
} from '../controllers/cartController.js';

const router = Router();

/**
 * @route   GET /api/cart
 * @desc    Get current user shopping cart
 */
router.get('/', getCartController);

/**
 * @route   POST /api/cart/add OR POST /api/cart/items
 * @desc    Add item to cart
 */
router.post('/add', addToCartController);
router.post('/items', addToCartController);

/**
 * @route   PUT /api/cart/item OR PATCH /api/cart/items/:id
 * @desc    Update item quantity in cart
 */
router.put('/item', updateCartItemController);
router.patch('/items/:id', updateCartItemController);

/**
 * @route   DELETE /api/cart/item OR DELETE /api/cart/items/:id
 * @desc    Remove item from cart
 */
router.delete('/item', removeCartItemController);
router.delete('/items/:id', removeCartItemController);

/**
 * @route   DELETE /api/cart
 * @desc    Clear all items in cart
 */
router.delete('/', clearCartController);

/**
 * @route   POST /api/cart/checkout
 * @desc    Process order checkout and reserve stock
 */
router.post('/checkout', checkoutController);

export default router;
