import WishList from '../models/wishListModels.js';
import Product from '../models/productModel.js';

export class WishListService {
  async addProductToWishList(userId: number, productId: number): Promise<WishList> {
    try {
      const wishListItem = await WishList.create({ userId, productId });
      return wishListItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error adding product to wish list: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while adding product to wish list.');
      }
    }
  }

  async getAllWishListItems(): Promise<WishList[]> {
    try {
      const wishListItems = await WishList.findAll();
      // include: [{ model: Product, as: 'product' }],);
      return wishListItems;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving all wish list items: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving all wish list items.');
      }
    }
  }

  async getWishListByUserId(userId: number): Promise<{ wishList: WishList[]; products: any[] }> {
    try {
      const wishList = await WishList.findAll({
        where: { userId },
      });

      const productIds = wishList.map((item) => item.dataValues.productId);

      const productsPromises = productIds.map(async (productId: number) => {
        const product = await Product.findByPk(productId);
        return product?.dataValues;
      });

      const products = await Promise.all(productsPromises);

      return { wishList, products };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving wish list: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving wish list.');
      }
    }
  }

  async getWishListItem(userId: number, id: number): Promise<WishList | null> {
    try {
      const wishListItem = await WishList.findOne({
        where: { userId, id },
      });
      console.log(wishListItem);
      return wishListItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving wish list item: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving wish list item.');
      }
    }
  }

  async getWishListProduct(userId: number, productId: number): Promise<WishList | null> {
    try {
      const wishListProduct = await WishList.findOne({
        where: { userId, productId },
      });
      console.log(wishListProduct);
      return wishListProduct;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving wish list item: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving wish list item.');
      }
    }
  }

  async removeProductFromWishList(userId: number, id: number): Promise<void> {
    try {
      const wishListItem = await WishList.findOne({
        where: { userId, id },
      });
      if (!wishListItem) {
        throw new Error('Item not found in wish list');
      }
      await wishListItem.destroy();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error removing item from wish list: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while removing item from wish list.');
      }
    }
  }
}

export const wishListService = new WishListService();
