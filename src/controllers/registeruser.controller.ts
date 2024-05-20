import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/registeruser.service.js';
import sendVerificationToken from '../helpers/sendEmail.js';

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
      const user = await UserService.updateUser(userId, updates);
      if (user) {
        res.status(200).json({ message: 'User updated successfully', user });
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

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const { email, phone } = req.body;

      const user = await UserService.getUserByFields({ email, phone });

      if (!user) {
        res.status(401).json({ error: "the details you submitted do not match any user, please correct them or if you do not have an account, create a new one"});
        return;
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || '',
        { expiresIn: process.env.EXPIRATION_TIME },
      );

      const resetPasswordUrl = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
      
      const subject = 'Request for password reset';

      const content = `
            <p>Hi ${user.firstname},</p>
            <p>To reset your password please click the link below</p>
            <p><a href="${resetPasswordUrl}">Reset password</a></p>
            <p>If you did not try to reset your password, please ignore this email.</p>
            <p><strong>Important:</strong> For your security, please do not share this link with anyone.</p>
            <p>Best regards,</p>
            `;


      sendVerificationToken(user.email, subject, content);

      res.status(200).json({ message: "the password reset process has been started, check your email to confirm and reset your password", resetPasswordUrl})
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const token = req.query.token as string;
        
        if (!token) {
          res.status(400).json({ error: 'Token is required to verify email.' });
          return;
        }
      
      let decoded: any;

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (error) {
        
        res.status(401).json({ error: 'Invalid or expired token. Please request a new verification email.' });
      }

      const { userId, email } = decoded;

      const user = await UserService.getUserByFields({ id: userId, email });

      if (!user) {
        res.status(400).json({ error: "That user doesn't exist, there was a problem with your password setting, please contact the admin"})

        return;
      }

      const { password } = req.body

      if (!password) {
        res.status(400).json({ error: "Please input your password"})

        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserService.updateUser(user.id, { password: hashedPassword });

      const subject = 'Password Updated Successfully';

      const content = `
            <p>Hi ${user.firstname},</p>
            <p>Your password has been updated upon your request</p>
            <p><strong>Important:</strong> If you did not reset your password its a security risk, kindly contact the site adminstrator for assistance.</p>
            <p>Best regards,</p>
            `;


      sendVerificationToken(user.email, subject, content);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

export const UserController = new userController();
