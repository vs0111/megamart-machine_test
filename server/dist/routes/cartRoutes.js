"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_js_1 = require("../controllers/cartController.js");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/cart
 * @desc    Get current user shopping cart
 */
router.get('/', cartController_js_1.getCartController);
/**
 * @route   POST /api/cart/add OR POST /api/cart/items
 * @desc    Add item to cart
 */
router.post('/add', cartController_js_1.addToCartController);
router.post('/items', cartController_js_1.addToCartController);
/**
 * @route   PUT /api/cart/item OR PATCH /api/cart/items/:id
 * @desc    Update item quantity in cart
 */
router.put('/item', cartController_js_1.updateCartItemController);
router.patch('/items/:id', cartController_js_1.updateCartItemController);
/**
 * @route   DELETE /api/cart/item OR DELETE /api/cart/items/:id
 * @desc    Remove item from cart
 */
router.delete('/item', cartController_js_1.removeCartItemController);
router.delete('/items/:id', cartController_js_1.removeCartItemController);
/**
 * @route   DELETE /api/cart
 * @desc    Clear all items in cart
 */
router.delete('/', cartController_js_1.clearCartController);
/**
 * @route   POST /api/cart/checkout
 * @desc    Process order checkout and reserve stock
 */
router.post('/checkout', cartController_js_1.checkoutController);
exports.default = router;
