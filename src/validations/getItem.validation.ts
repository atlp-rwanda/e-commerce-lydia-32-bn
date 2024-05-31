import Joi from 'joi';
import { Request,Response,NextFunction } from 'express';

// Schema for validating the request when retrieving a product by a seller
export const getSellerProductSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),


});

// Schema for validating the request when retrieving a product by a buyer
export const getBuyerProductSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  
  
});
