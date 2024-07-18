import { Request, Response } from 'express';
import { addDays } from 'date-fns';
import dotenv from 'dotenv';
import StripeConfig from '../../config/stripe.js';
import PaymentService from '../../services/paymentService.js';
import { productService } from '../../services/product.service.js';
import { PaymentStatus } from '../../models/paymentModel.js';
import Order from '../../models/orderModel.js';
import { getOrderByIdAndBuyerId } from '../../services/orderService/orderService.js';
import User from '../../models/userModel.js';
import { OrderStatusControllerInstance } from '../orderController.ts/orderStatus.js';
import sendEmailMessage from '../../helpers/sendEmail.js';
import { OrderStatus } from '../../utilis/orderStatusConstants.js';
import notificationEmitter from '../../utilis/eventEmitter.js';

dotenv.config();

class PaymentController {

  async makePaymentSession(req: Request, res: Response) {
    const { currency } = req.body;
    const { userId } = req;
    const orderId = Number(req.params.orderId);
    if (!userId || isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid userId or orderId' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized! Please Login First' });
    }

    const baseUrl = process.env.FRONTEND_URL || '';
   // const success_url = `${baseUrl}/orderConfirmation?sessionId=${user.dataValues.id}&orderId=${orderId}`;
    //const cancel_url = `${baseUrl}/api/payment/cancel?userId=${user.dataValues.id}&orderId=${orderId}`;

    try {
      const orderData = await getOrderByIdAndBuyerId(String(orderId), Number(userId));
      if (!orderData) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (orderData.dataValues.status === 'Paid') {
        return res.status(404).json({ message: 'Order Payment already done !' });
      }

      const products = orderData.dataValues.items;
      const productData = await Promise.all(
        products.map(async (product: { productId: number; quantity: number }) => {
          const productDetail = await productService.getProductById(product.productId);
          if (productDetail) {
            return {
              ...productDetail.dataValues,
              orderQuantity: product.quantity,
            };
          }
          return null;
        }),
      ).then((results) => results.filter((result) => result !== null));

      if (productData.length === 0) {
        return res.status(400).json({ message: 'No valid products found in the order' });
      }

      const lineItems = productData.map((product) => ({
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: product!.productName,
            description: product!.description,
            metadata: {
              productId: product!.productId,
              vendorId: product!.userId,
            },
          },
          unit_amount: Math.round(product!.price),
        },
        quantity: product!.orderQuantity,
      }));

      const metadata = {
        userId: user.dataValues.id,
        orderId,
      };

      const session = await StripeConfig.createStripeSession(
        lineItems,
        metadata,
        `${baseUrl}/orderConfirmation/{CHECKOUT_SESSION_ID}/${orderId}`,
        `${baseUrl}/api/payment/cancel?userId=${user.dataValues.id}&orderId=${orderId}`
      );

      await PaymentService.createPayment(
        metadata.userId,
        metadata.orderId,
        (session.amount_total ?? 0) / 100,
        session.id,
        currency || 'usd',
      );

      res.status(201).json({ sessionId: session.id, sessionUrl: session.url });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }

  async paymentSuccess(req: Request, res: Response) {
    const orderId = req.params.orderId as string;
    const sessionId = req.params.sessionId as string;
    const { userId } = req;

    if (!userId || !orderId || !sessionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
      const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      const session = await StripeConfig.checkPaymentStatus(sessionId);
      if (session.payment_status === 'paid') {
        await PaymentService.updatePaymentStatus(Number(userId), Number(orderId), sessionId, PaymentStatus.Completed);

        const orderData = await Order.findByPk(Number(orderId));
        if (!orderData) {
          return res.status(404).json({ message: 'Order not found' });
        }
        const products = orderData?.dataValues?.items ?? [];
        const buyer = await User.findByPk(orderData?.dataValues?.userId);
        // Notify product owners
         await Promise.all(
          products.map(async (product: { productId: number; quantity: number }) => {
            if (buyer && orderData) {
              notificationEmitter.emit('paymentSuccess', buyer, orderData.dataValues, payment.dataValues);
            }
          }),
        );
        const orderUpdateResponse = await OrderStatusControllerInstance.updateOrderStatus(
          { params: { orderId: String(orderId) }, body: { status: OrderStatus.Paid } } as unknown as Request,
          res,
        );
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
    const orderId = req.params.orderId as string;
    const sessionId = req.query.sessionId as string;
    const { userId } = req;

    if (!userId || !orderId || !sessionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
      const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await PaymentService.updatePaymentStatus(Number(userId), Number(orderId), sessionId, PaymentStatus.Canceled);

      const user = await User.findByPk(Number(userId));
      const orderData = await Order.findByPk(Number(orderId));
      if (user && orderData) {
        notificationEmitter.emit('paymentCanceled', user, orderData.dataValues);
      }

      await StripeConfig.deleteSession(sessionId);
      return res.status(200).json({ message: 'Payment canceled' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
}

export default new PaymentController();
