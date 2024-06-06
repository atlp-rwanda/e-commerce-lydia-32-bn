import Joi from 'joi';

export const productSchema = Joi.object({
  productName: Joi.string().max(128).required().messages({
    'string.empty': 'Product name is required.',
    'string.max': 'Product name must be less than or equal to 128 characters.',
    'any.required': 'Product name is required.',
  }),
  description: Joi.string().max(500).required().messages({
    'string.empty': 'Product description is required.',
    'string.max': 'Product description must be less than or equal to 500 characters.',
    'any.required': 'Product description is required.',
  }),
  productCategory: Joi.string().max(128).required().messages({
    'string.empty': 'Product category is required.',
    'string.max': 'Product category must be less than or equal to 128 characters.',
    'any.required': 'Product category is required.',
  }),
  price: Joi.number().positive().greater(0).required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be a positive number.',
    'number.greater': 'Price must be greater than 0.',
    'any.required': 'Price is required.',
  }),
  quantity: Joi.number().integer().positive().greater(0).required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.positive': 'Quantity must be a positive number.',
    'number.greater': 'Quantity must be greater than 0.',
    'any.required': 'Quantity is required.',
  }),
  images: Joi.string().required().messages({
    'string.empty': 'Images is required.',
    'any.required': 'Images is required.',
  }),
  dimensions: Joi.string()
    .regex(/^[\w\+\-\*\/\(\)]+$/)
    .allow('')
    .max(128)
    .optional()
    .messages({
      'string.pattern.base': 'Dimensions must contain only letters, numbers, and arithmetic signs (+, -, *, /, (, )).',
      'string.max': 'Dimensions must be less than or equal to 128 characters.',
    }),
  isAvailable: Joi.boolean().optional().messages({
    'boolean.base': 'IsAvailable must be a boolean.',
  }),
});

export const updateProductSchema = Joi.object({
  productName: Joi.string().max(128).optional().messages({
    'string.max': 'Product name must be less than or equal to 128 characters.',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Product description must be less than or equal to 500 characters.',
  }),
  productCategory: Joi.string().max(128).optional().messages({
    'string.max': 'Product category must be less than or equal to 128 characters.',
  }),
  price: Joi.number().positive().greater(0).optional().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be a positive number.',
    'number.greater': 'Price must be greater than 0.',
  }),
  quantity: Joi.number().integer().positive().greater(0).optional().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.positive': 'Quantity must be a positive number.',
    'number.greater': 'Quantity must be greater than 0.',
  }),
  images: Joi.string().required().messages({
    'string.empty': 'Images is required.',
    'any.required': 'Images is required.',
  }),
  dimensions: Joi.string()
    .regex(/^[\w\+\-\*\/\(\)]+$/)
    .allow('')
    .max(128)
    .optional()
    .messages({
      'string.pattern.base': 'Dimensions must contain only letters, numbers, and arithmetic signs (+, -, *, /, (, )).',
      'string.max': 'Dimensions must be less than or equal to 128 characters.',
    }),
  isAvailable: Joi.boolean().optional().messages({
    'boolean.base': 'IsAvailable must be a boolean.',
  }),
});
