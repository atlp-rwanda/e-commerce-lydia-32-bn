import { validateUserCreation } from '../validations/registeruser.validation.js';
import User from '../models/userModel.js';
import { validateUserupdates } from '../validations/updatesValidation.js';
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
            const validateUpdates = validateUserupdates(updates);
            const user = await User.findByPk(userId);
            if (user) {
                if (validateUpdates.length > 0) {
                    throw new Error(`Validation failed: ${validateUpdates.join(', ')}`);
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
}
export const UserService = new userService();
