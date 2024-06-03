import { Request, Response } from 'express';
import Joi from 'joi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Op } from 'sequelize'; // Import Op from sequelize
import { log } from 'console';
import Product from '../../models/productModel.js';
import { productService } from '../../services/product.service.js';
import { UserService } from '../../services/registeruser.service.js';
import { productSchema } from '../../validations/product.validation.js';
import Role from '../../models/roleModel.js';

interface ProductDetails {
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

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const productDetails: ProductDetails = req.body;
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: 'Unauthorized: Token is missing' });
      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.VERIFICATION_JWT_SECRET as string) as JwtPayload;
      const { userId } = decodedToken;
      const { error } = productSchema.validate(productDetails);
      if (error) {
        res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
        return;
      }

      // const UserService = new userService();
      const user = (await UserService.getUserById(userId)) as any;
      const userRole = (await Role.findByPk(user.dataValues.roleId)) as any;

      if (!user || userRole.dataValues.name !== 'seller') {
        res.status(403).json({ message: 'Only sellers can create products' });
        return;
      }

      // const productService = new ProductService();
      const existingProduct = await productService.getProductByNameAndSellerId(
        productDetails.productName,
        productDetails.userId,
      );
      if (existingProduct) {
        res.status(409).json({ message: 'Product already exists. Consider updating stock levels instead.' });
        return;
      }

      const createdProduct = await Product.create({
        userId: req.body.userId,
        productName: req.body.productName,
        description: req.body.description,
        productCategory: req.body.productCategory,
        price: req.body.price,
        quantity: req.body.quantity,
        images: req.body.images, // Pass images as a comma-separated string
        dimensions: req.body.dimensions,
        isAvailable: true,
      });

      res.status(201).json({ message: 'Product created successfully', product: createdProduct });
    } catch (error) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const productId = Number(req.params.productId);
    const updateFields = req.body;
    const loggedInUserId = Number(req.userId);

    try {
      // const productService = new productService();
      const product = await productService.getProductByFields({ productId });

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      if (product.userId !== loggedInUserId) {
        res.status(404).json({ message: 'you do not own this product therefore you can not update it' });
        return;
      }

      const updatedProduct = await productService.updateProduct(productId, updateFields);
      res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const productId: number = Number(req.params.productId);
    try {
      const { userId } = req.body;
      const user = (await UserService.getUserById(userId)) as any;
      const userRole = (await Role.findByPk(user.dataValues.roleId)) as any;

      if (user && userRole.dataValues.name == 'seller') {
        const productToBeDeleted = await productService.getProductByIdAndUserId(productId, userId);
        if (productToBeDeleted) {
          console.log(productToBeDeleted);
          await productService.deleteProduct(productToBeDeleted.productId);
          res.status(200).json({
            success: `Product with Id ${productId} is Deleted Successfully`,
          });
        } else {
          res.status(404).json({ Error: "Sorry Either Product Doesn't exists or doesn't belongs to you !" });
        }
      } else {
        res.status(403).json({ Warning: 'Only sellers can delete products' });
      }
    } catch (error) {
      res.status(500).json({ error });
      console.log(error);
    }
  }

  async searchProduct(req: Request, res: Response): Promise<void> {
    const { name, minPrice, maxPrice, category } = req.query;

    try {
      const searchCriteria: any = {};

      if (!name && !minPrice && !maxPrice && !category) {
        res.status(400).json({ error: 'Please provide a search parameter' });

        return;
      }

      if (name) {
        searchCriteria.productName = { [Op.iLike]: `%${name}%` };
      }

      if (minPrice) {
        searchCriteria.price = { ...searchCriteria.price, [Op.gte]: Number(minPrice) };
      }

      if (maxPrice) {
        searchCriteria.price = { ...searchCriteria.price, [Op.lte]: Number(maxPrice) };
      }

      if (category) {
        searchCriteria.productCategory = category;
      }

      const products = await Product.findAll({
        where: searchCriteria,
      });

      if (products.length === 0) {
        res.status(400).json({ error: 'there are no products that match your search criteria' });

        return;
      }

      res.status(200).json({ message: 'Products fetched successfully', products });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  }
}

export const ProductControllerInstance = new ProductController();
