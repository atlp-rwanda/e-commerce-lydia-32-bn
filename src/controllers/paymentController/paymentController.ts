// import { query, Request, Response } from 'express';
// import dotenv from 'dotenv';
// import StripeConfig from '../../config/stripe.js';
// import PaymentService from '../../services/paymentService.js';
// import { productService } from '../../services/product.service.js';
// import { PaymentStatus } from '../../models/paymentModel.js';
// import Order from '../../models/orderModel.js';
// import User from '../../models/userModel.js';
// import { OrderStatusControllerInstance } from '../orderController.ts/orderStatus.js';

// dotenv.config();
// class PaymentController {

//   async makePaymentSession(req: Request, res: Response) {
//     let { userId, orderId,currency } = req.body;
//     userId = Number(userId);
//     orderId = Number(orderId);

//     if (isNaN(userId) || isNaN(orderId)) {
//       return res.status(400).json({ message: 'Invalid userId or orderId' });
//     }
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(403).json({ message: 'Unauthorized! Please Login First' });
//     }

//     const baseUrl = process.env.FRONTEND_URL || '';
//     const success_url = `${baseUrl}/api/payment/success?userId=${user.dataValues.id}&orderId=${orderId}`;
//     const cancel_url = `${baseUrl}/api/payment/cancel?userId=${user.dataValues.id}&orderId=${orderId}`;
//     console.log('BASE URL:', baseUrl);
//     console.log('Success URL:', success_url);
//     console.log('Cancel URL:', cancel_url);
//     try {
//       const orderData = await Order.findByPk(orderId);
//       if (!orderData) {
//         return res.status(404).json({ message: 'Order not found' });
//       }
//       const amount = orderData.totalAmount;
//       if (amount > orderData.totalAmount) {
//         return res.status(400).json({ message: 'Payment amount exceeds order total amount' });
//       }

//       const remainingBalance = orderData.totalAmount - orderData.totalPaid;
//       if (amount > remainingBalance) {
//         return res.status(400).json({ message: 'Payment amount exceeds remaining balance' });
//       }
      
//     const products = orderData.dataValues.products;
//     const productData = await Promise.all(
//       products.map(async (product: { productId: number; quantity: number }) => {
//         const productDetail = await productService.getProductById(
//           product.productId,
//         );
//         if (productDetail) {
//           return {
//             ...productDetail.dataValues,
//             orderQuantity: product.quantity,
//           };
//         } else {
//           return null; 
//         }
//       }),
//     ).then((results) => results.filter((result) => result !== null)); 

//     if (productData.length === 0) {
//       return res
//         .status(400)
//         .json({ message: 'No valid products found in the order' });
//     }

//     const lineItems = productData.map((product) => ({
//       price_data: {
//         currency: currency || 'usd',
//         product_data: {
//           name: product.productName,
//           description: product.description,
//           metadata: {
//             productId: product.productId,
//             vendorId: product.userId,
//           },
//         },
//         unit_amount: product.price,
//       },
//       quantity: product.quantity,
//     }));

//       const metadata = {
//         userId: user.dataValues.id,
//         orderId,
//       };

//       const session = await StripeConfig.createStripeSession(lineItems, metadata, success_url, cancel_url);
//       console.log(
//         `USerId: ${metadata.userId} OrderId ${metadata.orderId} amount ${session.amount_total} currency ${currency}`,
//       );
//       await PaymentService.createPayment(
//         metadata.userId,
//         metadata.orderId,
//         session.amount_total || 0,
//         session.id,
//         currency,
//       );

//       res.status(201).json({ sessionId: session.id });
//     } catch (error) {
//       if (error instanceof Error) {
//         return res.status(500).json({ message: error.message });
//       }
//     }
//   }

//   async paymentSuccess(req: Request, res: Response) {
//     const userId = req.body.userId as string;
//     const orderId = req.query.orderId as string;
//     const sessionId = req.query.sessionId as string;
//     console.log('Query: ', query);
//     console.log(`Query Order Id ${orderId}`);
//     console.log(`Query User Id ${userId}`);
//     if (!userId || !orderId) {
//       return res.status(400).json({ message: 'Missing required parameters' });
//     }
//     try {
//       const balance = await StripeConfig.retrieveBalance();
//       const availableBalance = balance.available.reduce((total:number, balance:{ amount: number }) => total + balance.amount, 0);
//       const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));
//       console.log('Available balance '+availableBalance)
//       if (!payment) {
//         return res.status(404).json({ message: 'Payment not found' });
//       }

//       const session = await StripeConfig.checkPaymentStatus(sessionId);

//       if (session.payment_status === 'paid') {
//         await PaymentService.updatePaymentStatus(
//           Number(userId),
//           Number(orderId),
//           payment.dataValues.stripeId,
//           PaymentStatus.Completed,
//         );
//         const orderUpdateResponse = await OrderStatusControllerInstance.updateOrderStatus(
//           { params: { orderId: String(orderId) }, body: { status: 'Paid' } } as unknown as Request,
//           res,
//         );
//       } else {
//         return res.status(400).json({ message: 'Payment not successful' });
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         return res.status(500).json({ message: error.message });
//       }
//     }
//   }

//   async paymentCancel(req: Request, res: Response) {
//     const userId = req.body.userId as string;
//     const orderId = req.query.orderId as string;
//     const sessionId = req.query.sessionId as string;
//     if (!userId || !orderId) {
//       return res.status(400).json({ message: 'Missing required parameters' });
//     }

//     try {
//       const payment = await PaymentService.findPendingPayment(Number(userId), Number(orderId));

//       if (!payment) {
//         return res.status(404).json({ message: 'Payment not found' });
//       }

//       await PaymentService.updatePaymentStatus(
//         Number(userId),
//         Number(orderId),
//         payment.dataValues.stripeId,
//         PaymentStatus.Canceled,
//       );
//       await StripeConfig.deleteSession(sessionId);
//       return res.status(200).json({ message: 'Payment canceled' });
//     } catch (error) {
//       if (error instanceof Error) {
//         return res.status(500).json({ message: error.message });
//       }
//     }
//   }
// }

// export default new PaymentController();


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
    const orderId = req.query.orderId as string;
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
        const buyer = await User.findByPk(orderData?.userId);

        if (buyer && orderData) {
          const toDate = new Date(); // Assuming toDate is available in your orderData or can be fetched
          const shippingDate = addDays(toDate, 15);
          const emailContent = `
          Dear ${buyer.dataValues.firstname},

          Thank you for your recent purchase from Our Company! We are excited to inform you that your order has been successfully placed.

          Here are the details of your order:

          **Order Summary:**
          - **Order ID:** ${orderData.dataValues.id}
          - **Order Date:** ${orderData?.dataValues?.createdAt ? new Date(orderData.dataValues.createdAt).toLocaleDateString() : 'Date not available'}
          - **Total Amount:** ${orderData.dataValues.totalAmount} USD

          **Items Purchased:**
          ${orderData.dataValues.items.map(item => `
            - **Product Name:** ${item.productName}
            - **Quantity:** ${item.quantity}
            - **Price:** ${item.price} USD
          `).join('')}

          **Shipping Information:**
          - **Shipping Address:** ${buyer.dataValues.country}, ${buyer.dataValues.city}
          - **Estimated Delivery Date:** ${shippingDate}

          **What Happens Next:**
          1. **Order Processing:** Our team is preparing your order for shipment.
          2. **Shipping Confirmation:** Once your order is on its way, you will receive a shipping confirmation email with tracking details.

          **Customer Support:**
          If you have any questions or need assistance, please don't hesitate to contact our support team at **atlp32tl@gmail.com**. We are here to help you!

          Thank you again for choosing us. We appreciate your business and look forward to serving you again.

          Best Regards,

          Andela Cohort 32 Team Lydia
          Sales Manager
          Andela

          P.S. We love seeing our products in their new homes!
          `;

          await sendEmailMessage(buyer.dataValues.email, "Your Order Has Been Placed Successfully!", emailContent);
        }

        // Notify product owners
        await Promise.all(
          products.map(async (product: { productId: number; quantity: number }) => {
            const productDetail = await productService.getProductById(product.productId);
            if (productDetail) {
              const user = await User.findByPk(productDetail.userId);
              if (user && buyer) {
                const userEmail = user.dataValues.email;
                const content = `
                Dear ${user.dataValues.firstname},
                We are excited to inform you that your product, **${productDetail.dataValues.productName}**, has been successfully ordered!

                Order Details:
                  - **Product Name:** ${productDetail.dataValues.productName}
                  - **Order Quantity:** ${productDetail.dataValues.quantity}
                  - **Order ID:** ${orderData?.dataValues?.id}
                  - **Total Amount:** ${productDetail.dataValues.price}

                Buyer's Information:
                  - **Name:** ${buyer.dataValues.firstname}
                  - **Email:** ${buyer.dataValues.email}
                  - **Shipping Address:** ${buyer.dataValues.country},  ${buyer.dataValues.city}

                Next Steps:
                  Please prepare the product for shipment as soon as possible. Make sure to package it securely to ensure it reaches the buyer in perfect condition. Once the product is shipped, update the order status and provide the tracking information.

                  If you have any questions or need assistance, please don't hesitate to contact our support team at **atlp32tl@gmail.com** .

                Thank you for your dedication and for being a valued part of our marketplace.

                Best Regards,
                `
                 await sendEmailMessage(userEmail, `Product ${productDetail.productName} was ordered`, content);
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
    const orderId = req.query.orderId as string;
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
