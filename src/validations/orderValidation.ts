import Joi from 'joi';

export const orderSchema = Joi.object({
  payment: Joi.string().required(),
  address: Joi.array()
    .items(
      Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
      }),
    )
    .required(),
});


