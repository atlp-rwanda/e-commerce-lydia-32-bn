import Joi from 'joi';
import { Request,Response,NextFunction } from 'express';

// Schema for validating the request when retrieving a product by a seller
export const getSellerProductSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  // role: Joi.string().valid('seller').required(),

});

// Schema for validating the request when retrieving a product by a buyer
export const getBuyerProductSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  // role: Joi.string().valid('buyer').required(),
  
});

// Middleware for validating the request
export const validateRequest = (schema:any) => {
  return (req: Request, res:Response, next:NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      const errors = error.details.map((error:any) => error.message);
      return res.status(400).json({ errors });
    }

    next();
  };
};