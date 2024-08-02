import { Request, Response } from 'express';
import { ReviewAttributes } from 'models/review.js';
import { reviewService } from '../../services/review.service.js';

class reviewController {
  async addReview(req: Request, res: Response) {
    const reviewDetail = req.body;
    const userId = parseInt(req.userId as string);

    try {
      const review = await reviewService.addReview(reviewDetail, userId);
      if (review) {
        res.status(review.status).json({ message: review.message });
      }
    } catch (error: any) {
      res.status(500).json({ message: `Error ${error.message} occured while sending review` });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.productId, 10);
      const reviews = await reviewService.getReviewsByProductId(productId);

      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
}
export const reviewControllers = new reviewController();
