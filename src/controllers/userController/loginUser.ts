import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/registeruser.service.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Finding the user with the provided email
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check if the user is verified
    if (!user.isverified) {
      res.status(401).json({ error: 'User is not verified' });
      return;
    }

    // Comparing provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, firstname: user.firstname },
      process.env.VERIFICATION_JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' },
    );
    res.clearCookie('loggedOut');
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
