import { validateUserCreation } from '../validations/registeruser.validation.js';
import User from '../models/userModel.js';
import { Op } from 'sequelize'; // Import Op from sequelize
import { validateUserupdates, passwordValidation } from '../validations/updatesValidation.js';
import bcrypt, { genSalt } from 'bcrypt';
import sendVerificationToken from '../helpers/sendEmail.js';
export class userService {
    async createUser(userDetails) {
        const validationErrors = validateUserCreation(userDetails);
        if (validationErrors.length > 0) {
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
        try {
            const user = await User.create(userDetails);
            return user.toJSON();
        }
        catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] },
            });
            return user ? user.toJSON() : null;
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }
    async getAllUsers() {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
            });
            return users.map((user) => user.toJSON());
        }
        catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }
    async updateUser(userId, updates) {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                await user.update(updates);
                return user.toJSON();
            }
            return null;
        }
        catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }
    async updateUserInfo(userId, updates) {
        try {
            const validateUpdates = validateUserupdates(updates);
            const user = await User.findByPk(userId);
            if (user) {
                const userData = user.toJSON();
                if (!userData.isverified) {
                    throw new Error(`Error updating user: user not verified`);
                }
                if (validateUpdates.length > 0) {
                    // throw new Error(`Validation failed: ${validateUpdates.join(', ')}`);
                }
                await user.update(updates);
                return user.toJSON();
            }
            return null;
        }
        catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }
    async deleteUser(userId) {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                await user.destroy();
                return true;
            }
            return false;
        }
        catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
    // New method to get a user by specific fields
    async getUserByFields(fields) {
        try {
            const user = await User.findOne({
                where: {
                    [Op.and]: fields,
                },
                attributes: { exclude: ['password'] },
            });
            return user ? user.toJSON() : null;
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }
    //  method to get user by email
    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ where: { email } });
            return user ? user.toJSON() : null;
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const salt = await genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const { error } = passwordValidation.validate({ password: newPassword });
            const user = await User.findByPk(userId);
            if (user) {
                const userData = user.toJSON();
                const content = `
        <p>Hi ${userData.firstname},</p>
        <div>Congratulations! Your paasword  has been successfully changed.</div>
        <div>if is not you chnaged password please reset password and create strong password</div>
        <div>If you have any questions or need further assistance, feel free to contact our support team.</div>
        <div>Best regards,</div>
        <div>The E-Commerce Lydia Team</div>
      `;
                if (!userData.isverified) {
                    return { code: 401, message: 'You are not verified' };
                }
                const match = await bcrypt.compare(oldPassword, userData.password);
                if (match) {
                    if (error) {
                        throw new Error(`Validation:${error.message}`);
                    }
                    await user.update({ password: hashedPassword });
                    sendVerificationToken(userData.email, 'password changed ', content);
                    console.log('email sent');
                    return { code: 200, message: 'password changed successfully' };
                }
                return { code: 401, message: 'Incorrect old password' };
            }
        }
        catch (error) {
            throw new Error(`failed to change password:${error.message}`);
        }
    }
}
export const UserService = new userService();
