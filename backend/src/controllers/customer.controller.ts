import { Request, Response, NextFunction } from 'express';
import * as customerService from '../services/customer.service';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const result = await customerService.getAllCustomers(page, limit, search);
    
    res.status(200).json({ 
      success: true, 
      data: result.data, 
      meta: result.meta 
    });
  } catch (error) {
    next(error);
  }
};