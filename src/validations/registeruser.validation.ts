import Joi from 'joi';

// Joi schema for user creation
const userCreationSchema = Joi.object({
  firstname: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required.',
      'string.pattern.base': 'First name must contain only letters.',
      'any.required': 'First name is required.',
    }),
  othername: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .required()
    .messages({
      'string.empty': 'Othername is required.',
      'string.pattern.base': 'Othername must contain only letters.',
      'any.required': 'Othername is required.',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  phone: Joi.string().required().pattern(new RegExp('^[0-9]{10}$')).messages({
    'string.empty': 'Phone number is required.',
    'string.pattern.base': 'Phone number must be a valid 10-digit number.',
    'any.required': 'Phone number is required.',
  }),
  password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).required().min(8).messages({
    'string.empty': 'Password is required.',
    'string.pattern.base':
      'Password must contain at least one lowercase letter, one uppercase letter, one digit and be at least 8 characters long.',
  }),
  usertype: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .messages({
      'string.empty': 'Role is required.',
      'string.pattern.base': 'Role must contain only letters.',
      'any.required': 'Role is required.',
    }),
  street: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional().messages({
    'string.pattern.base': 'Role must contain only letters.',
  }),
  state: Joi.string().allow('').optional().messages({
    'string.pattern.base': 'Role must contain only letters.',
  }),
  postal_code: Joi.string().allow('').optional(),
  country: Joi.string().allow('').optional().messages({
    'string.pattern.base': 'Role must contain only letters.',
  }),
  isAdmin: Joi.boolean().optional(),
});

export const UserschemaValidate = Joi.object({
  isAdmin: Joi.boolean(),
});

export const validateUserCreation = (userData: any): string[] => {
  const { error } = userCreationSchema.validate(userData, { abortEarly: false });
  if (error) {
    return error.details.map((detail: any) => detail.message);
  }
  return [];
};
