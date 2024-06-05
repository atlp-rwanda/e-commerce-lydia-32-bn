import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getSellerProductSchema, getBuyerProductSchema } from '../validations/getItem.validation.js';
import { productSchema, updateProductSchema } from '../validations/product.validation.js';

const searchSchema = Joi.object({
  name: Joi.string().optional(),
  minPrice: Joi.number().optional(),
  maxPrice: Joi.number().optional(),
  category: Joi.string().optional(),
}).unknown(false);

const validateSearchProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = await searchSchema.validate(req.query, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join('; ');
      return res.status(400).json({ error: errorMessage });
    }
    next();
  } catch (err) {
    console.error('Error searching a product:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { validateSearchProduct };

export const validateSellerProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = getSellerProductSchema.validate({ productId: req.params.productId });
  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }
  next();
};

export const validateBuyerProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = getBuyerProductSchema.validate({ productId: req.params.productId });

  if (error) {
    res.status(400).json({ errors: error.details.map((err) => err.message) });
    return;
  }
  next();
};

export const validateCreateProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = productSchema.validate(req.body);

  if (error) {
    res.status(400).json({ errors: error.details.map((err) => err.message) });
    return;
  }
  next();
};

export const validateUpdateProductRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateProductSchema.validate(req.body);

  if (error) {
    res.status(400).json({ errors: error.details.map((err) => err.message) });
    return;
  }
  next();
};
