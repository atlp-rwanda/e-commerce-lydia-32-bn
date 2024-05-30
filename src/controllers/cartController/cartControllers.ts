import { Request, Response } from "express";
import * as cartService from '../../services/cart.services.js'
import { UserAttributes } from "../../models/userModel.js";
import Product, { ProductCreationAttributes } from "../../models/productModel.js";
import { AuthenticatedRequest } from "middleware/authMiddleware.js";


export const addItemToCart = async (req: AuthenticatedRequest, res: Response) => {
  const currentUser = req.user
  const { productId, quantity } = req.body;

  try {

    if (!currentUser || !currentUser.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const product = await Product.findByPk(productId);

   if (!product) {
     return res.status(404).json({
       message: 'Product not found',
     });
   } else if (quantity > product!.dataValues.quantity) {
     return res.status(400).json({
       message: "Quantity can't exceed product stock",
     });
   } else if (quantity <= 0) {
     return res.status(400).json({
       message: 'Invalid product quantity',
     });
   } else if (product.dataValues.userId === currentUser.id) {
     res.status(403).json({
       message: "You can't add your own product to cart",
     });
   }
    await cartService.addToCart(quantity, product, currentUser);
    return res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};





export const viewUserCart = async (req: Request, res: Response) => {
  //@ts-ignore
  const currentUser: UserAttributes = req.user
  try {
    const userCart= await cartService.viewCart(currentUser)
    
    return res.status(200).json(userCart);
    
  } catch (error:any) {
    return res.status(500).json({ message: error.message });    
  }
}