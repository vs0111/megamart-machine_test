import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.register(name, email, password);

    res.status(201).json({
      status: 'success',
      message: result.message,
      user: result.user,
    });
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes('already exists') || error.message.includes('sign in instead'))
    ) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const authData = await userService.login(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully!',
      user: authData.user,
      token: authData.token,
    });
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes('No account found') ||
        error.message.includes('Incorrect password') ||
        error.message.includes('sign up'))
    ) {
      res.status(401).json({
        status: 'fail',
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const getMeController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
  } catch (error) {
    next(error);
  }
};
