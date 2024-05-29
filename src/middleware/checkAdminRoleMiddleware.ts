import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

export const isRoleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
    const userId = decodedToken.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRole = await Role.findByPk(user.dataValues.roleId);

    const checkRole = userRole?.dataValues.name;

    if (!userRole || userRole.dataValues.name !== 'admin') {
      return res.status(403).json({ message: `Access denied. Not an admin. ${checkRole}` });
    }
    console.log(
      `=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${checkRole} <<<<<<<<<<<<${user.dataValues.email}>>>>>>>>>><<<<<<<<<<<<<<<<<<<<>??????`,
    );
    next();
  } catch (error) {
    console.error('JWT Decoding Error:', error);
    return res.status(401).json({ message: 'Invalid token or unauthorized access.' });
  }
};
