import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to verify token from cookies
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.VERIFICATION_JWT_SECRET || '', (err: any, decoded: any) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }

    req.body.userId = (decoded as any).userId;
    next();
  });
};

export default verifyToken;
