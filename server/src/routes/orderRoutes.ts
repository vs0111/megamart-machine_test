import { Router } from 'express';
import { createOrderController } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/orders
 * @desc    Create an order, decrement variant stock, clear user cart
 * @access  Protected / Authenticated
 */
router.post('/', createOrderController);

export default router;
