import Payment, { PaymentMethod, PaymentStatus } from '../models/paymentModel.js';

class PaymentService {
  public static async createPayment(
    userId: number,
    orderId: number,
    amount: number,
    stripeId: string,
    currency: string,
  ){
    const createPayment = await Payment.create({
      userId,
      orderId,
      amount,
      stripeId: stripeId,
      currency,
      payment_method: PaymentMethod.Stripe,
      payment_status: PaymentStatus.Pending,
    });

    return createPayment;
  }

  public static async updatePaymentStatus(
    userId: number,
    orderId: number,
    stripeId: string,
    newStatus: PaymentStatus,
  ) {
    await Payment.update(
      {
        payment_status: newStatus,
      },
      {
        where: {
          userId,
          orderId,
          stripeId,
          payment_status: PaymentStatus.Pending,
        },
      },
    );
  }

  public static async findPendingPayment(
    userId: number,
    orderId: number,
  ): Promise<Payment | null> {
    const payment = await Payment.findOne({
      where: {
        userId,
        orderId,
        payment_status: PaymentStatus.Pending,
      },
    });

    return payment;
  }
}

export default PaymentService;