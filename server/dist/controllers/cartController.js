"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = exports.clearCartController = exports.removeCartItemController = exports.updateCartItemController = exports.addToCartController = exports.getCartController = void 0;
const cartService_js_1 = require("../services/cartService.js");
const getUserId = (req) => {
    const authReq = req;
    if (authReq.user && authReq.user.id) {
        return authReq.user.id;
    }
    const sessionHeader = req.headers['x-session-id'];
    return sessionHeader || 'guest_default_session';
};
const getCartController = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const cartData = await cartService_js_1.cartService.getCart(userId);
        res.status(200).json({
            status: 'success',
            ...cartData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCartController = getCartController;
const addToCartController = async (req, res, next) => {
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
        const cartData = await cartService_js_1.cartService.addItem(userId, productId, variantId, Number(quantity) || 1);
        res.status(200).json({
            status: 'success',
            message: 'Item added to cart successfully.',
            ...cartData,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message || 'Failed to add item to cart.',
        });
    }
};
exports.addToCartController = addToCartController;
const updateCartItemController = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { productId, variantId, quantity } = req.body;
        const cartData = await cartService_js_1.cartService.updateItemQuantity(userId, productId, variantId, Number(quantity));
        res.status(200).json({
            status: 'success',
            message: 'Cart updated successfully.',
            ...cartData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartItemController = updateCartItemController;
const removeCartItemController = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { productId, variantId } = req.body;
        const cartData = await cartService_js_1.cartService.removeItem(userId, productId, variantId);
        res.status(200).json({
            status: 'success',
            message: 'Item removed from cart.',
            ...cartData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeCartItemController = removeCartItemController;
const clearCartController = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const cartData = await cartService_js_1.cartService.clearCart(userId);
        res.status(200).json({
            status: 'success',
            message: 'Cart cleared.',
            ...cartData,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.clearCartController = clearCartController;
const checkoutController = async (req, res, next) => {
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
        const orderConfirmation = await cartService_js_1.cartService.checkout(userId, shippingDetails);
        res.status(200).json({
            status: 'success',
            message: 'Order placed successfully!',
            order: orderConfirmation,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message || 'Checkout failed.',
        });
    }
};
exports.checkoutController = checkoutController;
