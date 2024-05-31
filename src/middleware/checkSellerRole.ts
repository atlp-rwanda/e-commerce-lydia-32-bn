import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService, RoleService } from '../services/services.js';
import {Request, Response, NextFunction} from 'express'
import  User from '../models/userModel.js';
import Role from '../models/roleModel.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
  userId?: any;
  }

export const authSellerRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token is missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
    const userId = decodedToken.userId ? decodedToken.userId : null;

    const user = await User.findByPk(userId) as any;
    const userRole = await Role.findByPk(user.dataValues.roleId) as any;

    if (!user || userRole.dataValues.name !== 'seller') {
      res.status(403).json({ message: 'Only sellers can create products' });
      return;
    }

    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};