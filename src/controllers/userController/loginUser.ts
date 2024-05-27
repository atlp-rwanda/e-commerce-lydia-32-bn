import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/registeruser.service.js';
import generateToken from '../../utilis/generateToken.js';

let isLoggedIn = false;

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the user is already logged in
    if (isLoggedIn) {
      res.status(400).json({ error: 'You are already logged in' });
      return;
    }

    let user;
    try {
      user = await UserService.getUserByEmail(email);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

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

    const token = generateToken(res, user.id, user.email, user.firstname);
    isLoggedIn = true;
    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};