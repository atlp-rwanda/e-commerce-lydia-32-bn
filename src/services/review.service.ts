import Review, { ReviewAttributes } from "../models/review.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";


class reviewServices {
     async addReview(reviewDetail:ReviewAttributes,userId:number){
        try{
            if(!userId ){
              return ({status:401,message:`invalid user id ${userId}`})
            }
            
            if(!reviewDetail.productId){
                return ({status:401,message:"invalid product id"})
            }
            if(!reviewDetail.RatingValue  && reviewDetail.review =='' || reviewDetail.review == '' ){
                return ({status:401,message:"enter Rating Value and Review MEssage"})
            }
             const purchasedProduct = await Order.findAll({where:{userId:userId}})
        //    if(!purchasedProduct.includes(reviewDetail.productId)){}
         if(!purchasedProduct){
            return ({status:401,message:"you are not in order list"})
         }
            const reviews = await Review.create({
                userId:userId,
                productId:reviewDetail.productId,
                RatingValue:reviewDetail.RatingValue,
                review:reviewDetail.review

            })
           return({status:201,message:"review sent to product"})
              
              }
            
            catch(error:any) {
                    return({status:500,
                    message:`Eroor ${error.message} occured while sending review ${userId}`
                    })
                  }
    }
}

   export const reviewService = new reviewServices()