import { Request, Response } from "express";
import Review from "../../models/review.js";

class reviewController{

    async addReview(req:Request,res:Response){
      const {userId, productId, RatingValue,review} = req.body
        try{

   const reviews = await Review.create({
    userId:userId,
    productId:productId,
    RatingValue:RatingValue,
    review:review
   })
  res.status(201).json({message:"review sent to product"})
      
      }
    
    catch(error:any) {
            if (error instanceof Error) {
              throw new Error(`Error creating product: ${error.message}`);
            } else {
              throw new Error('Unknown error occurred while creating product.');
            }
          }
    }
}
export  const reviewControllers= new reviewController()
