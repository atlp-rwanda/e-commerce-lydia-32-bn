import cron from 'node-cron';
import Product from './../models/productModel.js';
import Sequelize from 'sequelize';
import { Op } from 'sequelize';
import sendVerificationToken from './../helpers/sendEmail.js';
import { UserService } from './../services/registeruser.service.js';

let isRunning = false;

cron.schedule('0 0 * * *', async () => {
    if (isRunning) {
        console.log('Previous job still running, skipping this run.');
        return;
    }
    isRunning = true;

    const currentDateOnly = new Date().toISOString().slice(0, 10);
    try {
        const expiredProducts = await Product.findAll({
            where: {
                expiryDate: {
                    [Op.lt]: Sequelize.literal(`DATE('${currentDateOnly}')`),
                },
                isAvailable: true,
            },
        });

        await Promise.all(expiredProducts.map(async (product) => {
            try {
                
                if (!product.dataValues.userId) {
                    throw new Error(`Product ${product.dataValues.productId} does not have a valid userId`);
                }

                const user = await UserService.getUserByFields({ id: product.dataValues.userId });
                if (!user) {
                    throw new Error("User not found");
                }

                const subject = 'Successful Product Expiry Notification';
                const content = `
                <p>Dear ${user.firstname},</p>
                <p>We hope this message finds you well.</p>
                <p>We wanted to inform you that your product '<strong>${product.dataValues.productName}</strong>' has reached its expiration date and will no longer be listed as available.</p>
                <p>If you wish to relist your product, please ensure it is not expired. Below are the details of the expired product:</p>
            
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
                    <tr style="background-color: #f2f2f2;">
                        <th style="text-align: left;">Field</th>
                        <th style="text-align: left;">Details</th>
                    </tr>
                    <tr>
                        <td><strong>Product ID</strong></td>
                        <td>${product.dataValues.productId}</td>
                    </tr>
                    <tr>
                        <td><strong>Product Name</strong></td>
                        <td>${product.dataValues.productName}</td>
                    </tr>
                    <tr>
                        <td><strong>Description</strong></td>
                        <td>${product.dataValues.description}</td>
                    </tr>
                    <tr>
                        <td><strong>Category</strong></td>
                        <td>${product.dataValues.productCategory}</td>
                    </tr>
                    <tr>
                        <td><strong>Price</strong></td>
                        <td>${product.dataValues.price}</td>
                    </tr>
                    <tr>
                        <td><strong>Quantity</strong></td>
                        <td>${product.dataValues.quantity}</td>
                    </tr>
                    <tr>
                        <td><strong>Images</strong></td>
                        <td>${product.dataValues.images}</td>
                    </tr>
                    <tr>
                        <td><strong>Dimensions</strong></td>
                        <td>${product.dataValues.dimensions || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Created At</strong></td>
                        <td>${product.dataValues.createdAt}</td>
                    </tr>
                    <tr>
                        <td><strong>Updated At</strong></td>
                        <td>${product.dataValues.updatedAt}</td>
                    </tr>
                    <tr>
                        <td><strong>Expiry Date</strong></td>
                        <td>${product.dataValues.expiryDate}</td>
                    </tr>
                </table>
            
                <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
                <p>Best regards,</p>
                <p>The E-Commerce Lydia Team</p>
            `;
            
                await sendVerificationToken(user.email, subject, content);
                await product.update({ isAvailable: false });

            } catch (error) {
                console.error(`Error processing product ${product.dataValues.productId}:`, error);
            }
        }));

        console.log('All expired products processed.');
    } catch (error) {
        console.error('Error processing expired products:', error);
    } finally {
        isRunning = false;
    }
});