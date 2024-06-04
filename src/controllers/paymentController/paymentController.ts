import { Request, Response } from 'express';
import stripe from '../../config/stripe.js';
import Payment, { PaymentCreationAttributes } from '../../models/paymentModel.js';

interface PaymentRequestBody {
  amount: number;
  currency: string;
  orderId: number;
}

class PaymentController {
  public async createPaymentIntent(req: Request, res: Response): Promise<void> {

    const { amount, currency, orderId }: PaymentRequestBody = req.body;
    const userId = Number(req.userId);

    if (!userId) {
        res.status(400).send({ error: 'User ID is missing' });
        return;
      }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: {
            userId: userId.toString(),
            orderId: orderId.toString(),
          },
      });

      // Save payment details 
      const paymentId = await this.savePaymentDetails({
        userId,
        stripePaymentId: paymentIntent.id,
        amount,
        currency,
        orderId
      });

      res.status(201).send({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        paymentId,
      });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: error.message });
          } else {
            res.status(500).send({ error: 'An unknown error occurred' });
          }
    }
  }

  private async savePaymentDetails(paymentData: PaymentCreationAttributes): Promise<Payment> {
    try {
      const payment = await Payment.create(paymentData);
      return payment;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Error saving payment details: ' + error.message);
          } else {
            throw new Error('An unknown error occurred while saving payment details');
          }
    }
  }
}

export default new PaymentController();
