import { Response, Request } from 'express';
import User from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import sendVerificationToken from '../../helpers/sendEmail.js';
import generateVerificationToken from '../../utilis/generateToken.js';
import jwt from 'jsonwebtoken';

export const loginByGoogle = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);

    const getPayLoad = await response.json();

    let user = await User.findOne({ where: { email: getPayLoad?.email } });

    if (!user) {
      const userNameRes = await fetch('https://people.googleapis.com/v1/people/me?personFields=names', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userObjName = await userNameRes.json();
      const userName = userObjName.names[0]?.displayName;

      const defaultPassword = Math.random().toString(36).slice(-8);

      const NewUser = await User.create({
        firstname: userName || 'DefaultFirstName',
        othername: userName || 'DefaultFirstName',
        email: getPayLoad?.email || 'default@example.com',
        phone: '',
        password: await bcrypt.hash(defaultPassword, 10),
        usertype: 'buyer',
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        isverified: false,
        isAdmin: false,
        isBlocked: false,
      });

      const verificationToken = generateVerificationToken(
        res,
        NewUser.dataValues.id,
        NewUser.dataValues.email,
        NewUser.dataValues.firstname,
      );
      const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;
      const subject = 'Email Verification';
      const content = `
        <p>Hi ${userName},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>If you did not sign up for this account, please ignore this email.</p>
        <p><strong>Important:</strong> For your security, please do not share this link with anyone.</p>
        <p>Best regards,</p>
      `;
      sendVerificationToken(NewUser.dataValues.email, subject, content);

      return res.status(201).json({
        message: 'User created successfully. Please check your email to verify your account.',
      });
    }

    if (!user.dataValues.isverified) {
      return res.status(401).json({
        message: 'Please verify your email address to log in.',
        token: jwt.sign(
          { userId: user.dataValues.id, email: user.dataValues.email, firstname: user.dataValues.firstname },
          process.env.VERIFICATION_JWT_SECRET || '',
          {
            expiresIn: '3d',
          },
        ),
      });
    }

    generateVerificationToken(res, user.dataValues.id, user.dataValues.email, user.dataValues.firstname);

    return res.status(200).json({ message: 'login successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'server error' });
  }
};
