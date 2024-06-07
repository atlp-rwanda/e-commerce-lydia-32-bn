import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import {generateToken} from '../../utilis/generateToken.js';
import sendSms from '../../helpers/sendSms.js'
import sendVerificationToken from '../../helpers/sendEmail.js';
import dotenv from 'dotenv';
import Role from '../../models/roleModel.js';

class LoginController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      res.clearCookie('loggedOut');
      res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('jwt', { path: '/' });
      res.cookie('loggedOut', true, { httpOnly: true, path: '/', maxAge: 60 * 1000 });
      res.status(200).json({ message: 'Logout successful' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

export const loginController = new LoginController();
