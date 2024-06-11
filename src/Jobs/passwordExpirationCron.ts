import cron from 'node-cron';
import dotenv from 'dotenv';
import { UserService } from '../services/registeruser.service.js';
import sendVerificationToken from '../helpers/sendEmail.js';
import { UserAttributes } from '../models/userModel.js';

// Load environment variables from .env file
dotenv.config();

// Constants
const PASSWORD_EXPIRATION_MINUTES = parseInt(process.env.PASSWORD_EXPIRATION_MINUTES || '3', 10);
const PASSWORD_REMINDER_MINUTES = 1; // Send a reminder 1 minute before expiration

// Function to check password expirations for the logged-in user
export async function checkPasswordExpirationForUser(userId: number) {
  console.log(`Executing password expiration check for user with ID: ${userId}`);

  try {
    const user = await UserService.getUserById(userId);
    if (!user) {
      console.log(`User with ID: ${userId} not found`);
      return;
    }

    console.log(`Checking user: ${user.email}`);
    const currentDate = new Date();
    console.log(`Current date and time: ${currentDate}`);

    if (user.passwordExpiresAt) {
      const expirationDate = new Date(user.passwordExpiresAt);
      const minutesUntilExpiration = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 60));
      console.log(`User ${user.email} password expires in ${minutesUntilExpiration} minutes`);

      if (minutesUntilExpiration > 0 && minutesUntilExpiration <= PASSWORD_REMINDER_MINUTES) {
        const subject = 'Password Expiration Reminder';
        const content = `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
              <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; margin-top: 0;">Password Expiration Reminder</h2>
                <p style="color: #666;">Hi ${user.firstname},</p>
                <p style="color: #666;">This is a reminder that your password for our platform will expire in ${minutesUntilExpiration} minute(s).</p>
                <p style="color: #666;">For security reasons, we recommend changing your password regularly. Please take a moment to update your password by clicking the link below:</p>
                <a href="https://your-app.com/reset-password" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Reset Password</a>
                <p style="color: #666;">If you do not change your password before the expiration date, you will be prompted to do so upon your next login attempt.</p>
                <p style="color: #666;">Best regards,</p>
                <p style="color: #666;">The E-Commerce Lydia Team</p>
              </div>
            </body>
          </html>
        `;

        console.log(`Sending password expiration reminder to ${user.email}`);
        try {
          await sendVerificationToken(user.email, subject, content);
          console.log(`Email sent to ${user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
        }
      } else if (minutesUntilExpiration <= 0) {
        const subject = 'Password Expiration Notification';
        const content = `
          <html>
            <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
              <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; margin-top: 0;">Password Expiration Notification</h2>
                <p style="color: #666;">Hi ${user.firstname},</p>
                <p style="color: #666;">Your password for our platform has expired. Please reset your password immediately to continue using our services.</p>
                <a href="https://your-app.com/reset-password" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Reset Password</a>
                <p style="color: #666;">Best regards,</p>
                <p style="color: #666;">The E-Commerce Lydia Team</p>
              </div>
            </body>
          </html>
        `;

        console.log(`Sending password expiration email to ${user.email}`);
        try {
          await sendVerificationToken(user.email, subject, content);
          console.log(`Email sent to ${user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
        }
      } else {
        console.log(`User ${user.email} password not expiring soon.`);
      }
    } else {
      console.log(`User ${user.email} password expiration date not set.`);
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
}

// Function to start the cron job for a specific user
export function startCronJob(userId: number) {
  console.log(`Cron job scheduled to run every minute for user with ID: ${userId}`);
  cron.schedule('* * * * *', () => checkPasswordExpirationForUser(userId));
}