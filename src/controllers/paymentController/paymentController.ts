import { Request, Response } from 'express';
import stripe from '../../config/stripe.js';
import Payment, { PaymentCreationAttributes } from '../../models/paymentModel.js';
import Order from '../../models/orderModel.js';

interface PaymentRequestBody {
  amount: number;
  currency: string;
  orderId: number;
  userId: number;
}

class PaymentController {
  public async createPaymentIntent(req: Request, res: Response): Promise<void> {

    const { amount, currency, orderId, userId }: PaymentRequestBody = req.body;

    if (!userId) {
        res.status(400).send({ error: 'User ID is missing' });
        return;
      }
    const order = await Order.findByPk(orderId);
    if(!order){
      res.status(400).send({ error: 'We con not find order with ID: '+orderId });
      return;
    }
    if (amount > order.totalAmount) { 
      res.status(400).send({ error: 'Payment amount exceeds order total amount' });
      return;
    }
    // const remainingBalance = order.totalAmount - order.totalPaid;
    // if (amount > remainingBalance) {
    //   res.status(400).send({ error: `Payment amount exceeds remaining balance. Remaining balance: ${remainingBalance}` });
    //   return;
    // }
      console.log('In CREATING PAYMENT INTENT')
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
      console.log('In SAVING PAYMENT DETAILS')
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

  public async handleWebhook(req: Request, res: Response): Promise<void> {
    console.log('In HANDLINGS WEBHOOK')
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_DEV;
    //console.log('Request body: ',req.body);
    //console.log('Signature: ',sig);
    //console.log('End-point secret: ',endpointSecret);

    if (!sig || !endpointSecret) {
      res.status(400).send({ error: 'Missing Stripe signature or endpoint secret' });
      return;
    }
    let event;
    console.log('In CREATING EVENTS')
    try {
      const payload = JSON.stringify(req.body);
      console.log('Payload ', payload);
      console.log('Request body: ',req.body);
      //console.log('Request Stringified body: ',JSON.stringify(req.body));
      event = stripe.webhooks.constructEvent(req.body, sig, "whsec_AwG9qCt9QkhJ4oTXoxdUbMzwJyOH6GkO");
      console.log('EVENT CONSTRUCTED')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }
    switch(event.type){
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
      //Update order status in database
     // await this.updateOrderStatus(paymentIntent.metadata.orderId, 'Paid');
        break;
      case 'payment_intent.payment_failed':
          const paymentIntentFailed = event.data.object;
          console.log('PaymentIntent failed!', paymentIntentFailed);
          break;
          
      case 'payment_intent.canceled':
          const paymentIntentCanceled = event.data.object;
          console.log('PaymentIntent was canceled!', paymentIntentCanceled);
          break;
          
      case 'payment_intent.processing':
          const paymentIntentProcessing = event.data.object;
          console.log('PaymentIntent is processing!', paymentIntentProcessing);
          break;
          
      case 'payment_intent.requires_action':
          const paymentIntentRequiresAction = event.data.object;
          console.log('PaymentIntent requires action!', paymentIntentRequiresAction);
          break;  
      default:
        res.status(400).send(`Unhandled event type ${event.type}`);
    }

    res.status(200).send();
  }
}

export default new PaymentController();
