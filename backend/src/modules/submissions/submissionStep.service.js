import { sequelize } from "../../common/dal/index.js";
import { KycSubmission } from "./submission.model.js";
import { KycSubmissionStep } from "./submissionStep.model.js";
import { Business } from "../businesses/business.model.js";
import {
  getStepConfiguration,
  validateStepData,
} from "../forms/form.service.js";
import { auditLog } from "../audit/audit.service.js";
import { enqueueEvent } from "../events/outbox.helper.js";

export async function saveStepData(
  businessId,
  submissionId,
  stepKey,
  formData
) {
  const t = await sequelize.transaction();
  try {
    const submission = await KycSubmission.findByPk(submissionId, {
      transaction: t,
    });
    if (!submission) {
      const err = new Error("Submission not found");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }

    // Verify ownership
    const biz = await Business.findByPk(submission.business_id, {
      transaction: t,
    });
    if (!biz || biz.external_ref !== businessId) {
      const err = new Error("Not found");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }

    // Get step configuration
    const step = await getStepConfiguration(submission.market_id, stepKey);
    if (!step) {
      const err = new Error("Invalid step");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }

    // Validate step data
    const validation = validateStepData(step.kyc_form_fields, formData);
    if (!validation.valid) {
      const err = new Error("Validation failed");
      err.code = "VALIDATION_ERROR";
      err.httpStatus = 400;
      err.details = validation.errors;
      throw err;
    }

    // Save/update step data
    await KycSubmissionStep.upsert(
      {
        submission_id: submissionId,
        step_key: stepKey,
        step_number: step.step_number,
        status: "completed",
        form_data: formData,
        completed_at: new Date(),
      },
      { transaction: t }
    );

    // Update submission progress
    const completedSteps = await KycSubmissionStep.findAll({
      where: { submission_id: submissionId, status: "completed" },
      transaction: t,
    });

    const completedStepKeys = completedSteps.map((s) => s.step_key);
    const maxStepNumber = Math.max(...completedSteps.map((s) => s.step_number));

    await submission.update(
      {
        completed_steps: completedStepKeys,
      },
      { transaction: t }
    );

    // Audit log
    await auditLog(
      {
        submission_id: submissionId,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: businessId,
        action: `step.${stepKey}.completed`,
        payload: { step_number: step.step_number, form_data: formData },
      },
      t
    );

    // Event
    await enqueueEvent(
      {
        aggregate_type: "submission",
        aggregate_id: submissionId,
        event_type: "kyc.submission.step.completed",
        payload: { step_key: stepKey, step_number: step.step_number },
      },
      t
    );

    await t.commit();
    return {
      success: true,
      next_step: maxStepNumber + 1,
      completed_steps: completedStepKeys,
    };
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

export async function getStepData(businessId, submissionId, stepKey) {
  const submission = await KycSubmission.findByPk(submissionId);
  if (!submission) return null;

  const biz = await Business.findByPk(submission.business_id);
  if (!biz || biz.external_ref !== businessId) return null;

  const stepData = await KycSubmissionStep.findOne({
    where: { submission_id: submissionId, step_key: stepKey },
  });

  return {
    step_data: stepData ? stepData.form_data : {},
    status: stepData ? stepData.status : "pending",
    completed_at: stepData ? stepData.completed_at : null,
  };
}

export async function getSubmissionProgress(businessId, submissionId) {
  const submission = await KycSubmission.findByPk(submissionId, {
    include: [
      {
        model: KycSubmissionStep,
        order: [["step_number", "ASC"]],
      },
    ],
  });

  if (!submission) return null;

  // const biz = await Business.findByPk(submission.business_id);
  // if (!biz || biz.external_ref !== businessId) return null;

  return {
    id: submission.id,
    status: submission.status,
    completed_steps: submission.completed_steps,
    steps: submission.kyc_submission_steps,
  };
}
