import express from "express";
import {reviewControllers} from "../controllers/reviewController/review.controller.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import { isBuyer } from "../middleware/isBuyerMiddleware.js";

 export const reviewRouter = express.Router()

 reviewRouter.post('/review/create',isLoggedIn,isBuyer, reviewControllers.addReview)