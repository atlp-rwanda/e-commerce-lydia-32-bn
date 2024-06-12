import Review, { ReviewAttributes } from '../models/review.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

class ReviewServices {
  async addReview(reviewDetail: ReviewAttributes, userId: number) {
    try {
      if (!userId) {
        return { status: 400, message: `Invalid user ID ${userId}` };
      }

      if (!reviewDetail.productId) {
        return { status: 400, message: 'Invalid product ID' };
      }

      if ((reviewDetail.RatingValue === undefined || reviewDetail.RatingValue === null) && reviewDetail.review === '') {
        return { status: 400, message: 'Enter Rating Value and Review Message' };
      }

      if (reviewDetail.RatingValue < 0 || reviewDetail.RatingValue > 10) {
        return { status: 400, message: 'Enter Rating Value between 0-10' };
      }

      const productExist = await Product.findByPk(reviewDetail.productId as number);
      if (!productExist) {
        return { status: 400, message: 'Product no longer exists' };
      }

      const orders = await Order.findAll({ where: { userId } });
      if (orders.length === 0) {
        return { status: 400, message: 'No orders found for this user' };
      }

      let hasPurchasedProduct = false;

      for (const order of orders) {
        const products: any[] =
          typeof order.dataValues.products === 'string'
            ? JSON.parse(order.dataValues.products)
            : order.dataValues.products;

        if (!products || !Array.isArray(products)) {
          continue;
        }

        for (const product of products) {
          if (product.productId === reviewDetail.productId) {
            hasPurchasedProduct = true;
            break;
          }
        }

        if (hasPurchasedProduct) {
          break;
        }
      }

      if (!hasPurchasedProduct) {
        return { status: 400, message: "You didn't buy this product" };
      }

      const review = await Review.create({
        userId,
        productId: reviewDetail.productId,
        RatingValue: reviewDetail.RatingValue,
        review: reviewDetail.review,
      });

      return { status: 201, message: 'Review submitted successfully', review };
    } catch (error: any) {
      console.error(`Error: ${error.message}`, error); // Improved logging
      return {
        status: 500,
        message: `Error ${error.message} occurred while submitting review`,
      };
    }
  }
}

export const reviewService = new ReviewServices();
