"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_js_1 = require("../controllers/productController.js");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/products
 * @desc    Get paginated products with search, category filter, price range, and sort
 * @access  Public
 */
router.get('/', productController_js_1.getProductsController);
/**
 * @route   GET /api/products/categories
 * @desc    Get list of unique categories
 * @access  Public
 */
router.get('/categories', productController_js_1.getCategoriesController);
/**
 * @route   GET /api/products/:slug
 * @desc    Get product details by slug
 * @access  Public
 */
router.get('/:slug', productController_js_1.getProductBySlugController);
exports.default = router;
