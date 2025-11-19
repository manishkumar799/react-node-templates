import Joi from "joi";

export const getRequirementsSchema = Joi.object({
  params: Joi.object({
    marketCode: Joi.string().trim().uppercase().min(2).max(10).required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});

export const createMarketSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    code: Joi.string().trim().uppercase().min(2).max(10).required(),
    name: Joi.string().trim().min(2).max(100).required(),
    active: Joi.boolean().default(true),
    workflow_config: Joi.object().default({}),
  }),
});

export const upsertDocTypeSchema = Joi.object({
  params: Joi.object({
    marketId: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({
    code: Joi.string().trim().uppercase().max(50).required(),
    name: Joi.string().trim().max(150).required(),
    description: Joi.string().allow("", null),
    is_required: Joi.boolean().required(),
    min_count: Joi.number().integer().min(0).required(),
    max_count: Joi.number().integer().min(Joi.ref("min_count")).required(),
    allowed_mime_types: Joi.array().items(Joi.string()).min(1).required(),
    validations: Joi.object({
      size_max_mb: Joi.number().integer().min(1).max(50).default(10),
      expiry_days: Joi.number().integer().min(0),
    }).default({ size_max_mb: 10 }),
    active: Joi.boolean().default(true),
  }),
});
