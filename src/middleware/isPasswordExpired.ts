import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/registeruser.service.js';

export const passwordExpirationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming req.user contains the authenticated user information
    // @ts-ignore
    const userId = 5;
    const user = await UserService.getUserById(userId);

    if (user && user.passwordExpiresAt) {
      const currentDate = new Date();
      const expirationDate = new Date(user.passwordExpiresAt);

      // Check if the password has expired
      if (currentDate >= expirationDate) {
        return res.status(403).json({
          status: 'Unauthorized',
          message: 'Your password has expired. Please reset your password to continue using the app.',
          resetPasswordUrl: 'https://your-app.com/reset-password'
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in passwordExpirationMiddleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};