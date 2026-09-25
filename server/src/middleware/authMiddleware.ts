import { Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const payload = userService.verifyToken(token);
    const user = await userService.getUserById(payload.userId);

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired authentication token. Please log in again.',
    });
    return;
  }
};
