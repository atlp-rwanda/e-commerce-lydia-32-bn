import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

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
