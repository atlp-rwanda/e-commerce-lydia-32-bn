import { Request, Response } from 'express';
import * as cartService from '../../services/cart.services.js';
import { UserAttributes } from '../../models/userModel.js';
import Product, { ProductCreationAttributes } from '../../models/productModel.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';
import { should } from 'chai';

export const addItemToCart = async (req: AuthenticatedRequest, res: Response) => {
  const currentUser = req.user;
  const { productId, quantity } = req.body;

  try {
    if (!currentUser || !currentUser.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const product = await Product.findByPk(productId);
    const productInCart = await cartService.getCartProduct(currentUser.id, productId);
    if (productId === undefined) {
      return res.status(404).json({
        message: 'productId is required',
      });
    }

    if (quantity === undefined) {
      return res.status(404).json({
        message: 'quantity is required',
      });
    }

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    if (product.dataValues.userId === currentUser.id) {
      return res.status(406).json({
        message: "You can't add your own product to cart",
      })
    }


    if (productInCart) {
      return res.status(400).json({
        message: 'Product Already In Your Cart. Please Consider updating quantities !',
      });
    }
    if (quantity > product!.dataValues.quantity) {
      return res.status(400).json({
        message: "Quantity can't exceed product stock",
      });
    }
    if (quantity <= 0) {
      return res.status(400).json({
        message: 'Invalid product quantity',
      });
    }
   
    const cart = await cartService.addToCart(quantity, product, currentUser);
    return res.status(201).json({ message: 'Item added to cart successfully', cart });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const viewUserCart = async (req: Request, res: Response) => {
  // @ts-ignore
  const currentUser: UserAttributes = req.user;
  try {
    const userCart = await cartService.viewCart(currentUser);

    return res.status(200).json(userCart);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteCart = async (req: Request, res: Response) => {
  // @ts-ignore
  const { user } = req;
  try {
    const result = await cartService.deleteCart(user);
    if (result.message) {
      return res.status(404).json(result);
    }
    res.status(200).json({ message: 'Cart deleted successfully', cart: result });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const cartItemId = Number(req.params.cartItemId);
  const { quantity } = req.body;

  if (isNaN(cartItemId) || cartItemId <= 0) {
    return res.status(400).json({ message: 'Invalid cart item ID' });
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const updatedItem = await cartService.updateCartItem(cartItemId, quantity);
    return res.status(200).json({ message: 'Item updated successfully', updatedItem });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const cartItemId = Number(req.params.cartItemId);

  try {
    const deletedItem = await cartService.deleteCartItem(cartItemId);
    return res.status(200).json({ message: 'Item deleted successfully', deletedItem });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
