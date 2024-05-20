import Joi from 'joi';
// Joi schema for user creation
const userCreationSchema = Joi.object({
    firstname: Joi.string().regex(/^[a-zA-Z]+$/).messages({
        'string.pattern.base': 'First name must contain only letters.'
    }),
    othername: Joi.string().regex(/^[a-zA-Z]+$/).messages({
        'string.empty': 'Othername is required.',
        'string.pattern.base': 'Othername must contain only letters.'
    }),
    email: Joi.string().email().messages({
        'string.email': 'Invalid email format.',
        'string.empty': 'Email is required.',
    }),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).messages({
        'string.empty': 'Phone number is required.',
        'string.pattern.base': 'Phone number must be a valid 10-digit number.',
    }),
    usertype: Joi.string().regex(/^[a-zA-Z]+$/).messages({
        'string.empty': 'Role is required.',
        'string.pattern.base': 'Role must contain only letters.',
        'any.required': 'Role is required.'
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
    isAdmin: Joi.boolean().optional()
});
export const validateUserupdates = (userData) => {
    const { error } = userCreationSchema.validate(userData, { abortEarly: false });
    if (error) {
        return error.details.map((detail) => detail.message);
    }
    return [];
};
