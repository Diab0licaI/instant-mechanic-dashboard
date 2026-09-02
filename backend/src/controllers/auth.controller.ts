import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { loginSchema } from '../validators/auth.validator';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Zod Validation
    const parsedBody = loginSchema.parse(req.body);
    
    // 2. Call Service
    const data = await authService.loginUser(parsedBody.email, parsedBody.password);
    
    // 3. Send Response
    res.status(200).json({ success: true, message: 'Login successful', data });
  } catch (error: any) {
    if (error.name === 'ZodError') {
       res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
       return;
    }
    res.status(401).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  // With standard JWTs, the frontend destroys the token. We just return a success message.
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const setup = async (req: Request, res: Response) => {
  try {
    const user = await authService.setupAdminUser();
    res.status(201).json({ success: true, message: 'Admin created', data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};