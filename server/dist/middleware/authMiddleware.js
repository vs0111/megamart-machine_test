"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const userService_js_1 = require("../services/userService.js");
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            status: 'fail',
            message: 'Access denied. No token provided or invalid token format.',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = userService_js_1.userService.verifyToken(token);
        const user = await userService_js_1.userService.getUserById(payload.userId);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired authentication token. Please log in again.',
        });
        return;
    }
};
exports.protect = protect;
