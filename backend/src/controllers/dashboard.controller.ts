import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getDashboardKPIs();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getDashboardAnalytics();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};