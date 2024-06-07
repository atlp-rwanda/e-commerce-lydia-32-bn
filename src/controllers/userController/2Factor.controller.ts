import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/userModel.js';

dotenv.config();

if (!process.env.VERIFICATION_JWT_SECRET) {
  throw new Error('Missing VERIFICATION_JWT_SECRET environment variable');
}

const JWT_SECRET: string = process.env.VERIFICATION_JWT_SECRET;

export const verifyTwoFactor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { twoFactorCode } = req.body;

    const user = await User.findOne({ where: { twoFactorSecret: twoFactorCode } });

    if (!user || !user.dataValues.twoFactorSecret) {
      res.status(400).json({ error: 'Invalid user or 2FA not enabled' });
      return;
    }

    const storedTwoFactorCode = user.dataValues.twoFactorSecret;
    const verified = twoFactorCode === storedTwoFactorCode;

    if (verified) {
      await user.update({ twoFactorSecret: null });

      const token = jwt.sign(
        {
          userId: user.dataValues.id,
          firstname: user.dataValues.firstname,
          isverified: user.dataValues.isverified,
          isBlocked: user.dataValues.isBlocked,
        },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
      );

      const expiryDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

      res.cookie('jwt', token, { httpOnly: true, path: '/', expires: expiryDate });
      res.clearCookie('loggedOut');
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(400).json({ error: 'Invalid 2FA code' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};
