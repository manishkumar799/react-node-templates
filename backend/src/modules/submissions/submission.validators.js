import Joi from "joi";

export const createSubmissionSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    market_code: Joi.string().trim().uppercase().min(2).max(10).required(),
    // business_details: Joi.object({
    //   legal_name: Joi.string().trim().min(2).max(200),
    //   registration_number: Joi.string().trim().max(100),
    //   country: Joi.string().length(2).uppercase(),
    //   // extend with directors, addresses, etc. in later milestones
    // }).default({}),
  }),
});

export const getSubmissionSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});

export const listSubmissionsSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({
    status: Joi.string().valid(
      "draft",
      "submitted",
      "under_review",
      "more_info_required",
      "approved",
      "rejected",
      "revoked"
    ),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
  }),
  body: Joi.object({}),
});

export const updateSubmissionSchema = Joi.object({
  params: Joi.object({ id: Joi.string().uuid().required() }),
  query: Joi.object({}),
  body: Joi.object({
    business_details: Joi.object({
      legal_name: Joi.string().trim().min(2).max(200),
      registration_number: Joi.string().trim().max(100),
      country: Joi.string().length(2).uppercase(),
    }).required(),
  }),
});

export const submitActionSchema = Joi.object({
  params: Joi.object({ id: Joi.string().uuid().required() }),
  query: Joi.object({}),
  body: Joi.object({
    confirm: Joi.boolean().valid(true).required(),
  }),
});

export const adminListSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({
    market_code: Joi.string().trim().uppercase(),
    status: Joi.string().valid(
      "draft",
      "submitted",
      "under_review",
      "more_info_required",
      "approved",
      "rejected",
      "revoked"
    ),
    from: Joi.date().iso(),
    to: Joi.date().iso(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
  }),
  body: Joi.object({}),
});

export const triageSchema = Joi.object({
  params: Joi.object({ id: Joi.string().uuid().required() }),
  query: Joi.object({}),
  body: Joi.object({}).default({}),
});

export const adminDecisionSchema = Joi.object({
  params: Joi.object({ id: Joi.string().uuid().required() }),
  query: Joi.object({}),
  body: Joi.object({
    decision: Joi.string()
      .valid("more_info_required", "approved", "rejected")
      .required(),
    notes: Joi.string().allow("", null),
  }),
});

export const adminDocDecisionSchema = Joi.object({
  params: Joi.object({ documentId: Joi.string().uuid().required() }),
  query: Joi.object({}),
  body: Joi.object({
    decision: Joi.string().valid("approve", "reject").required(),
    reason: Joi.string().allow("", null),
  }),
});
