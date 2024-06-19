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
    if(payment === undefined) {
      return res.status(404).json({
        message: 'payment is required'
      })
    }
    if(address === undefined) {
      return res.status(404).json({
        message: 'address is required'
      })
    }
    const newOrder = await orderService.addToOrder(currentUser, payment, address);

    return res.status(201).json({ message: 'Order processed successfully', order: newOrder });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const getOrderById = async(req: AuthenticatedRequest, res: Response) => {
try {
  const {id} = req.params
  const order = await orderService.getSingleOrder(Number(id))
  if(order.message) {
    return res.status(404).json(order)
  }
  return res.status(201).json(order);
} catch (error) {
  return res.status(500).json({ message: error });
}
}
export const cancelOrderById = async(req: AuthenticatedRequest, res: Response) =>{
try {
  const {id}= req.params
  const currentUser = req.user;
  const result = await orderService.cancelOrder(Number(id), currentUser)
  if(result.message) {
    return res.status(404).json(result)
   }
  return res.status(201).json({message: 'order canceled successfully', result});
} catch (error) {
  console.log(error)
  return res.status(500).json({ message: error });
}
}
export const getAllOrdersByBuyer = async(req: AuthenticatedRequest, res: Response) => {
try {
  const currentUser = req.user
  const orders = await orderService.getAllOrders(currentUser)
  if(orders.message) {
    return res.status(404).json(orders)
   }
  return res.status(201).json(orders);

} catch (error) {
  console.log(error)
  return res.status(500).json({ message: error });
}
}
export const getByAdminAllOrders = async(req: AuthenticatedRequest, res: Response) => {
try {
  const orders = await orderService.getAllOrdersByAdmin()
  return res.status(200).json(orders);
} catch (error) {
  console.log(error)
  return res.status(500).json({ message: error });
}
}
