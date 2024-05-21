import { validateUserCreation } from '../validations/registeruser.validation.js';
import User from '../models/userModel.js';
import UserCreationAttributes from '../models/userModel.js';
import UserAttributes from '../models/userModel.js';
import { Op } from 'sequelize'; // Import Op from sequelize
import {passwordValidation,  validateUserupdates } from '../validations/updatesValidation.js'
import bcrypt from 'bcrypt'


export class userService {
  async createUser(userDetails: UserCreationAttributes): Promise<UserAttributes> {
    const validationErrors = validateUserCreation(userDetails);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    try {
      const user = await User.create(userDetails);
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

  async getAllUsers(): Promise<Omit<UserAttributes, 'password'>[]> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
      });
      return users.map((user) => user.toJSON() as unknown as Omit<UserAttributes, 'password'>);
    } catch (error: any) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async updateUser(userId: number, updates: Partial<UserAttributes>): Promise<UserAttributes | null> {
    try {
      
      const validateUpdates = validateUserupdates(updates)
       
      const user = await User.findByPk(userId);
      if (user) {
        if(!user.isverified){
          throw new Error(`Error updating user: user not verified`);
      }
        if(validateUpdates.length > 0){
          throw new Error(`Validation failed: ${validateUpdates.join(', ')}`);
         
        }
        await user.update(updates);
        return user.toJSON() as UserAttributes;
      }
      return null;
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
          [Op.and]: fields
        },
        attributes: { exclude: ['password'] }
      });
      return user ? (user.toJSON() as UserAttributes) : null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
 
   // useless method to get user by email but modified the above to accept any field
  async getUserByEmail(email: string): Promise<UserAttributes | null> {
    try {
      const user = await User.findOne({ where: { email } });
      return user ? user.toJSON() as UserAttributes : null;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
  async changePassword(userId:number,oldPassword:string,newPassword:string){
  try{
    const isValidated = passwordValidation.validate({password:newPassword})
    const user = await User.findByPk(userId)
    if(user){
      const match = await bcrypt.compare(oldPassword, user.password)
    if(match){ 
      
      if(isValidated.error){
        throw new Error(`Validation:${isValidated.error.message}`)
        
      }
      await user.update({password:newPassword})
     return ({code:200,message:"password changed successfully"})
    }
  }
  return ({code:401,message:"Incorrect old password"})
  

}
catch(error:any){
  throw new Error(`failed to change password:${error.message}`)
}
  }
}


export const UserService = new userService();
