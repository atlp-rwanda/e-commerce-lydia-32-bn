import cron from 'node-cron';
import { UserService } from '../services/registeruser.service.js';
import sendEmailMessage from '../helpers/sendEmail.js';

async function checkAndNotifyExpiredPasswords() {
  console.log('Checking for users with expired passwords...');

  try {
    const users = await UserService.getUsersWithExpiredPasswords();
    const subject = 'Password Expiration Notification';
    users.forEach(async (user) => {
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
        await sendEmailMessage(user.email, subject, content);
        console.log(`Email sent to ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
      }
    });
  } catch (error) {
    console.error('Error checking for expired passwords:', error);
  }
}

export function startCronJob() {
  console.log('Cron job scheduled to run every day to check for expired passwords');
  cron.schedule('0 0 * * *', checkAndNotifyExpiredPasswords);
}
