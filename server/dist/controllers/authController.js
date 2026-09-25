"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeController = exports.loginController = exports.registerController = void 0;
const userService_js_1 = require("../services/userService.js");
const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await userService_js_1.userService.register(name, email, password);
        res.status(201).json({
            status: 'success',
            message: result.message,
            user: result.user,
        });
    }
    catch (error) {
        if (error.message &&
            (error.message.includes('already exists') || error.message.includes('sign in instead'))) {
            res.status(400).json({
                status: 'fail',
                message: error.message,
            });
            return;
        }
        next(error);
    }
};
exports.registerController = registerController;
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const authData = await userService_js_1.userService.login(email, password);
        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully!',
            user: authData.user,
            token: authData.token,
        });
    }
    catch (error) {
        if (error.message &&
            (error.message.includes('No account found') ||
                error.message.includes('Incorrect password') ||
                error.message.includes('sign up'))) {
            res.status(401).json({
                status: 'fail',
                message: error.message,
            });
            return;
        }
        next(error);
    }
};
exports.loginController = loginController;
const getMeController = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                status: 'fail',
                message: 'Not authenticated',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            user: req.user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMeController = getMeController;
