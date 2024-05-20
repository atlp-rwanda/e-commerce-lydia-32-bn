import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().max(50).required().messages({
    'string.empty': 'Product name is required.',
    'any.required': 'Product name is required.'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Product description is required.',
    'any.required': 'Product description is required.'
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be a positive number.',
    'any.required': 'Price is required.'
  }),
  category: Joi.string().max(128).required().messages({
    'string.empty': 'Product category is required.',
    'any.required': 'Product category is required.'
  }),
  expiry_date: Joi.date().optional().messages({
    'date.base': 'Expiry date must be a valid date.'
  }),
  bonus: Joi.string().max(128).optional().messages({
    'string.max': 'Bonus must be less than or equal to 128 characters.'
  }),
  images: Joi.array().items(Joi.string()).min(4).max(8).required().messages({
    'array.base': 'Images must be an array.',
    'array.min': 'Images must contain at least 4 items.',
    'array.max': 'Images must contain no more than 8 items.',
    'any.required': 'Images are required.'
  }),
  dimensions: Joi.string().regex(/^[a-zA-Z0-9\+\-\*\/\(\)]+$/).allow('').optional().messages({
    'string.pattern.base': 'Dimensions must contain only letters, numbers, and arithmetic signs (+, -, *, /, (, )).',
  }),
  seller_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Seller ID must be a number.',
    'number.integer': 'Seller ID must be an integer.',
    'number.positive': 'Seller ID must be a positive number.',
    'any.required': 'Seller ID is required.'
  })
});
