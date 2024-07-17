import Notification from '../models/notificationModels.js';
import User from '../models/userModel.js';
import sendEmailMessage from '../helpers/sendEmail.js';
import notificationEmitter from '../utilis/eventEmitter.js';
import ProductAttributes from '../models/productModel.js';
import OrderAttributes from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { CartItemAttributes } from 'models/cartItemModel.js';
import { productService } from '../services/product.service.js';

// Event listener for product added
notificationEmitter.on('productAdded', async (product: ProductAttributes) => {
  try {
    const seller = await User.findByPk(product.dataValues.userId);
    if (seller) {
      const message = `New product '${product.dataValues.productName}' has been created.`;
      const emailMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px; background-color: #57B056; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1>Product created</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${seller.dataValues.firstname},</p>
          <p>We wrote to inform you that your product named <strong>'${product.dataValues.productName}'</strong> has been created</p>
          <p><strong>Reason:</strong> Product Creation</p>
          <p>We take the security and integrity of our platform very seriously If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="mailto:support@example.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #57B056; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
          </p>
          <p>Thank you for your understanding and cooperation.</p>
          <p>Sincerely,<br>The E-commerce Team</p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
          <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>&copy; 2024 E-commerce team. All rights reserved.</p>
        </div>
      </div>
    </div>`;
      await Notification.create({ userId: seller.dataValues.id, message, readstatus: false });

      sendEmailMessage(seller.dataValues.email, 'New Product Added', emailMessage);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productAdded event.`);
    }
  } catch (error: any) {
    console.error(`Error processing productAdded event: ${error.message}`);
  }
});

notificationEmitter.on('productUpdated', async (product: ProductAttributes) => {
  console.log(`productUpdated event received for product ID ${product.dataValues.productId}`);

  try {
    const seller = await User.findByPk(product.dataValues.userId);
    if (seller) {
      const message = `Ypur product '${product.dataValues.productName}' has been updated.`;
      const emailMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px; background-color: #007BFF; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1>Product Updated</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${seller.dataValues.firstname},</p>
          <p>We wrote to inform you that your product named <strong>'${product.dataValues.productName}'</strong> has been updated</p>
          <p><strong>Reason:</strong> Product Updated</p>
          <p>We take the security and integrity of our platform very seriously If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="mailto:support@example.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
          </p>
          <p>Thank you for your understanding and cooperation.</p>
          <p>Sincerely,<br>The E-commerce Team</p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
          <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>&copy; 2024 E-commerce team. All rights reserved.</p>
        </div>
      </div>
    </div>`;
      await Notification.create({ userId: seller.dataValues.id, message, readstatus: false });

      sendEmailMessage(seller.dataValues.email, 'Product Updated', emailMessage);

      console.log(`Notification sent to user ${seller.dataValues.email}: ${message}`);
    } else {
      console.log(`User with ID ${product.dataValues.userId} Not found fro productAdded Event.`);
    }
  } catch (error: any) {
    console.log(`Error processing productAdded event: ${error.message}`);
  }
});

notificationEmitter.on('productUnavailable', async (product: ProductAttributes) => {
  try {
    const seller = await User.findByPk(product.dataValues.userId);
    if (seller) {
      const unavailableMessage = `Your product "${product.dataValues.productName}" is unavailable to buyers.`;
      const emailMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px; background-color: #fcbf49; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1>Product Unavailable</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${seller.dataValues.firstname},</p>
          <p>We wrote to inform you that your product named <strong>'${product.dataValues.productName}'</strong> is now unavailable to buyers</p>
          <p><strong>Reason:</strong> Product Availability</p>
          <p>We take the security and integrity of our platform very seriously If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="mailto:support@example.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
          </p>
          <p>Thank you for your understanding and cooperation.</p>
          <p>Sincerely,<br>The E-commerce Team</p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
          <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>&copy; 2024 E-commerce team. All rights reserved.</p>
        </div>
      </div>
    </div>`;

      await Notification.create({
        userId: seller.dataValues.id,
        message: unavailableMessage,
        readstatus: false,
      });

      sendEmailMessage(
        seller.dataValues.email,
        `Product ${product.dataValues.productName} is unavailable`,
        emailMessage,
      );

      console.log(`Notification sent to user ${seller.dataValues.email}: ${unavailableMessage}`);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productUnavailable event.`);
    }
  } catch (error) {
    console.error('Error processing productUnavailable event:', error);
  }
});

// Handle productAvailable event
notificationEmitter.on('productAvailable', async (product: ProductAttributes) => {
  try {
    const seller = await User.findByPk(product.dataValues.userId);
    if (seller) {
      console.log('Processing productAvailable event');
      const availableMessage = `Your product "${product.dataValues.productName}" is available for buyers.`;
      const emailMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px; background-color: #8ecae6; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1>Product Available</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${seller.dataValues.firstname},</p>
          <p>We wrote to inform you that your product named <strong>'${product.dataValues.productName}'</strong> is now back available to buyers</p>
          <p><strong>Reason:</strong> Product Availability</p>
          <p>We take the security and integrity of our platform very seriously If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="mailto:support@example.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
          </p>
          <p>Thank you for your understanding and cooperation.</p>
          <p>Sincerely,<br>The E-commerce Team</p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
          <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>&copy; 2024 E-commerce team. All rights reserved.</p>
        </div>
      </div>
    </div>`;

      await Notification.create({
        userId: seller.dataValues.id,
        message: availableMessage,
        readstatus: false,
      });

      sendEmailMessage(seller.dataValues.email, `Product ${product.dataValues.productName} is available`, emailMessage);

      console.log(`Notification sent to user ${seller.dataValues.email}: ${availableMessage}`);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productAvailable event.`);
    }
  } catch (error) {
    console.error('Error processing productAvailable event:', error);
  }
});

// Event listener for product deleted
notificationEmitter.on('productDeleted', async (product: ProductAttributes) => {
  console.log(`ProductDeleted event received for product ID: ${product.dataValues.productId}`);

  try {
    const seller = await User.findByPk(product.dataValues.userId);
    if (seller) {
      const message = `Your product '${product.dataValues.productName}' has been deleted.`;
      const emailMessage = `      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px; background-color: #D44B48; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h1>Product Deleted</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${seller.dataValues.firstname},</p>
          <p>We wrote to inform you that your product named <strong>'${product.dataValues.productName}'</strong> has been deleted form your catalog</p>
          <p><strong>Reason:</strong> Product Deletion</p>
          <p>We take the security and integrity of our platform very seriously If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="mailto:support@example.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
          </p>
          <p>Thank you for your understanding and cooperation.</p>
          <p>Sincerely,<br>The E-commerce Team</p>
        </div>
        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
          <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
          <p>&copy; 2024 E-commerce team. All rights reserved.</p>
        </div>
      </div>
    </div>`;
      await Notification.create({ userId: product.dataValues.userId, message, readstatus: false });

      sendEmailMessage(
        seller.dataValues.email,
        `Product ${product.dataValues.productName} has been deleted`,
        emailMessage,
      );

      console.log(`Notification sent to user ${seller.dataValues.email}: ${message}`);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productDeleted event.`);
    }
  } catch (error: any) {
    console.error(`Error processing productDeleted event: ${error.message}`);
  }
});

// notificationEmitter.on('orderPlaced', (orderDetails) => {
//   console.log('orderPlaced event received for product ID:');

//   try {
//     const { sellerEmail, productName, quantity } = orderDetails;
//     const message = `The product ${productName} has been ordered. Quantity: ${quantity}.`;
//     sendEmailMessage(sellerEmail, 'New Order Notification', message);
//   } catch (error: any) {
//     log.error(`Error processing productDeleted event: ${error.message}`);
//   }
// });

// Event listener for order created

notificationEmitter.on('orderCreated', async (order: OrderAttributes) => {
  console.log(`Order created event received for order ID: ${order.dataValues.id}`);
  const products = order?.dataValues?.items ?? [];

  try {
    await Promise.all(
      products.map(async (product: { productId: number; quantity: number }) => {
        const sellerProduct = await Product.findByPk(product.productId);

        if (!sellerProduct) {
          console.log(`No seller product found for product ID: ${product.productId}`);
          return;
        }

        const sellerId = sellerProduct.dataValues.userId;
        const buyerId = order.dataValues.userId;
        console.log(`Found seller product with seller ID: ${sellerId}`);

        const seller = await User.findByPk(sellerId);
        const buyer = await User.findByPk(buyerId);
        if (seller && buyer) {
          const sellerMessage = `Order with your product ${sellerProduct.dataValues.productName} created.`;
          const buyerMessage = `Order ${order.dataValues.id} placed succesfully.`;
          const sellerEmailMessage = `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding: 20px; background-color: #3fca42; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1>Order Placement</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${seller.dataValues.firstname},</p>
        <p>Order That includes your product <strong>${sellerProduct.dataValues.productName}</strong> has been Placed.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li><strong>Items:</strong></li>
          <ul>
            <li>
              <strong>Product Name:</strong> ${sellerProduct.dataValues.productName}<br>
              <strong>Product ID:</strong> ${sellerProduct.dataValues.productId}<br>
            </li>
          </ul>
        </ul>
        <p>We take the security and integrity of our platform very seriously. If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="mailto:mailto:atlp32@gmail.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
        </p>
        <p>Thank you for your understanding and cooperation.</p>
        <p>Sincerely,<br>The E-commerce Team</p>
      </div>
      <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
        <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">mailto:atlp32@gmail.com
  
        `;
          const buyerEmailMessage = `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding: 20px; background-color: #D44B48; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1>Order Placement</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${buyer.dataValues.firstname},</p>
        <p>Order with ID <strong>${order.dataValues.id}</strong> has been Placed successfully.</p>
        <p><strong>Order Details:</strong></p>
        <ul>
          <li><strong>Order ID:</strong> ${order.dataValues.id}</li>
          <li><strong>Total Amount:</strong> ${order.dataValues.totalAmount}</li>
          <li><strong>Items:</strong></li>
          
          <ul>
          ${order.dataValues.items
            .map(
              (item) => `
            <li>
              <strong>Product ID:</strong> ${item.productId}<br>
              <strong>Quantity:</strong> ${item.quantity}
              <strong>Product Name:</strong> ${sellerProduct.dataValues.productName}<br>
              <strong>Product Quantity:</strong> ${sellerProduct.dataValues.quantity}<br>
              <strong>Order ID:</strong> ${order.dataValues.id}<br>
              <strong>Order Status:</strong> ${order.dataValues.status}<br>
            </li>
            `,
            )
            .join('')}
            <strong>Total Amount:</strong> ${order.dataValues.totalAmount}
          </ul>
        </ul>
        <p>We take the security and integrity of our platform very seriously. If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="mailto:mailto:atlp32@gmail.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
        </p>
        <p>Thank you for your understanding and cooperation.</p>
        <p>Sincerely,<br>The E-commerce Team</p>
      </div>
      <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
        <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">mailto:atlp32@gmail.com
        `;

          await Notification.create({ userId: seller.dataValues.id, message: sellerMessage, readstatus: false });
          sendEmailMessage(seller.dataValues.email, 'Order Placement', sellerEmailMessage);

          await Notification.create({ userId: buyer.dataValues.id, message: buyerMessage, readstatus: false });
          sendEmailMessage(buyer.dataValues.email, 'Order Placement', buyerEmailMessage);
        } else {
          console.log(`Seller with ID ${sellerId}} not found for orderCreated event.`);
        }
      }),
    );
  } catch (error: any) {
    console.log(`Error processing orderCreated event: ${error.message}`);
  }
});

// // Event listener for order updated
// notificationEmitter.on('orderUpdated', async (order: OrderAttributes) => {
//   console.log(`Order created event received for order ID: ${order.dataValues.id}`);
//   try {
//     const products = order?.dataValues?.items ?? [];
//     products.map(async (product: { productId: number; quantity: number }) => {
//       const sellerProduct = await User.findByPk(product.productId);
//       const seller = await User.findByPk(sellerProduct?.dataValues.id);
//       if (seller) {
//         const message = `Your order with ID ${order.dataValues.id} has been updated.`;
//         const emailMessage = `
//         <h1>Order Update</h1>
//         <p>Your order with ID ${order.dataValues.id} has been updated.</p>
//         <p>New Status: ${order.dataValues.id}</p>
//         <!-- Add any additional order details you want to include -->
//       `;

//         await Notification.create({ userId: seller.dataValues.id, message, readstatus: false });
//         console.log(`Notification created for user: ${seller.dataValues.id}`);

//         sendEmailMessage(seller.dataValues.email, 'Order Update', emailMessage);
//       } else {
//         console.error(`Seller ${sellerProduct?.dataValues.id} not found for orderUpdated event.`);
//       }
//     });
//   } catch (error) {
//     log.error(`Error processing orderUpdated event: ${error.message}`);
//   }
// });

// Event listener for order cancelled
notificationEmitter.on('orderCancelled', async (order: OrderAttributes) => {
  console.log(`Order canceled event received for order ID: ${order.dataValues.id}`);
  const products = order?.dataValues?.items ?? [];

  try {
    products.map(async (product: { productId: number; quantity: number }) => {
      const sellerProduct = await Product.findByPk(product.productId);

      if (!sellerProduct) {
        console.log(`No seller product found for product ID: ${product.productId}`);
        return;
      }

      const sellerId = sellerProduct.dataValues.userId;
      const buyerId = order.dataValues.userId;
      console.log(`Found seller product with seller ID: ${sellerId}`);

      const seller = await User.findByPk(sellerId);
      const buyer = await User.findByPk(buyerId);
      if (seller && buyer) {
        const sellerMessage = `Order with your product ${sellerProduct.dataValues.productName} has been cancelled.`;
        const buyerMessage = `Order ${order.dataValues.id} cancelled succesfully.`;
        const sellerEmailMessage = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding: 20px; background-color: #D44B48; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1>Order Cancellation</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${seller.dataValues.firstname},</p>
      <p>Order That includes your product <strong>${sellerProduct.dataValues.productName}</strong> has been cancelled.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li><strong>Items:</strong></li>
        <ul>
          <li>
            <strong>Product Name:</strong> ${sellerProduct.dataValues.productName}<br>
            <strong>Product ID:</strong> ${sellerProduct.dataValues.productId}<br>
          </li>
        </ul>
      </ul>
      <p>We take the security and integrity of our platform very seriously. If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="mailto:mailto:atlp32@gmail.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
      </p>
      <p>Thank you for your understanding and cooperation.</p>
      <p>Sincerely,<br>The E-commerce Team</p>
    </div>
    <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
      <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">mailto:atlp32@gmail.com

      `;
        const buyerEmailMessage = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding: 20px; background-color: #D44B48; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1>Order Cancellation</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${buyer.dataValues.firstname},</p>
      <p>Order with ID <strong>${order.dataValues.id}</strong> has been cancelled.</p>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li><strong>Order ID:</strong> ${order.dataValues.id}</li>
        <li><strong>Total Amount:</strong> ${order.dataValues.totalAmount}</li>
        <li><strong>Items:</strong></li>
        
        <ul>
        ${order.dataValues.items
          .map(
            (item) => `
          <li>
            <strong>Product ID:</strong> ${item.productId}<br>
            <strong>Quantity:</strong> ${item.quantity}
            <strong>Product Name:</strong> ${sellerProduct.dataValues.productName}<br>
            <strong>Product Quantity:</strong> ${sellerProduct.dataValues.quantity}<br>
            <strong>Order ID:</strong> ${order.dataValues.id}<br>
          </li>
          `,
          )
          .join('')}
          <strong>Total Amount:</strong> ${order.dataValues.totalAmount}
        </ul>
      </ul>
      <p>We take the security and integrity of our platform very seriously. If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="mailto:mailto:atlp32@gmail.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
      </p>
      <p>Thank you for your understanding and cooperation.</p>
      <p>Sincerely,<br>The E-commerce Team</p>
    </div>
    <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
      <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">mailto:atlp32@gmail.com
      `;

        await Notification.create({ userId: seller.dataValues.id, message: sellerMessage, readstatus: false });
        sendEmailMessage(seller.dataValues.email, 'Order Cancellation', sellerEmailMessage);

        await Notification.create({ userId: buyer.dataValues.id, message: buyerMessage, readstatus: false });
        sendEmailMessage(buyer.dataValues.email, 'Order Cancellation', buyerEmailMessage);
      } else {
        console.log(`Seller with ID ${sellerId} not found for canceled event.`);
      }
    });
  } catch (error: any) {
    console.log(`Error processing orderCancelled event: ${error.message}`);
  }
});

//CART-ITEM-EVENTS

notificationEmitter.on('cartitemAdded', async (cartItem: CartItemAttributes) => {
  console.log(`cartitemAdded event received for item ID: ${cartItem.id}`);

  try {
    const product = await Product.findByPk(cartItem.productId);

    if (!product) {
      console.log('Not Found');
      return;
    }
    const userID = product.dataValues.userId;
    const user = await User.findByPk(userID);

    if (user) {
      const message = `A new item "${product.dataValues.productName}" has been added to your cart.`;
      await Notification.create({ userId: user.dataValues.id, message, readstatus: false });

      const emailContent = `<p>Hello ${user.dataValues.firstname},</p><p>${message}</p>`;
      sendEmailMessage(user.dataValues.email, 'New Item Added', emailContent);

      console.log(`Notification sent to user ${user.dataValues.email}: ${message}`);
    } else {
      console.error(`User with ID ${userID} not found for cartitemAdded event.`);
    }
  } catch (error: any) {
    console.error(`Error processing cartitemAdded event: ${error.message}`);
  }
});

// notificationEmitter.on('cartitemUpdated', async (cartItem: CartItem, cart: CartAttributes) => {
//   console.log(`cartitemUpdated event received for item ID: ${cartItem.dataValues.id}`);
//   const cartId = cartItem.dataValues.cartId;
//   if (!cartId) {
//     throw new Error('bsbbsbs');
//   }

//   const carts = await Cart.findByPk(cartId);
//   console.log(`THI SI IS THE CART =>>>>>>>>>>>>>>>>> ${JSON.stringify(carts)}`);

//   const cart1 = cart.id;
//   console.log(`THI IS IS THE CART ID =>>>>>>>>>>>>>>>>>${cart1.}`);
//   const buyers = await User.findByPk(cart.userId);
//   console.log(`=>>>>>>>>>>>>>>>>> ${buyers}`);

//   try {
//     const product = await Product.findByPk(cartItem.dataValues.productId);

//     if (!product) {
//       throw new Error('Product Not found');
//     }
//     const user = await User.findByPk(product.dataValues.userId);

//     if (user) {
//       const message = `A cart item "${product.dataValues.productName}" quantity has been updated in the buyer's cart.`;
//       await Notification.create({ userId: user.dataValues.id, message, readstatus: false });

//       const emailContent = `<p>Hello ${user.dataValues.firstname},</p><p>${message}</p>`;
//       sendEmailMessage(user.dataValues.email, 'Cart Item Updated', emailContent);

//       console.log(`Notification sent to user ${user.dataValues.email}: ${message}`);
//     } else {
//       console.error(`User with ID ${product.dataValues.userId} not found for cartitemUpdated event.`);
//     }
//   } catch (error: any) {
//     console.error(`Error processing cartitemUpdated event: ${error.message}`);
//   }
// });

// notificationEmitter.on('cartitemDeleted', async (cartItem: CartItem) => {
//   console.log(`cartItemUpdated event received for item ID: ${cartItem.dataValues.id}`);

//   try {
//     const product = await Product.findByPk(cartItem.dataValues.productId);
//     const user = await User.findByPk(product?.dataValues.userId);

//     if (user) {
//       const message = `An item "${product?.dataValues.productName}" has been deleted from the buyer's cart.`;
//       await Notification.create({ userId: user.dataValues.id, message, readstatus: false });

//       const emailContent = `<p>Hello ${user.dataValues.firstname},</p><p>${message}</p>`;
//       sendEmailMessage(user.dataValues.email, 'Cart Item Deleted', emailContent);

//       console.log(`Notification sent to user ${user.dataValues.email}: ${message}`);
//     } else {
//       console.error(`User with ID ${cartItem.dataValues.product?.userId} not found for cartitemDeleted event.`);
//     }
//   } catch (error: any) {
//     console.error(`Error processing cartitemDeleted event: ${error.message}`);
//   }
// });

//PAYMENT

//Define event handlers
// notificationEmitter.on('paymentSuccess', async (uuser, order: OrderAttributes, payment) => {
//   console.log(`PAYMENT SUCCESS FOR PAYMENT FOR ORDER ${order?.dataValues?.id} STARTED`);

//   try {
//     const buyerId = order?.dataValues?.userId;

//     const buyer = await User.findByPk(buyerId);
//     if (!buyer) {
//       throw new Error('User Not found');
//     }

//     const products = order.items ?? [];
//     const buyerMessage = `Your payment of ${order.totalAmount} was succesfull`;
//     products.map(async (product: { productId: number; quantity: number }) => {
//       const productDetail = await productService.getProductById(product.productId);
//       if (productDetail) {
//         const user = await User.findByPk(productDetail.dataValues.userId);
//         if (user && buyer) {
//           const buyerEmailMessage = `
//           <!DOCTYPE html>
//           <html lang="en">
//           <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Product Ordered</title>
//             <style>
//               body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//               h1 { color: #d63384; }
//               ul { margin: 0; padding: 0 0 0 20px; }
//               li { margin: 10px 0; }
//             </style>
//           </head>
//           <body>
//             <h1>Dear ${buyer.dataValues.firstname},</h1>
//             <p>We are excited to inform you that your product, <strong>${productDetail.dataValues.productName}</strong>, has been successfully ordered!</p>
//             <h2>Order Details:</h2>
//             <ul>
//               <li><strong>Product Name:</strong> ${productDetail.dataValues.productName}</li>
//               <li><strong>Order Quantity:</strong> ${productDetail.dataValues.quantity}</li>
//               <li><strong>Order ID:</strong> ${order?.dataValues?.id}</li>
//               <li><strong>Total Amount:</strong> ${order?.dataValues?.totalAmount}</li>
//             </ul>
//             <h2>Buyer's Information:</h2>
//             <ul>
//               <li><strong>Name:</strong> ${buyer?.dataValues?.firstname}</li>
//               <li><strong>Email:</strong> ${buyer?.dataValues?.email}</li>
//               <li><strong>Shipping Address:</strong> ${buyer?.dataValues?.country}, ${buyer?.dataValues?.city}</li>
//             </ul>
//             <h2>Next Steps:</h2>
//             <p>Please prepare the product for shipment as soon as possible. Make sure to package it securely to ensure it reaches the buyer in perfect condition. Once the product is shipped, update the order status and provide the tracking information.</p>
//             <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <strong>atlp32tl@gmail.com</strong>.</p>
//             <p>Thank you for your dedication and for being a valued part of our marketplace.</p>
//             <p>Best Regards,<br>
//             Andela Cohort 32 Team Lydia<br>
//             Sales Manager<br>
//             Andela</p>
//           </body>
//           </html>
//           `;
//         }

//         await Notification.create({ userId: buyer?.dataValues?.id, message: buyerMessage, readstatus: false });
//         sendEmailMessage(buyer?.dataValues?.email, 'Your Order Has Been Placed Successfully!', buyer);
//       }
//     });
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// });

notificationEmitter.on('paymentCanceled', async (user, order, payment) => {
  console.log(`PAYMENT CANCELLATION FOR PAYMENT FOR ORDER ${order.id} STARTED`);

  try {
    const buyerId = order.userId;

    const buyer = await User.findByPk(buyerId);
    if (!buyer) {
      throw new Error('User Not found');
    }
    const buyerMessage = `Payment process of ${order.totalAmount} was cancelled`;
    const emailContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding: 20px; background-color: #D44B48; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1>Payment Cancellation</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${buyer.dataValues.firstname},</p>
      <p>Payment with ID <strong>${payment.id}</strong> of <strong>${order.totalAmount} ${payment.currency}</strong> has been cancelled.</p>
      <p><strong>Payment Details:</strong></p>
      <ul>
        <li><strong>Order ID:</strong> ${order.id}</li>
        <li><strong>Total Amount:</strong> ${order.totalAmount}</li>
      </ul>
      <p>We take the security and integrity of our platform very seriously. If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="mailto:mailto:atlp32@gmail.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
      </p>
      <p>Thank you for your understanding and cooperation.</p>
      <p>Sincerely,<br>The E-commerce Team</p>
    </div>
    <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
      <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">mailto:atlp32@gmail.com
      
    `;
    await Notification.create({ userId: buyer.dataValues.id, message: buyerMessage, readstatus: false });
    sendEmailMessage(buyer.dataValues.email, 'Payment Canceled', emailContent);
  } catch (error: any) {
    throw new Error(error);
  }
});
