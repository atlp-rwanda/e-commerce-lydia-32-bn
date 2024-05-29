import { Request, Response } from 'express';
import { addToCart } from '../../services/cart.services.js';

/**
 * Controller to handle adding a product to the cart.
 * 
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export async function addToCartController(req: Request, res: Response): Promise<void> {
  const { productId, quantity, dimensions } = req.body;
  //@ts-ignore
  const userId = req.user.id; // Assuming user ID is available in req.user.id

  try {
    const cartItem = await addToCart(userId, productId, quantity, dimensions);
    res.status(201).json(cartItem);
  } catch (error:any) {
    res.status(400).json({ error: error.message });
  }
}
