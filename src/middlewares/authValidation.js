import Joi from 'joi';
import { BadRequestException } from '#errors/index.js';

export function validateAuth(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: true });
  if (error) throw new BadRequestException(error.details[0].message);
  return next();
}
