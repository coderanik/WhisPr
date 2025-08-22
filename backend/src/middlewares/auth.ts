import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
  };
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // ✅ 1. Session check
  if (req.session.userId) return next();

  // ✅ 2. JWT check
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as any;
    req.session.userId = decoded.userId;
    req.session.username = decoded.name;
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Check session first
    if (req.session.userId) {
      const user = await User.findById(req.session.userId).select('_id name');
      if (user) {
        req.user = {
          _id: user._id.toString(),
          name: user.name
        };
        return next();
      }
    }

    // Check JWT token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as any;
    
    const user = await User.findById(decoded.userId).select('_id name');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name
    };

    // Update session
    req.session.userId = user._id.toString();
    req.session.username = user.name;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


