import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
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

      if (usertype !== 'seller') {
        return res
          .status(403)
          .json({
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
        return res
          .status(403)
          .json({
            error: 'You are not allowed to access this resource, Please contact the site administrator for assistance',
          });
      }
      next();
    });
  } else {
    res.status(401).json({ error: 'You need to login to access this resource; Please login or create an account' });
  }
};

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

export { userAuthJWT, sellerAuthJWT, adminAuthJWT, verifyToken };
