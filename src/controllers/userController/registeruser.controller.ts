import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/registeruser.service.js';
import sendEmailMessage from '../../helpers/sendEmail.js';
import { generateToken, verifyToken } from '../../utilis/generateToken.js';
import { validateUserCreation } from '../../validations/registeruser.validation.js';
import dotenv from 'dotenv';
dotenv.config();


class userController {
  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Validate the request body
      const validationErrors = validateUserCreation(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      const { email, firstname, password } = req.body;

      // Check if the email already exists
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) {
        if (existingUser.isverified) {
          return res.status(400).json({ message: 'Email already in use' });
        } else {
          // Delete the existing unverified user
          await UserService.deleteUser(existingUser.id);
        }
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user
      const user = await UserService.createUser({
        ...req.body,
        password: hashedPassword,
      });

      const token = generateToken(res, user.id, email, firstname);

      const verificationUrl = `${process.env.BACKEND_URL}/api/users/verify?token=${token}`;
      const subject = 'Email Verification';
      const content = `
          <p>Hi ${user.firstname},</p>
          <div>Thank you for signing up! Please verify your email address by clicking the link below:</div>
          <div><a href="${verificationUrl}">Verify Email</a></div>
          <div>If you did not sign up for this account, please ignore this email.</div>
          <div><strong>Important:</strong> For your security, please do not share this link with anyone.</div>
          <div>Best regards,</div>
        `;
      sendEmailMessage(user.email, subject, content);

      return res.status(201).json({ message: 'Signup was successfull, Verification Email sent' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  verifyUser = async (req: Request, res: Response): Promise<void> => {
    const verifiedurl = process.env.VERIFIED_URL;
    const verifyFailedurl = process.env.VERIFY_FAILED_URL;

    try {
      const token = req.query.token as string;

      if (!token) {
        res.redirect(`${verifyFailedurl}?message=${encodeURIComponent('No token provided')}`);
        return;
      }

      const decodedToken = verifyToken(token);

      if (!decodedToken) {
        res.redirect(`${verifyFailedurl}?message=${encodeURIComponent('Invalid token or expired.')}`);
        return;
      }

      const { userId } = decodedToken;
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.redirect(`${verifyFailedurl}?message=${encodeURIComponent('User not found')}`);
        return;
      }

      if (user.isverified) {
        res.redirect(
          `${verifiedurl}?message=${encodeURIComponent('Your email is already verified. You can now log in to your account.')}`,
        );
        return;
      }

      await UserService.updateUser(userId, { isverified: true });

      const subject = 'Successful Email Verification';
      const content = `
        <p>Hi ${user.firstname},</p>
        <div>Congratulations! Your email address has been successfully verified.</div>
        <div>You can now fully enjoy all the features of our platform.</div>
        <div>If you have any questions or need further assistance, feel free to contact our support team.</div>
        <div>Best regards,</div>
        <div>The E-Commerce Lydia Team</div>
      `;

      sendEmailMessage(user.email, subject, content);

      res.redirect(
        `${verifiedurl}?message=${encodeURIComponent('Your email has been successfully verified. You can now log in to your account.')}`,
      );
    } catch (error: any) {
      console.error('Verification error:', error);
      res.redirect(
        `${verifyFailedurl}?message=${encodeURIComponent('An error occurred during verification. Please try again later.')}`,
      );
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const { newPassword, oldPassword } = req.body;
      const userId = parseInt(req.userId as string);
      const user = await UserService.changePassword(userId, oldPassword, newPassword);

      if (user) {
        res.status(user.code).json({ message: user.message });
      } else {
        res.status(500).json({ error: 'user not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await UserService.getUserById(userId);
      if (user) {
        return res.status(200).json({ message: 'User Retrieved succesfully', user });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json({ message: 'Users Retrieved succesfully', users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updates = req.body;
      const userId = parseInt(req.userId as string);
      const { userId: _, email, password, ...validUpdates } = updates;

      const user = await UserService.updateUserInfo(userId, updates);
      if (user) {
        return res.status(200).json({ message: 'User updated successfully', user });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const deleted = await UserService.deleteUser(userId);
      if (deleted) {
        return res.status(200).json({ message: 'User deleted successfully' });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const user = await UserService.getUserByFields({ email });

      if (!user) {
        res.status(401).json({
          error:
            'the details you submitted do not match any user, please correct them or if you do not have an account, create a new one',
        });
        return;
      }

      if (!user.isverified) {
        res.status(401).json({ error: 'User is not verified' });
        return;
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.VERIFICATION_JWT_SECRET || '', {
        expiresIn: process.env.EXPIRATION_TIME,
      });

      const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const subject = 'Request for password reset';

      const content = `
            <p>Hi ${user.firstname},</p>
            <p>To reset your password please click the link below</p>
            <p><a href="${resetPasswordUrl}">Reset password</a></p>
            <p>If you did not try to reset your password, please ignore this email.</p>
            <p><strong>Important:</strong> For your security, please do not share this link with anyone.</p>
            <p>Best regards,</p>
            `;

      sendEmailMessage(user.email, subject, content);

      res.status(200).json({
        message: 'the password reset process has been started, check your email to confirm and reset your password',
        resetPasswordUrl,
      });
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
        decoded = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET!);
      } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token. Please request a new verification email.' });
      }

      const { userId, email } = decoded;

      const user = await UserService.getUserByFields({ id: userId, email });

      if (!user) {
        res.status(400).json({
          error: "That user doesn't exist, there was a problem with your password setting, please contact the admin",
        });

        return;
      }

      const { password } = req.body;

      if (!password) {
        res.status(400).json({ error: 'Please input your password' });

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

      sendEmailMessage(user.email, subject, content);

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'User is not logged in' });
        return;
      }

      res.clearCookie('jwt', { path: '/' });

      res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
}

export const UserController = new userController();
