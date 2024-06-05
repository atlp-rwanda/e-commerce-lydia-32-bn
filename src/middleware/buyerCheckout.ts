import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService, RoleService } from '../services/services.js';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: any;
}

export const buyerCheckout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Please login to proceed with checkout.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
    const userId = decodedToken.userId ? decodedToken.userId : null;

    const user = await User.findByPk(userId, { include: { model: Role } }) as any;
    const userRole = user.Role; 

    if (!user || userRole.name !== 'buyer') {
      res.status(403).json({ message: 'Forbidden. Only buyers can proceed with checkout.' });
      return;
    }

    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};