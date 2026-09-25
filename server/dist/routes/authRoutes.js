"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_js_1 = require("../controllers/authController.js");
const validate_js_1 = require("../middleware/validate.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (0, validate_js_1.validateRequest)(validate_js_1.registerSchema), authController_js_1.registerController);
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', (0, validate_js_1.validateRequest)(validate_js_1.loginSchema), authController_js_1.loginController);
/**
 * @route   GET /api/auth/me
 * @desc    Get logged in user profile
 * @access  Private (Protected by JWT)
 */
router.get('/me', authMiddleware_js_1.protect, authController_js_1.getMeController);
exports.default = router;
