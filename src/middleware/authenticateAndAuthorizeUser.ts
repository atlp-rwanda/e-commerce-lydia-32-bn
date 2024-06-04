import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModel from '../models/userModel.js';
import RoleModel from '../models/roleModel.js';
import sendSms from '../helpers/sendSms.js';
import sendVerificationToken from '../helpers/sendEmail.js';

dotenv.config();

if (!process.env.VERIFICATION_JWT_SECRET) {
  throw new Error('Missing VERIFICATION_JWT_SECRET environment variable');
}

const JWT_SECRET: string = process.env.VERIFICATION_JWT_SECRET;

class AuthenticateAndAuthorizeUserController {
  public async authenticateAndAuthorizeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      if (!user.dataValues.isverified) {
        res.status(401).json({ error: 'User is not verified' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const userRole = (await RoleModel.findByPk(user.dataValues.roleId)) as any;

      if (userRole.dataValues.name === 'seller') {
        await user.update({ hasTwoFactor: true });
        const twoFactorCode = Math.floor(10000 + Math.random() * 90000).toString();
        const [updatedRows, [updatedUser]] = await UserModel.update(
          { twoFactorSecret: twoFactorCode },
          { where: { id: user.dataValues.id }, returning: true },
        );

        if (updatedRows === 1) {
          const text = `Your 2FA code is: ${twoFactorCode}`;
          sendVerificationToken(user.dataValues.email, '2FA Code', text);
          sendSms(text, user.dataValues.phone);
          res.status(200).json({ message: '2FA code sent to your email' });
        } else {
          res.status(500).json({ error: 'Failed to update user' });
        }
        return;
      }

      const token = jwt.sign(
        {
          userId: user.dataValues.id,
          firstname: user.dataValues.firstname,
          isverified: user.dataValues.isverified,
          isBlocked: user.dataValues.isBlocked,
          roleId: user.dataValues.roleId,
        },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
      );

      const expiryDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
      res.cookie('jwt', token, { httpOnly: true, path: '/', expires: expiryDate });

      req.body.user = user;
      req.body.token = token;
      next();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const authenticateAndAuthorizeUserController = new AuthenticateAndAuthorizeUserController();
