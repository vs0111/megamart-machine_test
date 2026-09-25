import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../models/userModel.js';
import { config } from '../config/env.js';
import { User, AuthResponse, RegisterResponse, JWTPayload } from '../types/index.js';

const SALT_ROUNDS = 10;

export class UserService {
  /**
   * Register a new user with hashed password and store in MongoDB Atlas.
   * Does NOT issue JWT token; user must log in through the login endpoint to receive token.
   */
  public async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in MongoDB
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Save user document in MongoDB
    const newUser: IUser = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const user: User = {
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
  public async login(email: string, password: string): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user is registered in MongoDB
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (!existingUser) {
      throw new Error('No account found with this email address. Please sign up / register first before logging in.');
    }

    // 2. Compare bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Incorrect password. Please verify your password and try again.');
    }

    const user: User = {
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
  public async getUserById(id: string): Promise<User> {
    const found = await UserModel.findById(id);
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
  public generateToken(userId: string, email: string): string {
    const payload: JWTPayload = { userId, email };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }

  /**
   * Helper to verify and decode JWT token.
   */
  public verifyToken(token: string): JWTPayload {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  }
}

export const userService = new UserService();
