"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_js_1 = require("../controllers/orderController.js");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/orders
 * @desc    Create an order, decrement variant stock, clear user cart
 * @access  Protected / Authenticated
 */
router.post('/', orderController_js_1.createOrderController);
exports.default = router;
