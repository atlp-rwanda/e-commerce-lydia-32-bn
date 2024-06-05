import Review, { ReviewAttributes } from "../models/review.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";


class reviewServices {
     async addReview(reviewDetail:ReviewAttributes){
        try{
            if(!reviewDetail.userId ){
              return ({status:401,message:"invalid user id"})
            }
            
            if(!reviewDetail.productId){
                return ({status:401,message:"invalid product id"})
            }
            if(!reviewDetail.RatingValue  && reviewDetail.review =='' || reviewDetail.review == '' ){
                return ({status:401,message:"enter Rating Value and Review MEssage"})
            }
            const user= await User.findByPk(reviewDetail.userId)
            const product = await Product.findByPk(reviewDetail.productId as number)
            if(!user){
                return ({status:401,message:`user not found user:${reviewDetail.userId}`})
            }
            if(!product){
                return ({status:401,message:"product not found"})
            }
        
        
            const reviews = await Review.create({
                userId:reviewDetail.userId,
                productId:reviewDetail.productId,
                RatingValue:reviewDetail.RatingValue,
                review:reviewDetail.review

            })
           return({status:201,message:"review sent to product"})
              
              }
            
            catch(error:any) {
                    return({status:500,
                    message:`Eroor ${error.message} occured while sending review`
                    })
                  }
    }
}

   export const reviewService = new reviewServices()