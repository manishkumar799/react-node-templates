import Joi from "joi";

export const uploadStepDocumentSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    submission_id: Joi.string().uuid().required(),
    step_key: Joi.string().trim().min(2).max(50).required(),
    field_key: Joi.string().trim().min(2).max(100).required(),
    cloudinary_public_id: Joi.string().required(),
    cloudinary_secure_url: Joi.string().uri().required(),
    filename: Joi.string().required(),
    mime_type: Joi.string().required(),
    size_bytes: Joi.number().integer().min(1).required(),
  }),
});

export const deleteStepDocumentSchema = Joi.object({
  params: Joi.object({
    documentId: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});

// Keep existing validators for backward compatibility
export const uploadCallbackSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    submission_id: Joi.string().uuid().required(),
    document_type_code: Joi.string().trim().uppercase().required(),
    cloudinary_public_id: Joi.string().required(),
    cloudinary_secure_url: Joi.string().uri().required(),
    filename: Joi.string().required(),
    mime_type: Joi.string().required(),
    size_bytes: Joi.number().integer().min(1).required(),
  }),
});

export const deleteDocSchema = Joi.object({
  params: Joi.object({
    documentId: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});
