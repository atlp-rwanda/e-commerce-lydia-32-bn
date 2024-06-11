// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2024-04-10',
// });

// export default stripe;

import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

class StripeConfig{
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-04-10',
    });
  }
 async createStripeSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    metadata: Stripe.MetadataParam,
    success_url: string,
    cancel_url: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: metadata,
    });
  
    return session;
  }
  
   async checkPaymentStatus(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }
  
  async deleteSession(sessionId: string) {
    await this.stripe.checkout.sessions.expire(sessionId);
  }
}

export default new StripeConfig();