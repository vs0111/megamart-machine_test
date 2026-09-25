"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Full Name is required' })
        .min(1, 'Full Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const firstError = error.errors[0]?.message || 'Invalid input data';
                res.status(400).json({
                    status: 'fail',
                    message: firstError,
                    errors: error.errors,
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
