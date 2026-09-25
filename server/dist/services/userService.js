"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_js_1 = require("../models/userModel.js");
const env_js_1 = require("../config/env.js");
const SALT_ROUNDS = 10;
class UserService {
    /**
     * Register a new user with hashed password and store in MongoDB Atlas.
     * Does NOT issue JWT token; user must log in through the login endpoint to receive token.
     */
    async register(name, email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        // Check if user already exists in MongoDB
        const existingUser = await userModel_js_1.UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            throw new Error('An account with this email address already exists. Please sign in instead.');
        }
        // Hash password using bcrypt
        const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        // Save user document in MongoDB
        const newUser = await userModel_js_1.UserModel.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
        });
        const user = {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
        };
        return {
            user,
            message: 'Account created successfully! Please sign in with your email and password.',
        };
    }
    /**
     * Authenticate user against MongoDB credentials.
     * Generates signed JWT token ONLY upon successful login.
     */
    async login(email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        // 1. Check if user is registered in MongoDB
        const existingUser = await userModel_js_1.UserModel.findOne({ email: normalizedEmail });
        if (!existingUser) {
            throw new Error('No account found with this email address. Please sign up / register first before logging in.');
        }
        // 2. Compare bcrypt password hash
        const isPasswordValid = await bcryptjs_1.default.compare(password, existingUser.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Incorrect password. Please verify your password and try again.');
        }
        const user = {
            id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
        };
        // Generate JWT token in login controller/service ONLY
        const token = this.generateToken(user.id, user.email);
        return { user, token };
    }
    /**
     * Get user profile by MongoDB ObjectId string.
     */
    async getUserById(id) {
        const found = await userModel_js_1.UserModel.findById(id);
        if (!found) {
            throw new Error('User profile not found in database.');
        }
        return {
            id: found._id.toString(),
            name: found.name,
            email: found.email,
        };
    }
    /**
     * Helper to generate signed JWT token.
     */
    generateToken(userId, email) {
        const payload = { userId, email };
        return jsonwebtoken_1.default.sign(payload, env_js_1.config.jwtSecret, {
            expiresIn: env_js_1.config.jwtExpiresIn,
        });
    }
    /**
     * Helper to verify and decode JWT token.
     */
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, env_js_1.config.jwtSecret);
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
