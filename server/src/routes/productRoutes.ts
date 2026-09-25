import { Router } from 'express';
import {
  getProductsController,
  getProductBySlugController,
  getCategoriesController,
} from '../controllers/productController.js';

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get paginated products with search, category filter, price range, and sort
 * @access  Public
 */
router.get('/', getProductsController);

/**
 * @route   GET /api/products/categories
 * @desc    Get list of unique categories
 * @access  Public
 */
router.get('/categories', getCategoriesController);

/**
 * @route   GET /api/products/:slug
 * @desc    Get product details by slug
 * @access  Public
 */
router.get('/:slug', getProductBySlugController);

export default router;
