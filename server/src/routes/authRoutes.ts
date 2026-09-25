import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
} from '../controllers/authController.js';
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), registerController);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), loginController);

/**
 * @route   GET /api/auth/me
 * @desc    Get logged in user profile
 * @access  Private (Protected by JWT)
 */
router.get('/me', protect, getMeController);

export default router;
