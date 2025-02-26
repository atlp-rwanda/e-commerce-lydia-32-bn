import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

dotenv.config();

if (!process.env.VERIFICATION_JWT_SECRET) {
  throw new Error('Missing VERIFICATION_JWT_SECRET environment variable');
}

const JWT_SECRET: string = process.env.VERIFICATION_JWT_SECRET;

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      firstname?: string;
      usertype?: string;
      isAdmin?: boolean;
      isverified?: boolean;
      isBlocked?: boolean;
    }
  }
}

const userAuthJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token, Please Login again' });
      }
      const { userId, firstname, usertype, isAdmin, isverified, isBlocked } = decoded;

      req.userId = userId;
      req.firstname = firstname;
      req.usertype = usertype;
      req.isAdmin = isAdmin;
      req.isverified = isverified;
      req.isBlocked = isBlocked;
      const user = (await User.findByPk(userId)) as any;
      // @ts-ignore
      req.user = user.dataValues;

      if (isverified === false) {
        return res.status(403).json({ error: 'You are not Verified please verify your email at /verify' });
      }

      next();
    });
  } else {
    res.status(401).json({ error: 'You need to login to access this resource; Please login or create an account' });
  }
};

const sellerAuthJWT = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  if (!token) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token, Please Login again' });
      }
      const { userId, firstname, usertype, isAdmin, isverified, isBlocked } = decoded;
      req.userId = userId;
      req.firstname = firstname;
      req.usertype = usertype;
      req.isAdmin = isAdmin;
      req.isverified = isverified;
      req.isBlocked = isBlocked;

      const user = (await User.findByPk(userId)) as any;

      const userRole = (await Role.findByPk(user.dataValues.roleId)) as any;
      console.log('my user is:', userId);
      if (!user?.dataValues.isverified) {
        return res.status(403).json({ error: 'You are not Verified please verify your email at /verify' });
      }

      if (userRole.dataValues.name !== 'seller') {
        return res.status(403).json({
          error: 'You are not allowed to access this resource, Because this resource is reserved for sellers only',
        });
      }
      next();
    });
  } else {
    res.status(401).json({ error: 'You need to login to access this resource; Please login or create an account' });
  }
};

const adminAuthJWT = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  if (!token) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Failed to authenticate token, Please Login again' });
      }
      const { userId, firstname, usertype, isAdmin, isverified, isBlocked } = decoded;
      req.userId = userId;
      req.firstname = firstname;
      req.usertype = usertype;
      req.isAdmin = isAdmin;
      req.isverified = isverified;
      req.isBlocked = isBlocked;

      if (!isverified) {
        return res.status(403).json({ error: 'You are not Verified please verify your email at /verify' });
      }

      if (!isAdmin) {
        return res.status(403).json({
          error: 'You are not allowed to access this resource, Please contact the site administrator for assistance',
        });
      }
      next();
    });
  } else {
    res.status(401).json({ error: 'You need to login to access this resource; Please login or create an account' });
  }
};

export { userAuthJWT, sellerAuthJWT, adminAuthJWT };
