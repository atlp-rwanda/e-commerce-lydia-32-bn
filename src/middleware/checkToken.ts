import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to verify token from cookies
const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No authentication token found' });
  }

  jwt.verify(token, process.env.VERIFICATION_JWT_SECRET || '', (err: any, decoded: any) => {
    if (err) {
      console.log(token);
      console.log(err);
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }
    console.log('User ID is: ' , decoded);
    req.body.userId = (decoded as any).userId;
    next();
  });
};

export default checkToken;
