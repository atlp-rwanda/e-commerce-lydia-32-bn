import { Request, Response } from 'express';
import OrderItemService from '../../services/orderItemService.js';

class OrderItemController {
  async createOrderItem(req: Request, res: Response) {
    try {
      const { orderId, productId, quantity, price } = req.body;
      const orderItemData = { orderId, productId, quantity, price };
      const orderItem = await OrderItemService.createOrderItem(orderItemData);
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderItemsByOrderId(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const orderItems = await OrderItemService.getOrderItemsByOrderId(orderId);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateOrderItem(req: Request, res: Response) {
    try {
      const orderItemId = Number(req.params.id);
      const { quantity, price } = req.body;
      const updatedOrderItem = await OrderItemService.updateOrderItem(orderItemId, { quantity, price });
      res.json(updatedOrderItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteOrderItem(req: Request, res: Response) {
    try {
      const orderItemId = req.params.id;
      await OrderItemService.deleteOrderItem(Number(orderItemId));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new OrderItemController();