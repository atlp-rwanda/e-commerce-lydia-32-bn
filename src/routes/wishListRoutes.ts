import express from "express";
//import verifyToken from '../middleware/verfication.middleware.js';
import checkToken from "../middleware/checkToken.js";
import { addItemToWishList } from "../controllers/wishListController/addProductToWishList.js";
import { getAllWishListItems} from "../controllers/wishListController/getAllWishListItems.js"

export const wishListRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: WishLists
 *   description: WishLists Management routes
 */

/**
 * @swagger
 * /api/wishlist/addItem/:productId:
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
 *         description: ID of product to be deleted
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
wishListRouter.post('/wishlist/addItem/:productId', checkToken, addItemToWishList);


/**
 * @swagger
 * /api/wishlist/getAllItems:
 *   get:
 *     summary: Get All Wishlists
 *     description: Endpoint to get items from wishlist.
 *     tags: [WishLists]
 *     responses:
 *       '201':
 *         description: Items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WishList'
 *       '400':
 *         description: Bad request - Product Is Already in Your WishList
 *       '401':
 *         description: Unauthorized - You are not authenticated
 *       '404':
 *         description: No wishlist found
 *       '500':
 *         description: Internal server error
 */
wishListRouter.get('/wishlist/getAllItems', checkToken, getAllWishListItems);