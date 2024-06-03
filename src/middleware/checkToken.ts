import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to verify token from cookies
const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const cookiesToken = req.cookies.jwt;
  const authHeader = req.headers.authorization;

  const headersToken = authHeader && authHeader.split(' ')[1];
  const token = cookiesToken || headersToken;
  if (!token) {
    return res.status(401).json({ message: 'No authentication token found' });
  }
  try {
    jwt.verify(token, process.env.VERIFICATION_JWT_SECRET || '', (err: any, decoded: any) => {
      if (err) {
        console.log(token);
        console.log(err);
        return res.status(500).json({ error: 'Failed to authenticate token' });
      }
      console.log('User ID is: ', decoded);
      req.body.userId = (decoded as any).userId;
      next();
    });
  } catch (error) {
    console.error('JWT Decoding Error:', error);
    return res.status(401).json({ message: 'Invalid token or unauthorized access.' });
  }
};

export default checkToken;
