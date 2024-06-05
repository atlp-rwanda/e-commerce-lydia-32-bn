import { Request, Response } from 'express';
import * as orderService from '../../services/orderService/orderService.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

interface AddressData {
  country: string;
  city: string;
  street: string;
}

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  const { payment, address } = req.body;
  const currentUser = req.user;

  try {
    const newOrder = await orderService.addToOrder(currentUser, payment, address);

    return res.status(201).json({ message: 'Order processed successfully', order: newOrder });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
