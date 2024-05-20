import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/registeruser.service.js';
import sendVerificationToken from '../../helpers/sendEmail.js';

class userController {
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
      const user = await UserService.createUser(req.body);

      const token = jwt.sign(
        { userId: user.id, email: user.email, firstname: user.firstname },
        process.env.VERIFICATION_JWT_SECRET || '',
        { expiresIn: process.env.EXPIRATION_TIME },
      );

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
      const subject = 'Email Verification';
      const content = `
          <p>Hi ${user.firstname},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}">Verify Email</a></p>
          <p>If you did not sign up for this account, please ignore this email.</p>
          <p><strong>Important:</strong> For your security, please do not share this link with anyone.</p>
          <p>Best regards,</p>
        `;
      sendVerificationToken(user.email, subject, content);

      res.status(201).json({ message: 'Signup was successfull, Verification Email sent', token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.body;
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.isverified) {
        res.status(400).json({ error: 'User is already verified' });
        return;
      }

      const updatedUser = await UserService.updateUser(userId, { isverified: true });
      res.json({ message: 'User verified successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.getUserById(userId);
      if (user) {
        res.status(200).json({ message: 'User Retrieved succesfully', user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ message: 'Users Retrieved succesfully', users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const updates = req.body;
      const { userId: _,email, ...validUpdates } = updates;
      const user = await UserService.updateUser(userId, validUpdates);
      if (user) {
        res.status(200).json({ message: 'User updated successfully:', user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const deleted = await UserService.deleteUser(userId);
      if (deleted) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

export const UserController = new userController();
