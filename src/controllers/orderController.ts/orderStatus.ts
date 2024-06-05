import { Request, Response } from 'express';
import { ORDER_STATUS } from '../../utilis/orderStatusConstants.js'
import { getOrderByIdAndBuyerId, updateOrderStatus } from '../../services/orderService/orderService.js'
import { io } from '../../server.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';


class OrderStatusController{

    async getOrderStatus(req: AuthenticatedRequest, res: Response){
        const { orderId } = req.params;
        const buyerId = Number(req.userId); 
      
        try {
          const order = await getOrderByIdAndBuyerId(orderId, buyerId);
      
          if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }
      
          return res.status(200).json({
            orderId: order.id,
            orderStatus: order.status,
          });
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error' });
        }
      };
      
      
      
      
     async updateOrderStatus(req: Request, res: Response){
        const { orderId } = req.params;
        const { orderStatus } = req.body;
      
      
       
        if (!Object.values(ORDER_STATUS).includes(orderStatus)) {
          return res.status(400).json({ message: 'Invalid order status' });
        }
      
        try {
          
          const updatedOrder = await updateOrderStatus(orderId, orderStatus);
      
          if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
          }
      
          
          io.emit('orderStatusUpdate', {
            orderId: updatedOrder.id,
            orderStatus: updatedOrder.status,
          });
      
          return res.status(200).json({
            orderId: updatedOrder.id,
            orderStatus: updatedOrder.status,
          });
        } catch (error) {
          return res.status(500).json({ message: 'Internal server error' });
        }
      };
}

export const OrderStatusControllerInstance = new OrderStatusController;

