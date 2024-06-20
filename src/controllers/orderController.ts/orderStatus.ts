import { Request, Response } from 'express';
import { getOrderByIdAndBuyerId, updateOrderStatus } from '../../services/orderService/orderService.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';

class OrderStatusController {
  async getOrderStatus(req: AuthenticatedRequest, res: Response) {
    const { orderId } = req.params;
    const buyerId = Number(req.userId);

    try {
      const order = await getOrderByIdAndBuyerId(orderId, buyerId);

      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      res.status(200).json({
        message: 'Your order and its status was found',
        orderStatus: order.dataValues.status,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      const updatedOrder = await updateOrderStatus(orderId, status);

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json({
        message: 'Order status updated successfully',
        status: updatedOrder.status,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const OrderStatusControllerInstance = new OrderStatusController();
