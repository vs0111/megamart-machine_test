"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
const cartRoutes_js_1 = __importDefault(require("./routes/cartRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check Endpoint
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'MegaMart E-Commerce Server is running',
        timestamp: new Date().toISOString(),
    });
});
// Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/products', productRoutes_js_1.default);
app.use('/api/cart', cartRoutes_js_1.default);
app.use('/api/orders', orderRoutes_js_1.default);
// 404 Route Handler
app.use((_req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'API route not found',
    });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled Error:', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
exports.default = app;
