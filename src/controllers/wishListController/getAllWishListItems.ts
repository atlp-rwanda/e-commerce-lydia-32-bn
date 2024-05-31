import { Request, Response } from 'express';
import { wishListService } from '../../services/wishListService.js';
import { UserService } from '../../services/registeruser.service.js';

export const getAllWishListItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const wishListItems = await wishListService.getAllWishListItems();
      res.status(200).json(wishListItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Error retrieving all wish list items' });
    }
  };