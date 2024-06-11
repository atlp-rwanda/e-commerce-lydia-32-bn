import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/registeruser.service.js';

export const passwordExpirationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming req.user contains the authenticated user information
    // @ts-ignore
    const userId = req.user.id;
    const user = await UserService.getUserById(userId);

    if (user && user.passwordExpiresAt) {
      const currentDate = new Date();
      const expirationDate = new Date(user.passwordExpiresAt);

      // Check if the password has expired
      if (currentDate >= expirationDate) {
        // Password has expired, block access and redirect to password reset page
        return res.status(403).redirect('/reset-password');
      }
    }

    // Password has not expired, continue to the next middleware
    next();
  } catch (error) {
    console.error('Error in passwordExpirationMiddleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};