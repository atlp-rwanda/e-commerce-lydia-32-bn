import express from "express";
import {reviewControllers} from "../controllers/reviewController/review.controller.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import { BuyerMiddleware} from "../middleware/BuyerMiddleware.js";

 export const reviewRouter = express.Router()

 reviewRouter.post('/review/create',isLoggedIn,BuyerMiddleware, reviewControllers.addReview)