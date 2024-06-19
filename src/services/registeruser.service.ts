import { Op } from 'sequelize'; // Import Op from sequelize
import bcrypt, { genSalt } from 'bcrypt';
import Role from 'models/roleModel.js';
import { validateUserCreation } from '../validations/registeruser.validation.js';
import User from '../models/userModel.js';
import UserCreationAttributes from '../models/userModel.js';
import UserAttributes from '../models/userModel.js';
import { validateUserupdates, passwordValidation } from '../validations/updatesValidation.js';
import sendEmailMessage from '../helpers/sendEmail.js';

export class userService {
  async createUser(userDetails: UserCreationAttributes): Promise<UserAttributes> {
    const validationErrors = validateUserCreation(userDetails);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    try {
      const expirationPeriod = 30 * 24 * 60;
      const passwordExpiresAt = new Date();
      passwordExpiresAt.setMinutes(passwordExpiresAt.getMinutes() + expirationPeriod);

      const user = await User.create({
        ...userDetails,
        lastPasswordChange: new Date(),
        passwordExpiresAt,
      });
      return user.toJSON() as UserAttributes;
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserById(userId: number): Promise<UserAttributes | null> {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });
      return user ? (user.toJSON() as UserAttributes) : null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<UserAttributes[]> {
    try {
      const users = await User.findAll();
      return users.map((user) => user.toJSON() as UserAttributes);
    } catch (error: any) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async updateUser(userId: number, updates: Partial<UserAttributes>): Promise<UserAttributes | null> {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update(updates);
        return user.toJSON() as UserAttributes;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async updateUserInfo(userId: number, updates: Partial<UserAttributes>): Promise<UserAttributes | null> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const userData = user.toJSON() as UserAttributes;
      if (!userData.isverified) {
        throw new Error('Error updating user: user not verified');
      }

      const validateUpdates = validateUserupdates(updates);
      if (validateUpdates.length > 0) {
        throw new Error(`Validation failed: ${validateUpdates.join(', ')}`);
      }

      const { firstname, othername, email, phone, password, street, city, state, postal_code, country } = updates;

      let updatedUser: any;

      if (firstname) {
        updatedUser = await user.update({ firstname });
      }
      if (othername) {
        updatedUser = await user.update({ othername });
      }
      if (email) {
        const existingEmail = await User.findOne({
          where: {
            email,
          },
        });
        if (existingEmail) {
          throw new Error('Email already exists');
        }
        updatedUser = await user.update({ email });
      }
      if (phone) {
        updatedUser = await user.update({ phone });
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedUser = await user.update({ password: hashedPassword });
      }
      if (street) {
        updatedUser = await user.update({ street });
      }
      if (city) {
        updatedUser = await user.update({ city });
      }
      if (state) {
        updatedUser = await user.update({ state });
      }
      if (postal_code) {
        updatedUser = await user.update({ postal_code });
      }
      if (country) {
        updatedUser = await user.update({ country });
      }

      return updatedUser.toJSON() as UserAttributes;
    } catch (error: any) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // New method to get a user by specific fields
  async getUserByFields(fields: Partial<UserAttributes>): Promise<UserAttributes | null> {
    try {
      const user = await User.findOne({
        where: {
          [Op.and]: fields,
        },
        attributes: { exclude: ['password'] },
      });
      return user ? (user.toJSON() as UserAttributes) : null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  //  method to get user by email
  async getUserByEmail(email: string): Promise<UserAttributes | null> {
    try {
      const user = await User.findOne({ where: { email } });
      return user ? (user.toJSON() as UserAttributes) : null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    try {
      const salt = await genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const { error } = passwordValidation.validate({ password: newPassword });
      const user = await User.findByPk(userId);

      if (user) {
        const userData = user.toJSON();
        const match = await bcrypt.compare(oldPassword, userData.password);

        if (match) {
          if (error) {
            throw new Error(`Validation:${error.message}`);
          }

          // Set password expiration period to 30 days
          const expirationPeriod = 30 * 24 * 60; // 30 days in minutes
          const passwordExpiresAt = new Date();
          passwordExpiresAt.setMinutes(passwordExpiresAt.getMinutes() + expirationPeriod);

          await user.update({
            password: hashedPassword,
            lastPasswordChange: new Date(),
            passwordExpiresAt,
            isBlocked: false,
          });

          const content = `
            <p>Hi ${userData.firstname},</p>
            <div>Congratulations! Your password has been successfully changed.</div>
            <div>If this wasn't you, please reset your password and create a strong password.</div>
            <div>If you have any questions or need further assistance, feel free to contact our support team.</div>
            <div>Best regards,</div>
            <div>The E-Commerce Lydia Team</div>
          `;

          sendEmailMessage(userData.email, 'Password Changed', content);
          return { code: 200, message: 'Password changed successfully' };
        }
        return { code: 401, message: 'Incorrect old password' };
      }
    } catch (error: any) {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }

  async getUsersWithExpiredPasswords(): Promise<UserAttributes[]> {
    try {
      const currentDate = new Date();
      const users = await User.findAll({
        where: {
          passwordExpiresAt: {
            [Op.lt]: currentDate,
          },
        },
        attributes: { exclude: ['password'] },
      });
      return users.map((user) => user.toJSON() as UserAttributes);
    } catch (error: any) {
      throw new Error(`Error fetching users with expired passwords: ${error.message}`);
    }
  }
}

export const UserService = new userService();
