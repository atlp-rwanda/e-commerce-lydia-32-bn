import express from 'express';
import { Request, Response } from 'express';
import { wishListService } from '../../services/wishListService.js';
import { UserService } from '../../services/registeruser.service.js';
import Product from '../../models/productModel.js';
import User from '../../models/userModel.js';
export const removeItemFromWishList = async(req: Request, res: Response): Promise<void> =>{

    try {
        const userId = req.body.userId;
        const productId = Number(req.params.productId);
    
        // Check if user is authenticated
        if (!userId) {
          res.status(401).json({Error: 'User not authenticated'});
          return;
        } 
        else{
          const user = await UserService.getUserById(userId);
          if(user){
            const roleName = await User.getRoleName(userId);
            if(roleName==='buyer'){
              const product = await Product.findByPk(productId);
              if (!product) {
                res.status(404).json({Error: 'Product not found'});
                return;
            }
           }
           else{
            res.status(400).json({Error: 'Only  Buyers are allowed to remove items to wishlist'});
            return;
           }
            // Check if the product already exists in the user's wish list
            const existingWishListItem = await wishListService.getWishListItem(userId, productId);
            if (!existingWishListItem) {
               res.status(400).json({Warning :'Product is not found in your wishlist'});
               return;
            }
        // Add product to wish list
            const wishListItem = await wishListService.removeProductFromWishList(userId, productId);
            res.status(200).json({Success: 'Item successfully removed from wishlist'});
      }
      else{
          res.status(401).json({Warning : 'Only Buyers are allowed to access this end-point'});
          return;
      }
     }
     } catch (error) {
        console.error(error);
        res.status(500).json({Error: 'Error removing product to wish list'});
      }
          }
