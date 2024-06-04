import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

const isRoleAuthorized = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cookiesToken = req.cookies.jwt;
    const authHeader = req.headers.authorization;
    const headersToken = authHeader && authHeader.split(' ')[1];
    const token = cookiesToken || headersToken;
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No Authentication token provided.' });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
      const userId = decodedToken.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userRole = await Role.findByPk(user.dataValues.roleId);

      if (!userRole || !requiredRoles.includes(userRole.dataValues.name)) {
        return res
          .status(403)
          .json({ message: `Access denied. Unauthorized role: ${userRole ? userRole.dataValues.name : 'none'}` });
      }

      console.log(`Role: ${userRole.dataValues.name}, User: ${user.dataValues.email}`);
      next();
    } catch (error) {
      console.error('JWT Decoding Error:', error);
      return res.status(401).json({ message: 'Invalid token or unauthorized access.' });
    }
  };
};

export const isRoleAdmin = isRoleAuthorized(['admin']);
export const isRoleBuyer = isRoleAuthorized(['buyer']);
export const isRoleSeller = isRoleAuthorized(['seller']);
