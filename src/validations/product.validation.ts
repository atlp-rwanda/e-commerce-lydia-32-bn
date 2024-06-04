import Joi from 'joi';

export const productSchema = Joi.object({
  userId: Joi.number().integer().positive().optional().messages({
    'number.base': 'User ID must be a number.',
    'number.integer': 'User ID must be an integer.',
    'number.positive': 'User ID must be a positive number.',
    'any.required': 'User ID is required.',
  }),
  productName: Joi.string().max(128).required().messages({
    'string.empty': 'Product name is required.',
    'string.max': 'Product name must be less than or equal to 128 characters.',
    'any.required': 'Product name is required.',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Product description is required.',
    'any.required': 'Product description is required.',
  }),
  productCategory: Joi.string().max(128).required().messages({
    'string.empty': 'Product category is required.',
    'string.max': 'Product category must be less than or equal to 128 characters.',
    'any.required': 'Product category is required.',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be a positive number.',
    'any.required': 'Price is required.',
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.positive': 'Quantity must be a positive number.',
    'any.required': 'Quantity is required.',
  }),
  images: Joi.string().required().messages({
    'string.empty': 'Images is required.',
    'any.required': 'Images is required.',
  }),
  dimensions: Joi.string()
    .regex(/^[\w\+\-\*\/\(\)]+$/)
    .allow('')
    .optional()
    .messages({
      'string.pattern.base': 'Dimensions must contain only letters, numbers, and arithmetic signs (+, -, *, /, (, )).',
    }),
  isAvailable: Joi.boolean().optional().messages({
    'boolean.base': 'IsAvailable must be a boolean.',
  }),
});
