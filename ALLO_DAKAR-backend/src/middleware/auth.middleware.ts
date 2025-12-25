import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    userType?: 'CLIENT' | 'DRIVER';
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            userType: string;
        };

        req.userId = decoded.userId;
        req.userType = decoded.userType as any;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const requireDriver = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userType !== 'DRIVER') {
        return res.status(403).json({ error: 'Only drivers can access this route' });
    }
    next();
};

export const requireClient = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.userType !== 'CLIENT') {
        return res.status(403).json({ error: 'Only clients can access this route' });
    }
    next();
};
