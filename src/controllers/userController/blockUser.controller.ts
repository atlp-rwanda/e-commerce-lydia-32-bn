import { Request, Response, NextFunction } from 'express';
import User from '../../models/userModel.js';
import sendVerificationToken from '../../helpers/sendEmail.js';
import { UserService } from '../../services/registeruser.service.js';

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { email }  = req.body
    const user = await UserService.getUserByFields({ email });

    if(user) {
      const [updatedRows, [updatedUser]] = await User.update(
        {
          isBlocked: true,
        },
        {
          where: { id },
          returning: true,
        },
      );
      if (updatedRows > 0) {
        const subject = 'Important: Your Account Has Been Blocked';
        const content = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding: 20px; background-color: #007BFF; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1>Account Blocked</h1>
      </div>
      <div style="padding: 20px;">
        <p>Dear ${updatedUser.dataValues.firstname},</p>
        <p>We regret to inform you that your account associated with this email address has been blocked due to suspicious activity.</p>
        <p><strong>Reason:</strong> Fraudulent activity detected</p>
        <p>We take the security and integrity of our platform very seriously. To protect our community, we have taken this action to prevent any further unauthorized activity on your account.</p>
        <p>If you believe this is a mistake or you have any questions, please contact our support team by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="mailto:support@example.com" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Contact Support</a>
        </p>
        <p>Thank you for your understanding and cooperation.</p>
        <p>Sincerely,<br>The E-commerce Team</p>
      </div>
      <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.9em; color: #666;">
        <p>If you did not request this action or have further concerns, please contact us immediately at <a href="mailto:support@example.com">support@example.com</a>.</p>
        <p>&copy; 2024 [Your Company]. All rights reserved.</p>
      </div>
    </div>
  </div>
`;
        sendVerificationToken(user.dataValues.email, subject, content);
        return res.status(200).json({ message: 'user is blocked' });
      }
    }
  } catch (error) {
    res.status(500).json('server error');
    console.log(error);
  }
};
