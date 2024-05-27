import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/registeruser.service.js';
import generateToken from '../../utilis/generateToken.js';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.VERIFICATION_JWT_SECRET) {
    throw new Error('Missing VERIFICATION_JWT_SECRET environment variable');
}

const JWT_SECRET: string = process.env.VERIFICATION_JWT_SECRET;

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
      { userId: user.id, firstname: user.firstname, usertype: user.usertype, isAdmin: user.isAdmin, isverified: user.isverified, isBlocked: user.isBlocked },
      JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION_TIME || '1h' }, 
    );

    const expiryDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    res.cookie(
      'jwt',
      token,
      {httpOnly: true, path: '/', expires: expiryDate},
      
  ),

    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
