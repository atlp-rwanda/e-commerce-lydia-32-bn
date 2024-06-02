import { Request, Response } from 'express';

class LoginController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = req.body;
      res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
}

export const loginController = new LoginController();
