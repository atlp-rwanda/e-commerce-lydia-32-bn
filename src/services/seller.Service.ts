import Product from '../models/productModel.js';

export class SellerService {
  

  // method to retrieve all the products associated with a specific seller
async getProductsBySellerId(sellerId: number): Promise<Product[]> {
    try {
      const products = await Product.findAll({ where: { userId: sellerId } });
      return products;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }
  // retrive single product associated with seller
  async getProductByIdAndSellerId(productId: number, sellerId: number): Promise<Product | null> {
  try {
    const product = await Product.findOne({ where: { productId, userId: sellerId } });
    return product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error retrieving product: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred while retrieving product.');
    }
  }
}


// update product
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

  // get only available products in the store
async getAvailableProducts(): Promise<Product[]> {
    try {
      const products = await Product.findAll({ where: { isAvailable: true } });
      return products;
    } catch (error) {
      throw new Error('Failed to fetch available products');
    }
  }
}


export const sellerService = new SellerService();
