import { Request, Response } from 'express';
import { Op } from 'sequelize'; // Import Op from sequelize
import Product from '../../models/productModel.js';
import { productService } from '../../services/product.service.js';
import User from '../../models/userModel.js';
import Role from '../../models/roleModel.js';

interface ProductDetails {
  productId?: number;
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
    const { userId } = req;

    try {
      const existingProduct = await productService.getProductByNameAndSellerId(
        productDetails.productName,
        Number(userId),
      );
      if (existingProduct) {
        res.status(409).json({ message: 'Product already exists. Consider updating stock levels instead.' });
        return;
      }

      const createdProduct = await Product.create({
        userId: Number(userId),
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
    const sellerId = Number(req.userId);

    try {
      const product = await productService.getProductByFields({ productId });

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      if (product.userId !== sellerId) {
        res.status(403).json({ message: 'You do not own this product, therefore you cannot update it' });
        return;
      }

      const updatedProduct = await productService.updateProduct(productId, updateFields);
      res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error: any) {
      res.status(500).json({ message: error });
      console.log(error);
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const productId: number = Number(req.params.productId);
    try {
      const userId = Number(req.userId);
      const user = (await User.findByPk(userId)) as any;
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
