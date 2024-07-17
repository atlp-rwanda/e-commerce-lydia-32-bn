import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserAttributes } from '../models/userModel.js';

export interface AuthenticatedRequest extends Request {
  user?: UserAttributes;
}

export const isPasswordNotExpired = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // let token: string | undefined;
  try {
    const cookiesToken = req.cookies.jwt;
    const authHeader = req.headers.authorization;

    const headersToken = authHeader && authHeader.split(' ')[1];
    const token = cookiesToken || headersToken;

    if (!token) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'You are not logged in. Please login to continue.',
      });
    }

    const decoded: any = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string);
    const loggedUser: any = await User.findOne({ where: { id: decoded.userId } });

    if (!loggedUser) {
      return res.status(401).json({
        status: 'Unauthorized',
        message: 'Please login to continue',
      });
    }

    const currentDate = new Date();
    const userData = loggedUser.dataValues;
    const roleName = await User.getRoleName(loggedUser.dataValues.id);

    if (roleName === 'admin') {
      return next();
    }

    if (userData.passwordExpiresAt && userData.passwordExpiresAt < currentDate) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'Your password has expired. Please reset your password to continue.',
      });
    }

    req.user = userData;
    next();
  } catch (error: any) {
    return res.status(401).json({
      status: 'failed',
      error: `${error.message} Token has expired. Please login again.`,
    });
  }
};
