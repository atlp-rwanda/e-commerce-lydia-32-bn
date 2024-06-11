import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/registeruser.service.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js'; // Import the interface

export const passwordExpirationMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract userId from the authenticated user information set by isLoggedIn middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await UserService.getUserById(userId);
    console.log('Retrieved user:', user);

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
