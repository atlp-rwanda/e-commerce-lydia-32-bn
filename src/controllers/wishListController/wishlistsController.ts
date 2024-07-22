import { Request, Response } from 'express';
import { wishListService } from '../../services/wishListService.js';
import { UserService } from '../../services/registeruser.service.js';
import Product from '../../models/productModel.js';

class WishListController {
  public addItemToWishList = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const productId = Number(req.params.productId);

      // Check if user is authenticated
      if (!userId) {
        res.status(401).json({ Error: 'You are not authenticated' });
      } else {
        const user = await UserService.getUserById(userId);
        if (user) {
          const product = await Product.findByPk(productId);
          if (!product) {
            res.status(404).json({ Error: 'Product not found' });
            return;
          }
        }
        // Check if the product already exists in the user's wish list
        const existingWishListItem = await wishListService.getWishListProduct(userId, productId);
        if (existingWishListItem) {
          res.status(400).json({ Warning: 'Product already in wish list' });
          return;
        }
        // Add product to wish list
        const wishListItem = await wishListService.addProductToWishList(userId, productId);
        res.status(201).json({ Message: 'Product added successfully to your wishList ', wishListItem });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Error adding product to wish list' });
    }
  };

  public removeItemFromWishList = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const itemId = Number(req.params.itemId);

      // Check if user is authenticated
      if (!userId) {
        res.status(401).json({ Error: 'User not authenticated' });
        return;
      }

      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json({ Error: 'User not found' });
        return;
      }

      const existingWishListItem = await wishListService.getWishListItem(userId, itemId);
      if (!existingWishListItem) {
        res.status(404).json({ Warning: `Item with id ${itemId} is not found in your wishlist` });
        return;
      }

      await wishListService.removeProductFromWishList(userId, itemId);
      res.status(200).json({ Success: 'Item successfully removed from wishlist' });
    } catch (error) {
      console.error('Error removing product from wish list:', error);
      res.status(500).json({ Error: 'Error removing product from wish list' });
    }
  };

  public getWishListItemsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const { wishList, products } = await wishListService.getWishListByUserId(userId);

      if (wishList.length === 0) {
        res.status(400).json({ Message: 'Your Wishlist is empty !' });
        return;
      }

      res.status(200).json({ wishList, products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Error retrieving your wish list items' });
    }
  };

  public getAllWishListItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const wishListItems = await wishListService.getAllWishListItems();
      if (wishListItems.length == 0) {
        res.status(400).json({ Message: 'No item found in users Wishlists !' });
        return;
      }
      res.status(200).json(wishListItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Error retrieving all wish list items' });
    }
  };
}

export const wishListController = new WishListController();
