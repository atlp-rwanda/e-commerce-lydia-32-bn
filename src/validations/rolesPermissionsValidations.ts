import Joi from 'joi';

// Joi schema for user creation
const rolesPermissionsCreationSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .required()
    .messages({
      'string.empty': 'Name is required.',
      'string.pattern.base': 'Name must contain only letters.',
      'any.required': 'Name is required.',
    }),
});

export const validateRolePermissionCreation = (rolesPermissionData: any): string[] => {
  const { error } = rolesPermissionsCreationSchema.validate(rolesPermissionData, { abortEarly: false });
  if (error) {
    return error.details.map((detail: any) => detail.message);
  }
  return [];
};
