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


dotenv.config();

class PaymentController {
  async makePaymentSession(req: Request, res: Response) {
    let { currency } = req.body;
    const userId = req.userId;
    const orderId = Number(req.params.orderId);
   // orderId = Number(orderId);
    console.log('Order ID ', req.params.orderId);
    console.log('UserId ', userId);
    console.log('Order ', orderId);
    if (!userId || isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid userId or orderId' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized! Please Login First' });
    }

    const baseUrl = process.env.FRONTEND_URL || '';
    const success_url = `${baseUrl}/api/payment/success?userId=${user.dataValues.id}&orderId=${orderId}`;
    const cancel_url = `${baseUrl}/api/payment/cancel?userId=${user.dataValues.id}&orderId=${orderId}`;

    try {
      const orderData = await getOrderByIdAndBuyerId(String(orderId),Number(userId));
      if (!orderData) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (orderData.dataValues.status==='Paid') {
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
          } else {
            return null;
          }
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
          unit_amount: Math.round(product!.price * 100),
        },
        quantity: product!.orderQuantity,
      }));

      const metadata = {
        userId: user.dataValues.id,
        orderId,
      };

      const session = await StripeConfig.createStripeSession(lineItems, metadata, success_url, cancel_url);

      await PaymentService.createPayment(
        metadata.userId,
        metadata.orderId,
        //parseFloat((session.amount_total ?? 0) / 100).toFixed(2),
        (session.amount_total ?? 0) / 100, // amount in original currency
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
    const sessionId = req.query.sessionId as string;
    const userId = req.userId;
    console.log('OrderId ', orderId);
    console.log('UserId ', userId);
    console.log('SessionId ', sessionId);

    if (!userId || !orderId || !sessionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
      const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      const session = await StripeConfig.checkPaymentStatus(sessionId);
      console.log(session);
      if (session.payment_status === 'paid') {
        await PaymentService.updatePaymentStatus(
          Number(userId),
          Number(orderId),
          sessionId,
          PaymentStatus.Completed,
        );

        const orderData = await Order.findByPk(Number(orderId));
        const products = orderData?.dataValues?.items ?? [];
        const buyer = await User.findByPk(orderData?.dataValues?.userId);
       // console.log('Order data ', orderData)
        if (buyer && orderData) {
          const toDate = new Date(); // Assuming toDate is available in your orderData or can be fetched
          const shippingDate = addDays(toDate, 15);
         const emailContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Order Has Been Placed Successfully!</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              h1 { color: #d63384; }
              ul, ol { margin: 0; padding: 0 0 0 20px; }
              li { margin: 10px 0; }
            </style>
          </head>
          <body>
            <h1>Dear ${buyer.dataValues.firstname},</h1>
            <p>Thank you for your recent purchase from Our Company! We are excited to inform you that your order has been successfully placed.</p>
            <h2>Order Summary:</h2>
            <ul>
              <li><strong>Order ID:</strong> ${orderData.dataValues.id}</li>
              <li><strong>Order Date:</strong> ${orderData?.dataValues?.createdAt ? new Date(orderData.dataValues.createdAt).toLocaleDateString() : 'Date not available'}</li>
              <li><strong>Total Amount:</strong> ${orderData.dataValues.totalAmount} USD</li>
            </ul>
            <h2>Items Purchased:</h2>
            <ul>
              ${orderData?.dataValues?.items.map(item => `
              <li>
                <strong>Product Name:</strong> ${item.productName}<br>
                <strong>Quantity:</strong> ${item.quantity}<br>
                <strong>Price:</strong> ${item.price} USD
              </li>`).join('')}
            </ul>
            <h2>Shipping Information:</h2>
            <ul>
              <li><strong>Shipping Address:</strong> ${buyer.dataValues.country}, ${buyer.dataValues.city}</li>
              <li><strong>Estimated Delivery Date:</strong> ${shippingDate}</li>
            </ul>
            <h2>What Happens Next:</h2>
            <ol>
              <li><strong>Order Processing:</strong> Our team is preparing your order for shipment.</li>
              <li><strong>Shipping Confirmation:</strong> Once your order is on its way, you will receive a shipping confirmation email with tracking details.</li>
            </ol>
            <h2>Customer Support:</h2>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <strong>atlp32tl@gmail.com</strong>. We are here to help you!</p>
            <p>Thank you again for choosing us. We appreciate your business and look forward to serving you again.</p>
            <p>Best Regards,<br>
            Andela Cohort 32 Team Lydia<br>
            Sales Manager<br>
            Andela</p>
            <p>P.S. We love seeing our products in their new homes!</p>
          </body>
          </html>
          `;
           console.log('Email  ', buyer.dataValues.email);
          await sendEmailMessage(buyer.dataValues.email, "Your Order Has Been Placed Successfully!", emailContent);
        }

        // Notify product owners
        await Promise.all(
          products.map(async (product: { productId: number; quantity: number }) => {
            const productDetail = await productService.getProductById(product.productId);
           // console.log('Product detail ', productDetail)
            if (productDetail) {
              const user = await User.findByPk(productDetail.dataValues.userId);
              console.log('Seller ', productDetail.dataValues.userId);
              console.log('Buyer ', buyer);
              if (user && buyer) {
                const userEmail = user.dataValues.email;
                console.log('Seller Email ', userEmail);
                 const content = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Product Ordered</title>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    h1 { color: #d63384; }
                    ul { margin: 0; padding: 0 0 0 20px; }
                    li { margin: 10px 0; }
                  </style>
                </head>
                <body>
                  <h1>Dear ${user.dataValues.firstname},</h1>
                  <p>We are excited to inform you that your product, <strong>${productDetail.dataValues.productName}</strong>, has been successfully ordered!</p>
                  <h2>Order Details:</h2>
                  <ul>
                    <li><strong>Product Name:</strong> ${productDetail.dataValues.productName}</li>
                    <li><strong>Order Quantity:</strong> ${productDetail.dataValues.quantity}</li>
                    <li><strong>Order ID:</strong> ${orderData?.dataValues?.id}</li>
                    <li><strong>Total Amount:</strong> ${productDetail.dataValues.price}</li>
                  </ul>
                  <h2>Buyer's Information:</h2>
                  <ul>
                    <li><strong>Name:</strong> ${buyer.dataValues.firstname}</li>
                    <li><strong>Email:</strong> ${buyer.dataValues.email}</li>
                    <li><strong>Shipping Address:</strong> ${buyer.dataValues.country}, ${buyer.dataValues.city}</li>
                  </ul>
                  <h2>Next Steps:</h2>
                  <p>Please prepare the product for shipment as soon as possible. Make sure to package it securely to ensure it reaches the buyer in perfect condition. Once the product is shipped, update the order status and provide the tracking information.</p>
                  <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <strong>atlp32tl@gmail.com</strong>.</p>
                  <p>Thank you for your dedication and for being a valued part of our marketplace.</p>
                  <p>Best Regards,<br>
                  Andela Cohort 32 Team Lydia<br>
                  Sales Manager<br>
                  Andela</p>
                </body>
                </html>
                `;
                 await sendEmailMessage(userEmail, `Product ${productDetail.dataValues.productName} was ordered`, content);
              }
            }
          })
        );
        const orderUpdateResponse = await OrderStatusControllerInstance.updateOrderStatus(
          { params: { orderId: String(orderId) }, body: { status: OrderStatus.Paid } } as unknown as Request,
          res,
        );
        //res.status(200).json({ message: 'Payment successful and order updated' });
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
    const userId = req.userId;

    if (!userId || !orderId || !sessionId) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    try {
      const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      await PaymentService.updatePaymentStatus(
        Number(userId),
        Number(orderId),
        sessionId,
        PaymentStatus.Canceled,
      );

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
