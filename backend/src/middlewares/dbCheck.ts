import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const checkDatabaseConnection = (req: Request, res: Response, next: NextFunction) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database not connected',
      message: 'Please wait for the database connection to be established',
      status: 'connecting'
    });
  }
  
  next();
};

export const optionalDatabaseCheck = (req: Request, res: Response, next: NextFunction) => {
  // For non-critical routes, just log the status
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  Database not ready, but continuing with request');
  }
  
  next();
};
