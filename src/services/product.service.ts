import Product from '../models/productModel.js';

export class ProductService {
  async createProduct(productDetails: Product): Promise<Product> {
    try {
      const product = await Product.create(productDetails);
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
          userId: seller_id
        }
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

  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product | null> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const updatedProduct = await product.update(updates);
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
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting product: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while deleting product.');
      }
    }
  }
}

export const productService = new ProductService();
