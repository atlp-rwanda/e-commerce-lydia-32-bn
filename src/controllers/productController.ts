import { Request, Response } from 'express';
import Joi from 'joi';
import { ProductService } from '../services/product.service.js'; 
import { userService } from '../services/registeruser.service.js'; 
import { productSchema } from '../validations/product.validation.js';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface ProductDetails{
  productId: number;
  userId: number;
  productName: string;
  description: string;
  productCategory: string;
  price: number;
  quantity: number;
  images: string[];
  dimensions?: string;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const productDetails: ProductDetails = req.body;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ message: 'Unauthorized: Token is missing' });
      return;
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
      const userId = decodedToken.userId;
  
      const { error } = productSchema.validate(productDetails);
      if (error) {
        res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
        return;
      }
  
      
      const UserService = new userService();
      const user = await UserService.getUserById(userId);
      if (!user || user.usertype !== 'seller') {
        res.status(403).json({ message: 'Only sellers can create products' });
        return;
      }
  
      
      const productService = new ProductService();
      const existingProduct = await productService.getProductByNameAndSellerId(productDetails.productName, productDetails.userId);

      if (existingProduct) {
        res.status(200).json({ message: 'Product already exists. Consider updating stock levels instead.', product: existingProduct });
        return;
      }

  
  
      const createdProduct = await productService.createProduct(productDetails);
      res.status(201).json({ message: 'Product created successfully', product: createdProduct });
    } catch (error) {
      res.status(500).json({ message: `Error creating product: ${(error as Error).message}` });
    }
  }
}

export const ProductControllerInstance = new ProductController();
