import { Request, Response } from "express";
import * as cartService from '../../services/cart.services.js'
import { UserAttributes } from "../../models/userModel.js";
import { ProductCreationAttributes } from "../../models/productModel.js";


export const addItemToCart = async (req: Request, res: Response) => {
  //@ts-ignore
  const currentUser: UserAttributes | undefined = req.user;
  //@ts-ignore
  const product :ProductCreationAttributes= req.product;
  //@ts-ignore
  const quantity = req.quantity;


  try {
    //@ts-ignore
    await cartService.addTocart(quantity, product, currentUser);
    return res.status(201).json({ message: "Item added to cart successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, currentUser });
  }
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  //@ts-ignore
  const userCart = req.userCart; 
  try {

    await cartService.removeFromCart(parseInt(productId), userCart);
    
    return res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const clearAllProductFromCart = async (req: Request, res: Response) => {
  //@ts-ignore
  const currentUser: UserAttributes = req.user;
  try {
    const cleared = await cartService.clearCart(currentUser);
    if (cleared === true) {
      res.status(200).json({
        message: "Your cart was successfully cleared",
      });
    } else {
      return res.status(404).json({
        message: "You don't have any Product in cart",
      });
    }
  } catch (error: any) {
    if (error.message === "NP") {
      return res.status(404).json({
        message: "You don't have any Product in cart",
      });
    } else {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};


export const updateProductQuantity = async (req: Request, res: Response) => {
  //@ts-ignore
  const currentUser:UserAttributes = req.user;
  const {quantity,productId } = req.body;
  try {

    await cartService.updateCart(quantity, productId, currentUser)
    
    return res.status(200).json({
      message: "product updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
}


export const viewUserCart = async (req: Request, res: Response) => {
  //@ts-ignore
  const currentUser: UserAttributes = req.user
  try {
    const { userCart, isNew} = await cartService.viewCart(currentUser)
    
    if (isNew) {
      return res.status(201).json({ userCart });
    } else return res.status(200).json({ userCart });
    
    
  } catch (error:any) {
    return res.status(500).json({ message: error.message });    
  }
}