import { Op } from 'sequelize'; // Import Op from sequelize
import Product from '../models/productModel.js';
import ProductAttributes from '../models/productModel.js';
import notificationEmitter from '../utilis/eventEmitter.js';

export class ProductService {
  async createProduct(productDetails: Product): Promise<Product> {
    try {
      const product = await Product.create(productDetails);

      notificationEmitter.removeAllListeners('productAdded');
      notificationEmitter.emit('productAdded', product);

      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while creating product.');
      }
    }
  }

  async getProductByNameAndSellerId(name: string, seller_id: number): Promise<Product | null> {
    try {
      const product = await Product.findOne({
        where: {
          productName: name,
          userId: seller_id,
        },
      });
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving product.');
      }
    }
  }

  async getProductById(productId: number): Promise<Product | null> {
    try {
      const product = await Product.findOne({
        where: {
          productId,
        },
      });
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving product.');
      }
    }
  }

  async getProductByIdAndUserId(productid: number, userId: number): Promise<Product | null> {
    try {
      const product = await Product.findOne({
        where: {
          productId: productid,
          userId,
        },
      });
      console.log(product);
      return product ? (product.toJSON() as Product) : null;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving product.');
      }
    }
  }

  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product | null> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const updatedProduct = await product.update(updates);

      notificationEmitter.removeAllListeners('productUpdated');
      notificationEmitter.emit('productUpdated', product);

      return updatedProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while updating product.');
      }
    }
  }

    async updateProductQuantity(productId: number, quantity: number): Promise<Product | null> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      product.quantity = quantity;
      const updatedProduct = await product.update(product);

      notificationEmitter.removeAllListeners('productUpdated');
      notificationEmitter.emit('productUpdated', product);

      return updatedProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while updating product.');
      }
    }
  }
  async deleteProduct(productId: number): Promise<void> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      await product.destroy();
      notificationEmitter.removeAllListeners('productDeleted');
      notificationEmitter.emit('productDeleted', product);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while deleting product.');
      }
    }
  }

  // get only available products in the store
  async getAvailableProducts(): Promise<Product[]> {
    try {
      const products = await Product.findAll({ where: { isAvailable: true } });
      return products;
    } catch (error) {
      throw new Error('Failed to fetch available products');
    }
  }

  async getProductByFields(fields: Partial<ProductAttributes>): Promise<ProductAttributes | null> {
    try {
      const product = await Product.findOne({
        where: {
          [Op.and]: fields,
        },
      });
      return product ? (product.toJSON() as ProductAttributes) : null;
    } catch (error: any) {
      throw new Error(`Error fetching product by fields: ${error.message}`);
    }
  }
}
export const productService = new ProductService();
