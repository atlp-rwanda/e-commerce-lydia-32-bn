import { Request, Response } from 'express';
import dotenv from 'dotenv';
import StripeConfig from '../../config/stripe.js';
import PaymentService from '../../services/paymentService.js';
import { PaymentStatus } from '../../models/paymentModel.js';
import Order from '../../models/orderModel.js';
import User from '../../models/userModel.js';
import { OrderStatusControllerInstance } from '../orderController.ts/orderStatus.js';
dotenv.config();

class PaymentController {
  async makePaymentSession(req: Request, res: Response) {
    let { userId, orderId, amount, currency } = req.body;
    userId =Number(userId);
    orderId=Number(orderId);

    if (isNaN(userId) || isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid userId or orderId' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized! Please Login First' });
    }

    const baseUrl = process.env.FRONTEND_URL || '';
    const success_url = `${baseUrl}/api/payment/success?userId=${user.dataValues.id}&orderId=${orderId}`;
    const cancel_url = `${baseUrl}/api/payment/cancel?userId=${user.dataValues.id}&orderId=${orderId}`;
    console.log('BASE URL:', baseUrl);
    console.log('Success URL:', success_url);
    console.log('Cancel URL:', cancel_url);
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (amount > order.totalAmount) {
        return res.status(400).json({ message: 'Payment amount exceeds order total amount' });
      }

      const remainingBalance = order.totalAmount - order.totalPaid;
      if (amount > remainingBalance) {
        return res.status(400).json({ message: 'Payment amount exceeds remaining balance' });
      }

      const lineItems = [{
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: `Order #${orderId}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }];

      const metadata = {
        userId: user.dataValues.id,
        orderId: orderId,
      };

      const session = await StripeConfig.createStripeSession(lineItems, metadata, success_url, cancel_url);
      console.log("USerId: "+ metadata.userId+" OrderId "+metadata.orderId+" amount "+session.amount_total+" currency "+currency)
      await PaymentService.createPayment(metadata.userId, metadata.orderId, session.amount_total || 0, session.id,currency);

      res.status(201).json({ sessionId: session.id });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }

  async paymentSuccess(req: Request, res: Response) {
    const userId = req.query.userId as string;
    const orderId = req.query.orderId as string;

    if (!userId || !orderId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    try {
      const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      const session = await StripeConfig.checkPaymentStatus(payment.stripeId);

      if (session.payment_status === 'paid') {
        await PaymentService.updatePaymentStatus(Number(userId), Number(orderId), payment.stripeId, PaymentStatus.Completed);
        await OrderStatusControllerInstance.updateOrderStatus(
          { params: { orderId: String(orderId) }, body: { status: 'Paid' } } as unknown as Request,
          res,
        );
        return res.status(200).json({ message: 'Payment successful' });
      } else {
        return res.status(400).json({ message: 'Payment not successful' });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }

  async paymentCancel(req: Request, res: Response) {
    let userId = req.query.userId as string;
    let orderId = req.query.orderId as string;
    if (!userId || !orderId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
      const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await PaymentService.updatePaymentStatus(Number(userId), Number(orderId), String(payment.stripeId), PaymentStatus.Canceled);
      await StripeConfig.deleteSession(payment.stripeId);
      return res.status(200).json({ message: 'Payment canceled' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
}

export default new PaymentController();
