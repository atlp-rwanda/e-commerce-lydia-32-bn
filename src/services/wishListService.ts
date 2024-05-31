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
  async getWishListByUserId(userId: number): Promise<WishList[]> {
    try {
      const wishList = await WishList.findAll({
        where: { userId },
        //include: [{ model: Product, as: 'product' }],
      });
      return wishList;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving wish list: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving wish list.');
      }
    }
  }


    async getWishListItem(userId: number, productId: number): Promise<WishList | null> {
    try {
      const wishListItem = await WishList.findOne({
        where: { userId, productId },
      });
      return wishListItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error retrieving wish list item: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while retrieving wish list item.');
      }
    }
  }

  async removeProductFromWishList(userId: number, productId: number): Promise<void> {
    try {
      const wishListItem = await WishList.findOne({
        where: { userId, productId },
      });
      if (!wishListItem) {
        throw new Error('Product not found in wish list');
      }
      await wishListItem.destroy();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error removing product from wish list: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while removing product from wish list.');
      }
    }
  }
}

export const wishListService = new WishListService();
