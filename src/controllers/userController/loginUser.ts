import { Request, Response } from 'express';
import { UserService } from '../../services/registeruser.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class LoginController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.VERIFICATION_JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.cookie('jwt', token, { httpOnly: true, secure: true });
      res.clearCookie('loggedOut');

      const currentDate = new Date();
      const isPasswordExpired = user.passwordExpiresAt && user.passwordExpiresAt < currentDate;

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          roleId: user.roleId

        },
        isPasswordExpired
      });
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





