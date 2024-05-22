import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SellerService } from '../services/seller.Service.js';
import { userService } from '../services/registeruser.service.js';


class SellerController {
  async getAllProductsBySeller(req: Request, res: Response): Promise<void> {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ message: 'Unauthorized: Token is missing' });
      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
      const userId = decodedToken.userId;

      const userServiceInstance = new userService();
      const user = await userServiceInstance.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (user.usertype !== 'seller') {
        res.status(403).json({ message: 'Only sellers can access this resource' });
        return;
      }

      const productServiceInstance = new SellerService();
      const products = await productServiceInstance.getProductsBySellerId(userId);

      if (products.length === 0) {
        res.status(200).json({ message: 'No products found for this seller' });
      } else {
        res.status(200).json({ message: 'Products fetched successfully', products });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
      console.error(error);
    }
  }

  

  // New method to toggle product availability
  async updateProductAvailability(req: Request, res: Response): Promise<void> {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: 'Unauthorized: Token is missing' });
      return;
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
      const userId = decodedToken.userId;
      const userServiceInstance = new userService();
      const user = await userServiceInstance.getUserById(userId);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      if (user.usertype !== 'seller') {
        res.status(403).json({ message: 'Only sellers can access this resource' });
        return;
      }
  
      const productId = parseInt(req.params.productId, 10);
      const { isAvailable } = req.body;
  
      if (isNaN(productId) || isAvailable === undefined) {
        res.status(400).json({ message: 'Invalid request parameters' });
        return;
      }
  
      const productServiceInstance = new SellerService();
      const product = await productServiceInstance.getProductByIdAndSellerId(productId, userId);
  
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
  
      const updatedProduct = await productServiceInstance.updateProductt(productId, { isAvailable });
  
      const availabilityMessage = isAvailable
        ? 'Product is now available for buyers'
        : 'Product is now unavailable for buyers';
  
      res.status(200).json({ message: `${availabilityMessage}`, product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
      console.error(error);
    }
  }
}


export const sellerControllerInstance = new SellerController();
