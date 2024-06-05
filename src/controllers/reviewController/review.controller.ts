import { Request, Response } from "express";
import {reviewService} from '../../services/review.service.js'
import { ReviewAttributes } from "models/review.js";

class reviewController{

    async addReview(req:Request,res:Response){
      // const {userId,productId,review,RatingValue} = req.body
    const reviewDetail = req.body
     try{

       const review = await reviewService.addReview(reviewDetail)
       if(review){
         res.status(review.status).json({message:review.message})
        }
        
      }
      catch(error:any){
        res.status(500).json({message:`Error ${error.message} occured while sending review`})
      }
    }
}
export  const reviewControllers= new reviewController()
