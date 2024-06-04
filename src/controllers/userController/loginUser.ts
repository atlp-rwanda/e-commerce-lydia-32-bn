import { Request, Response } from 'express';

class LoginController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      res.clearCookie('loggedOut');
      res.status(200).json({ message: 'Login successful', token });
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
