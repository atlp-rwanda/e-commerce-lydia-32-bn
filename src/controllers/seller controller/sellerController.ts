import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SellerService } from '../../services/seller.Service.js';
import { userService } from '../../services/registeruser.service.js';
import Role from '../../models/roleModel.js';
import User from '../../models/userModel.js';


interface Product {
  dataValues: {
    [key: string]: any;
  };
  productId: number;
  userId: number;
  productName: string;
  description: string;
  productCategory: string;
  price: number;
  quantity: number;
  images: string;
  dimensions?: string;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductWithSeller extends Product {
  seller: {
    id: number;
    name: string;
    email: string;
  };
}

interface PaginationResponse {
  message: string;
  products: ProductWithSeller[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
}

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
    const user = await User.findByPk(userId)
   console.log('my user is', decodedToken)
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const userRole = await Role.findByPk(user.dataValues.roleId) as any;
    if (userRole.dataValues.name !== 'seller') {
      res.status(403).json({ message: 'Only sellers can access this resource' });
      return;
    }
    const productServiceInstance = new SellerService();
    const products = await productServiceInstance.getProductsBySellerId(userId) as any;

    // Pagination logic
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const offset = (page - 1) * limit;
    const totalProducts = products.length;

    const paginatedProducts = products.map((product: Product): ProductWithSeller => {
      const { productId, userId, productName, description, productCategory, price, quantity, images, dimensions, isAvailable, createdAt, updatedAt } = product;

      return {
        dataValues: product.dataValues,
        productId,
        userId,
        productName,
        description,
        productCategory,
        price,
        quantity,
        images,
        dimensions,
        isAvailable,
        createdAt,
        updatedAt,
        seller: {
          id: user.dataValues.id,
          name: user.dataValues.firstname,
          email: user.dataValues.email,
        },
      };
    });

    const productsWithSeller = paginatedProducts.slice(offset, offset + limit);

    const response: PaginationResponse = {
      message: 'Products fetched successfully',
      products: productsWithSeller,
      totalItems: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    };

    if (page < Math.ceil(totalProducts / limit)) {
      response.next = {
        page: page + 1,
        limit,
      };
    }

    if (page > 1) {
      response.previous = {
        page: page - 1,
        limit,
      };
    }

    if (productsWithSeller.length === 0) {
      res.status(200).json({ message: 'No products found for this seller', products:[] });
    } else {
      res.status(200).json(response);
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
  
  // get only available products in the store
  async getAvailableProducts(req: Request, res: Response): Promise<void> {
    try {
      const sellerServiceInstance = new SellerService();
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
}

export const sellerControllerInstance = new SellerController(); 

