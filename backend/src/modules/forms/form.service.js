import { KycFormStep } from "./kycFormStep.model.js";
import { KycFormField } from "./kycFormField.model.js";
import { Market } from "../markets/market.model.js";

export async function getKycFormConfiguration(marketCode) {
  const market = await Market.findOne({ where: { code: marketCode } });
  if (!market) return null;

  const steps = await KycFormStep.findAll({
    where: { market_id: market.id, is_active: true },
    include: [
      {
        model: KycFormField,
        where: { is_active: true },
        required: false,
        order: [["display_order", "ASC"]],
      },
    ],
    order: [["step_number", "ASC"]],
  });

  return { market, steps };
}

export async function getStepConfiguration(marketId, stepKey) {
  return KycFormStep.findOne({
    where: { market_id: marketId, step_key: stepKey, is_active: true },
    include: [
      {
        model: KycFormField,
        where: { is_active: true },
        required: false,
        order: [["display_order", "ASC"]],
      },
    ],
  });
}

export function validateStepData(fields, formData) {
  const errors = [];

  for (const field of fields) {
    const value = formData[field.field_key];

    // Required field validation
    if (field.is_required && (!value || value === "")) {
      errors.push({
        field: field.field_key,
        message: `${field.field_label} is required`,
      });
      continue;
    }

    if (!value) continue;

    // Type-specific validation
    switch (field.field_type) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push({
            field: field.field_key,
            message: `${field.field_label} must be a valid email`,
          });
        }
        break;
      case "url":
        try {
          new URL(value);
        } catch {
          errors.push({
            field: field.field_key,
            message: `${field.field_label} must be a valid URL`,
          });
        }
        break;
      case "number":
        if (isNaN(value)) {
          errors.push({
            field: field.field_key,
            message: `${field.field_label} must be a number`,
          });
        }
        break;
      case "select":
        const options = field.field_options?.options || [];
        // if (!options.includes(value)) {
        //   errors.push({
        //     field: field.field_key,
        //     message: `${field.field_label} must be one of: ${options.join(
        //       ", "
        //     )}`,
        //   });
        // }
        break;
    }

    // Custom validation rules
    if (field.validation_rules) {
      const rules = field.validation_rules;
      if (rules.min_length && value.length < rules.min_length) {
        errors.push({
          field: field.field_key,
          message: `${field.field_label} must be at least ${rules.min_length} characters`,
        });
      }
      if (rules.max_length && value.length > rules.max_length) {
        errors.push({
          field: field.field_key,
          message: `${field.field_label} must be at most ${rules.max_length} characters`,
        });
      }
      if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
        errors.push({
          field: field.field_key,
          message: `${field.field_label} format is invalid`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
