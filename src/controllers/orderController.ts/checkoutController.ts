// orderController.ts
import { Request, Response } from 'express';
import * as orderService from '../../services/orderService/orderService.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';
import {addToOrder} from '../../services/orderService/orderService.js'
import User from '../../models/userModel.js';

export const checkout = async (req: AuthenticatedRequest, res: Response) => {
  const { payment, address, email } = req.body;
  const currentUser =  await User.findOne({where: {email}})

  try {
  
    const newOrder = await orderService.addToOrder(currentUser, payment, address);

    return res.status(201).json({ message: 'Order processed successfully', order: newOrder });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
