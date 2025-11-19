import Joi from "joi";

export const saveStepDataSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
    stepKey: Joi.string().trim().min(2).max(50).required(),
  }),
  query: Joi.object({}),
  body: Joi.object({
    form_data: Joi.object().required(),
  }),
});

export const getStepDataSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
    stepKey: Joi.string().trim().min(2).max(50).required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});

export const getSubmissionProgressSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});
