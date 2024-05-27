import express from 'express';
import { Request, Response } from 'express';
import { wishListService } from '../../services/wishListService.js';
import { UserService } from '../../services/registeruser.service.js';
import Product from '../../models/productModel.js';
export const addItemToWishList = async(req: Request, res: Response): Promise<void> =>{

    try {
        const userId = req.body.userId;
        const productId = Number(req.params.productId);
    
        // Check if user is authenticated
        if (!userId) {
          res.status(401).send('User not authenticated');
          return;
        } 
        else{
          const user = await UserService.getUserById(userId);
          if(user && user.usertype == 'buyer'){
            const product = await Product.findByPk(productId);
              if (!product) {
                res.status(404).send('Product not found');
                return;
           }
            // Check if the product already exists in the user's wish list
            const existingWishListItem = await wishListService.getWishListItem(userId, productId);
            if (existingWishListItem) {
               res.status(400).send('Product already in wish list');
               return;
            }
        // Add product to wish list
            const wishListItem = await wishListService.addProductToWishList(userId, productId);
            res.status(201).json(wishListItem);
      }
      else{
          res.status(401).send('Only Buyers are allowed to access this end-point');
          return;
      }
     }
     } catch (error) {
        console.error(error);
        res.status(500).send('Error adding product to wish list');
      }
          }
