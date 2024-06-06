import express from 'express';
import { wishListController } from '../controllers/wishListController/wishlistsController.js';
import { isRoleAdmin } from '../middleware/checkAdminRoleMiddleware.js';
import { isBuyer } from '../middleware/isBuyerMiddleware.js';
import { userAuthJWT } from '../middleware/verfication.middleware.js';

export const wishListRouter = express.Router();

/**
 * @swagger
 * /api/wishlist/addItem/{productId}:
 *   post:
 *     summary: Add Item to your Wishlist
 *     description: Endpoint to add item to wishlist.
 *     tags: [WishLists]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of product to be added to wishlist
 *     responses:
 *       '201':
 *         description: Item added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishList'
 *       '400':
 *         description: Bad request - Product Is Already in Your WishList
 *       '401':
 *         description: Unauthorized - You are not authenticated
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Internal server error
 */
wishListRouter.post('/wishlist/addItem/:productId', userAuthJWT, isBuyer, wishListController.addItemToWishList);

/**
 * @swagger
 * /api/wishlist/removeItem/{itemId}:
 *   delete:
 *     summary: Remove Item from your Wishlist
 *     description: Endpoint to remove item from wishlist.
 *     tags: [WishLists]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of item to be removed from your wishlist
 *     responses:
 *       '201':
 *         description: Item removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishList'
 *       '400':
 *         description: Bad request - Item is not found in Your WishList
 *       '401':
 *         description: Unauthorized - You are not authenticated
 *       '404':
 *         description: Item not found
 *       '500':
 *         description: Internal server error
 */
wishListRouter.delete('/wishlist/removeItem/:itemId', userAuthJWT, isBuyer, wishListController.removeItemFromWishList);

/**
 * @swagger
 * /api/wishlist/getUserWishlists:
 *   get:
 *     summary: Retrieve all items from your Wishlist
 *     description: Endpoint to get items from User's wishlist.
 *     tags: [WishLists]
 *     responses:
 *       '201':
 *         description: Items retrieved from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishList'
 *       '400':
 *         description: Bad request - No Items found in Your WishList
 *       '401':
 *         description: Unauthorized - You are not authenticated
 *       '404':
 *         description: Wishlist not found
 *       '500':
 *         description: Internal server error
 */
wishListRouter.get('/wishlist/getUserWishlists', userAuthJWT, isBuyer, wishListController.getWishListItemsByUser);

/**
 * @swagger
 * /api/wishlist/getAllWishlists:
 *   get:
 *     summary: Retrieve all Wishlists
 *     description: Endpoint to get all Users' wishlists.
 *     tags: [WishLists]
 *     responses:
 *       '201':
 *         description: Users' wishlists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishList'
 *       '400':
 *         description: Bad request - No Users' Wishlist found
 *       '401':
 *         description: Unauthorized - You are not authenticated
 *       '404':
 *         description: Wishlist not found
 *       '500':
 *         description: Internal server error
 */
wishListRouter.get('/wishlist/getAllWishlists', isRoleAdmin, wishListController.getAllWishListItems);
