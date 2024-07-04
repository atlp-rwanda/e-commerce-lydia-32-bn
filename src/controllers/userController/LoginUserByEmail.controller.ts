import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../../models/userModel.js';
import sendEmailMessage from '../../helpers/sendEmail.js';
import { generateToken } from '../../utilis/generateToken.js';

export const loginByGoogle = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
    const getPayLoad = await response.json();

    const user = await User.findOne({ where: { email: getPayLoad?.email } });

    if (user) {
      if (user.dataValues.isverified === false) {
        return res.status(401).json({
          message: 'Please verify your email address to log in.'
        });
      }

      generateToken(res, user.dataValues.id, user.dataValues.email, user.dataValues.firstname);
      return res.status(200).json({ message: 'login successfully', user });
    } else {
      return res.status(400).json({
        message: 'User not Found'
      });
    }  

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'server error' });
  }
};


export const registerByGoogle = async (req: Request, res: Response) => {
  try {

    const { accessToken } = req.body;
    if(accessToken) {

      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);

      const getPayLoad = await response.json();
      const user = await User.findOne({ where: { email: getPayLoad?.email } });

      if(user) {
        return res.status(401).json({
          message: 'Email is taken'
        });
      }

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
        password: await bcrypt.hash(defaultPassword, 10),
        isverified: false,
        isBlocked: false,
        hasTwoFactor: false,
        roleId: 1,
      });
      
      const verificationToken = jwt.sign(
        { 
          userId: NewUser.dataValues.id, 
          email: NewUser.dataValues.email, 
          firstname: NewUser.dataValues.firstname 
        },
          process.env.VERIFICATION_JWT_SECRET || '',
        {
          expiresIn: '3d',
        },
      )

      const verificationUrl = `${process.env.FRONTEND_URL}/api/user/verify?token=${verificationToken}`;
      const subject = 'Email Verification';
      const content = `
        <p>Hi ${userName},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>If you did not sign up for this account, please ignore this email.</p>
        <p><strong>Important:</strong> For your security, please do not share this link with anyone.</p>
        <p>Best regards,</p>
      `;
      sendEmailMessage(NewUser.dataValues.email, subject, content);


      return res.status(201).json({
        message: 'Check your email for verification',
      });

    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'server error' });
  }
}