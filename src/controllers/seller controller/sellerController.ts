import { Request, Response, response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { userService} from '../../services/registeruser.service.js'; 
import {ProductService} from '../../services/product.service.js';
import {SellerService} from '../../services/seller.Service.js';
import Role from '../../models/roleModel.js'
import { AuthenticatedRequest } from '../../middleware/checkSellerRole.js';
import User from '../../models/userModel.js';



class SellerController {
  // get products associated with seller
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
      const user = await User.findByPk(userId)

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const userRole = await Role.findByPk(user.dataValues.roleId) as any;

      if (userRole.dataValues.name !== 'seller') {
        res.status(403).json({ message: 'Only sellers can access this resource' });
        return;
      }

      const sellerServiceInstance = new SellerService;
      const products = await sellerServiceInstance.getProductsBySellerId(userId);

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
      
      const user = await User.findByPk(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const userRole = await Role.findByPk(user.dataValues.roleId) as any;
      if (userRole.dataValues.name !== 'seller') {
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

      const updatedProduct = await productServiceInstance.updateProduct(productId, { isAvailable });

      const availabilityMessage = isAvailable
        ? 'Product is now available for buyers'
        : 'Product is now unavailable for buyers';

      res.status(200).json({ message: `${availabilityMessage}`, product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
      console.error(error);
    }
  }

  // get only available products in the store
  async getAvailableProducts(req: Request, res: Response): Promise<void> {
    try {
      
      const sellerServiceInstance = new SellerService;
      const availableProducts = await sellerServiceInstance.getAvailableProducts();

      if (availableProducts.length === 0) {
        res.status(200).json({ message: 'No available products found' });
      } else {
        res.status(200).json({ message: 'Available products fetched successfully', products: availableProducts });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
      console.error(error);
    }
  }


  async getSellerProduct (req: AuthenticatedRequest, res: Response){
    const productId = parseInt(req.params.productId, 10);
    const userId =  req.userId;
  
    try {
      const productService = new ProductService();
      const isProductExist = await productService.getProductByFields({ productId, isAvailable: true });
      if (!isProductExist) {
        return res.status(404).json({ message: "Oops!!! There is no match for this product in available products" });
      }

      const sellerServiceInstance = new SellerService;   
      const item = await sellerServiceInstance.getProductByIdAndSellerId(productId, userId);
      if (!item) {
        return res.status(404).json({ message: "Oops!!! There is no match of the product in your products" });
      }
  
      return res.status(200).json({ message: "Product found in your products", product: item });
    } catch (error) {
      console.error('Error in getSellerProduct:', error);
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
  
}




export const sellerControllerInstance = new SellerController();