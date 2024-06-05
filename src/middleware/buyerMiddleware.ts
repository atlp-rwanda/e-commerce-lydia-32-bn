import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: any;
}

export const BuyerMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please login to proceed with checkout.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
    const userId = decodedToken.userId ? decodedToken.userId : null;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }

    const user = await User.findByPk(userId, { include: { model: Role, as: 'Role' } }) as any;
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const userRole = user.Role?.dataValues;
    console.log('User:', user.dataValues);
    console.log('User Role:', userRole);

    if (!userRole || userRole.name !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can proceed with review.' });
    }

    req.user = user.dataValues;
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Error verifying token or fetching user:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
