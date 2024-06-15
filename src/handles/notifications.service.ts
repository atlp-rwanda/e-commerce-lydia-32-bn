import Notification from '../models/notificationModels.js';
import User from '../models/userModel.js';
import sendEmailMessage from '../helpers/sendEmail.js';
import notificationEmitter from '../utilis/eventEmitter.js';
import ProductAttributes from '../models/productModel.js';
import log from '../utilis/logger.js';

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

notificationEmitter.on('orderPlaced', (orderDetails) => {
  console.log('orderPlaced event received for product ID:');

  try {
    const { sellerEmail, productName, quantity } = orderDetails;
    const message = `The product ${productName} has been ordered. Quantity: ${quantity}.`;
    sendEmailMessage(sellerEmail, 'New Order Notification', message);
  } catch (error: any) {
    log.error(`Error processing productDeleted event: ${error.message}`);
  }
});
