import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
