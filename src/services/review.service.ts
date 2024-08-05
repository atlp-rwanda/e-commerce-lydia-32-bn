import Review, { ReviewAttributes } from '../models/review.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import sendEmailMessage from '../helpers/sendEmail.js';

class ReviewServices {
  async addReview(reviewDetail: ReviewAttributes, userId: number) {
    try {
      if (!userId) {
        return { status: 400, message: `Invalid user ID ${userId}` };
      }

      if (!reviewDetail.productId) {
        return { status: 400, message: 'Invalid product ID' };
      }

      const productExistt = await Product.findByPk(reviewDetail.productId as number);

      if (!productExistt) {
        return { status: 400, message: 'Product no longer exists' };
      }

      // Check if the user is the owner of the product
      if (productExistt.dataValues.userId === userId) {
        return { status: 403, message: 'You cannot review your own product' };
      }

      if (userId == reviewDetail.productId) {
        return { status: 403, message: 'You are not allowed to review your own Item' };
      }

      if (reviewDetail.RatingValue === undefined || reviewDetail.RatingValue === null || reviewDetail.review === '') {
        return { status: 400, message: 'Enter Rating value and Review Message' };
      }

      if (reviewDetail.RatingValue < 0 || reviewDetail.RatingValue > 5) {
        return { status: 400, message: 'Enter Rating Value between 0-5' };
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
          typeof order.dataValues.items === 'string' ? JSON.parse(order.dataValues.items) : order.dataValues.items;

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
        return { status: 400, message: `You didn't buy this product ${userId}` };
      }

      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const product = await Product.findByPk(reviewDetail.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const review = await Review.create({
        userId,
        productId: reviewDetail.productId,
        RatingValue: reviewDetail.RatingValue,
        review: reviewDetail.review,
      });

      const customerPositiveReviewlEmail = `
    <p>Dear ${user.dataValues.firstname},</p>
    <p>Thank you so much for taking the time to leave us a positive review!</br> 
       We are thrilled to hear that you had a great experience with product <strong>${product.dataValues.productName}.</strong></br>
       Your kind words mean a lot to us and serve as a reminder of why we do what we do.</p>
    <p>If there's anything else we can assist you with, or if you have any further feedback, please </br>don't hesitate to reach out. We look forward to serving you again soon!</p>
    <p>Best regards,</p>
    <p>Ecommerce team<br>
       Customer Nare Manager<br>
       atlp32tl@gmail.com<br>
      `;

      const customerNeutralReviewlEmail = `
      <p>Dear ${user.dataValues.firstname},</p>
    <p>Thank you for taking the time to share your thoughts on product <strong>${product.dataValues.productName}.</strong> <br> We appreciate your feedback and are glad to hear that you had an overall satisfactory experience. However,<br> we understand that there may be areas where we can improve.</p>
    <p>Please feel free to share more details about your experience so that we can strive to do better.<br>We value your input and look forward to hearing from you.</p>
      <p>Best regards,</p>
      <p>Ecommerce team<br>
         Customer Nare Manager<br>
         atlp32tl@gmail.com<br>
        `;

      const customerNegativeReviewlEmail = `
        <p>Dear ${user.dataValues.firstname},</p>
<p>We are truly sorry to hear about your experience with product <strong>${product.dataValues.productName}.</strong> Your feedback is very important to us,<br>and we want to make things right. Please accept our sincere apologies for any inconvenience caused.</p>
    <p>Could you please provide more details about the issue you faced? This will help us understand <br> what went wrong and how we can prevent it from happening again in the future.<br>We appreciate your patience and look forward to resolving this matter to your satisfaction.</p>
        <p>Best regards,</p>
        <p>Ecommerce team<br>
           Customer Nare Manager<br>
           atlp32tl@gmail.com<br>
          `;

      try {
        if (reviewDetail.RatingValue === 5) {
          sendEmailMessage(user.dataValues.email, 'Thank You for Your Positive Review!', customerPositiveReviewlEmail);
        } else if (reviewDetail.RatingValue <= 4 && reviewDetail.RatingValue > 2) {
          sendEmailMessage(user.dataValues.email, 'Thank You for Your Feedback', customerNeutralReviewlEmail);
        } else if (reviewDetail.RatingValue <= 2) {
          sendEmailMessage(
            user.dataValues.email,
            "We're Sorry to Hear About Your Experience",
            customerNegativeReviewlEmail,
          );
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      return { status: 201, message: 'Review submitted successfully', review, userId };
    } catch (error: any) {
      console.error('Error occurred while submitting review:', error);
      throw new Error(`Error occurred while submitting review: ${error.message}`);
    }
  }

  async getReviewsByProductId(productId: number): Promise<Review[]> {
    try {
      const reviews = await Review.findAll({ where: { productId } });
      return reviews;
    } catch (error) {
      throw new Error('Failed to fetch reviews');
    }
  }
}

export const reviewService = new ReviewServices();
