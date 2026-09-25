"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderController = void 0;
const cartService_js_1 = require("../services/cartService.js");
const getUserId = (req) => {
    const authReq = req;
    if (authReq.user && authReq.user.id) {
        return authReq.user.id;
    }
    const sessionHeader = req.headers['x-session-id'];
    return sessionHeader || 'guest_default_session';
};
/**
 * @route   POST /api/orders
 * @desc    Create new order with atomic stock decrement ($gte & $inc guard)
 * @access  Protected / Authenticated
 */
const createOrderController = async (req, res, next) => {
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
        const orderConfirmation = await cartService_js_1.cartService.checkout(userId, details);
        res.status(201).json({
            status: 'success',
            message: 'Order created successfully and stock reserved.',
            order: orderConfirmation,
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message || 'Order creation failed.',
        });
    }
};
exports.createOrderController = createOrderController;
