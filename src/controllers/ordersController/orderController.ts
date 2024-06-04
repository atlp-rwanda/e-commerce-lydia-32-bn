import { Request, Response } from 'express';
import OrderService from '../../services/orderService.js';

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { userId, items } = req.body;
      const orderData = { userId, items };
      const order = await OrderService.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  async getOrdersByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const orders = await OrderService.getOrdersByUserId(Number(userId));
      res.json(orders);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      };
    }
  }

 async getAllOrders (req:Request, res:Response) {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
}

export default new OrderController();