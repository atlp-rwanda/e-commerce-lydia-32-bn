import Notification from '../models/notificationModels.js';
import User from '../models/userModel.js';
import sendEmailMessage from '../helpers/sendEmail.js';
import notificationEmitter from '../utilis/eventEmitter.js';
import ProductAttributes from '../models/productModel.js';

// Event listener for product added
notificationEmitter.on('productAdded', async (product: ProductAttributes) => {
  console.log(`ProductAdded event received for product ID: ${product.dataValues.productId}`);

  try {
    const user = await User.findByPk(product.dataValues.userId);
    if (user) {
      const message = `A new product "${product.dataValues.productName}" has been added to your catalog.`;
      await Notification.create({ userId: product.dataValues.userId, message, readstatus: false });

      const emailContent = `<p>Hello ${user.dataValues.firstname},</p><p>${message}</p>`;
      sendEmailMessage(user.dataValues.email, 'New Product Added', emailContent);

      console.log(`Notification sent to user ${user.dataValues.email}: ${message}`);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productAdded event.`);
    }
  } catch (error: any) {
    console.error(`Error processing productAdded event: ${error.message}`);
  }
});

// Event listener for product expired
notificationEmitter.on('productExpired', async (product: ProductAttributes) => {
  console.log(`ProductExpired event received for product ID: ${product.dataValues.productId}`);

  try {
    const user = await User.findByPk(product.dataValues.userId);
    if (user) {
      const message = `Your product "${product.dataValues.productName}" has expired.`;
      await Notification.create({ userId: product.dataValues.userId, message, readstatus: false });

      const emailContent = `<p>Hello ${user.dataValues.firstname},</p><p>${message}</p>`;
      sendEmailMessage(user.email, `Product ${product.dataValues.productName} has expired`, emailContent);

      console.log(`Notification sent to user ${user.dataValues.email}: ${message}`);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productExpired event.`);
    }
  } catch (error: any) {
    console.error(`Error processing productExpired event: ${error.message}`);
  }
});

// Event listener for product deleted
notificationEmitter.on('productDeleted', async (product: ProductAttributes) => {
  console.log(`ProductDeleted event received for product ID: ${product.dataValues.productId}`);

  try {
    const user = await User.findByPk(product.dataValues.userId);
    if (user) {
      const message = `Your product "${product.dataValues.productName}" has been deleted.`;
      await Notification.create({ userId: product.dataValues.userId, message, readstatus: false });

      const emailContent = `<p>Hello ${user.dataValues.firstname},</p><p>${message}</p>`;
      sendEmailMessage(
        user.dataValues.email,
        `Product ${product.dataValues.productName} has been deleted`,
        emailContent,
      );

      console.log(`Notification sent to user ${user.dataValues.email}: ${message}`);
    } else {
      console.error(`User with ID ${product.dataValues.userId} not found for productDeleted event.`);
    }
  } catch (error: any) {
    console.error(`Error processing productDeleted event: ${error.message}`);
  }
});
