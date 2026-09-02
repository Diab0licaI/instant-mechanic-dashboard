import { Request, Response, NextFunction } from 'express';
import * as mechanicService from '../services/mechanic.service';
import { MechanicStatus } from '@prisma/client';

export const getMechanics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = req.query.status as MechanicStatus | undefined;

    const result = await mechanicService.getAllMechanics(page, limit, search, status);
    
    res.status(200).json({ 
      success: true, 
      data: result.data, 
      meta: result.meta 
    });
  } catch (error) {
    next(error);
  }
};