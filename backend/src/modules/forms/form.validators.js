import Joi from "joi";

export const getKycFormConfigSchema = Joi.object({
  params: Joi.object({
    marketCode: Joi.string().trim().uppercase().min(2).max(10).required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});
