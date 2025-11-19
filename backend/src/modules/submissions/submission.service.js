import { sequelize, Op } from "../../common/dal/index.js";
import { Market } from "../markets/market.model.js";
import { KycDocumentType } from "../markets/documentType.model.js";
import { Business } from "../businesses/business.model.js";
import { KycSubmission } from "./submission.model.js";
import { KycSubmissionDocument } from "./submissionDocument.model.js";
import { KycSubmissionStep } from "./submissionStep.model.js";
import { auditLog } from "../audit/audit.service.js";
import { enqueueEvent } from "../events/outbox.helper.js";
import {
  SubmissionStatuses,
  canEdit,
  canSubmit,
  canTriage,
  canDecide,
} from "./submission.status.js";

async function ensureBusinessProjection(businessId, market, details, t) {
  let biz = await Business.findOne({
    where: { external_ref: businessId },
    transaction: t,
  });
  if (!biz) {
    biz = await Business.create(
      {
        external_ref: businessId,
        legal_name: details?.legal_name || null,
        registration_number: details?.registration_number || null,
        country: details?.country || market.code,
        market_id: market.id,
        status: "active",
      },
      { transaction: t }
    );
  } else {
    await biz.update(
      {
        legal_name: details?.legal_name ?? biz.legal_name,
        registration_number:
          details?.registration_number ?? biz.registration_number,
        country: details?.country ?? biz.country,
        market_id: market.id,
      },
      { transaction: t }
    );
  }
  return biz;
}

export async function createSubmissionForBusiness(
  businessId,
  marketCode,
  businessDetails
) {
  const t = await sequelize.transaction();
  try {
    const market = await Market.findOne({
      where: { code: marketCode },
      transaction: t,
    });
    if (!market) {
      const err = new Error("Market not found");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }

    // const biz = await ensureBusinessProjection(
    //   businessId,
    //   market,
    //   businessDetails,
    //   t
    // );

    const existingDraft = await KycSubmission.findOne({
      where: {
        business_id: businessId, //biz.id
        market_id: market.id,
        // status: SubmissionStatuses.Draft,
      },
      transaction: t,
    });
    if (existingDraft) {
      // const from = existingDraft.status;
      // await existingDraft.update(
      //   {
      //     metadata: {
      //       ...(existingDraft.metadata || {}),
      //       business_details: businessDetails || {},
      //     },
      //   },
      //   { transaction: t }
      // );

      // await auditLog(
      //   {
      //     submission_id: existingDraft.id,
      //     business_id: businessId,
      //     actor_type: "business",
      //     actor_id: businessId,
      //     action: "submission.draft.update",
      //     from_status: from,
      //     to_status: existingDraft.status,
      //     payload: { business_details: businessDetails || {} },
      //   },
      //   t
      // );

      // await enqueueEvent(
      //   {
      //     aggregate_type: "submission",
      //     aggregate_id: existingDraft.id,
      //     event_type: "kyc.submission.updated",
      //     payload: { status: existingDraft.status },
      //   },
      //   t
      // );

      // await t.commit();
      return existingDraft;
    }

    const submission = await KycSubmission.create(
      {
        business_id: biz.id,
        market_id: market.id,
        status: SubmissionStatuses.Draft,
        metadata: { business_details: businessDetails || {} },
      },
      { transaction: t }
    );

    await auditLog(
      {
        submission_id: submission.id,
        business_id: biz.id,
        actor_type: "business",
        actor_id: businessId,
        action: "submission.created",
        from_status: null,
        to_status: SubmissionStatuses.Draft,
        payload: { market_code: market.code },
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "submission",
        aggregate_id: submission.id,
        event_type: "kyc.submission.created",
        payload: { status: submission.status, market_code: market.code },
      },
      t
    );

    await t.commit();
    return submission;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

export async function getSubmissionForBusiness(businessId, submissionId) {
  const submission = await KycSubmission.findByPk(submissionId, {
    include: [{ model: KycSubmissionStep }],
  });
  if (!submission) return null;
  // const biz = await Business.findOne({ where: { id: submission.business_id } });
  // if (!biz || biz.external_ref !== businessId) return null;
  return submission;
}

export async function listSubmissionsForBusiness(
  businessId,
  { status, limit, offset }
) {
  // const biz = await Business.findOne({ where: { external_ref: businessId } });
  // if (!biz) return { rows: [], count: 0 };
  // const where = { business_id: biz.id };
  const where = { business_id: businessId };
  if (status) where.status = status;
  const { rows, count } = await KycSubmission.findAndCountAll({
    where,
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });
  return { rows, count };
}

export async function updateSubmissionBusinessDetails(
  businessId,
  submissionId,
  businessDetails
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
    const biz = await Business.findByPk(submission.business_id, {
      transaction: t,
    });
    if (!biz || biz.external_ref !== businessId) {
      const err = new Error("Not found");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }
    if (!canEdit(submission)) {
      const err = new Error("Submission not editable");
      err.code = "INVALID_STATE";
      err.httpStatus = 409;
      throw err;
    }

    await biz.update(
      {
        legal_name: businessDetails?.legal_name ?? biz.legal_name,
        registration_number:
          businessDetails?.registration_number ?? biz.registration_number,
        country: businessDetails?.country ?? biz.country,
      },
      { transaction: t }
    );

    const from = submission.status;
    await submission.update(
      {
        metadata: {
          ...(submission.metadata || {}),
          business_details: businessDetails || {},
        },
      },
      { transaction: t }
    );

    await auditLog(
      {
        submission_id: submission.id,
        business_id: biz.id,
        actor_type: "business",
        actor_id: businessId,
        action: "submission.draft.update",
        from_status: from,
        to_status: submission.status,
        payload: { business_details: businessDetails || {} },
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "submission",
        aggregate_id: submission.id,
        event_type: "kyc.submission.updated",
        payload: { status: submission.status },
      },
      t
    );

    await t.commit();
    return submission;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

async function checkRequirementsCompleteness(submissionId, marketId, t) {
  const docTypes = await KycDocumentType.findAll({
    where: { market_id: marketId, active: true },
    transaction: t,
  });
  const docs = await KycSubmissionDocument.findAll({
    where: { submission_id: submissionId },
    transaction: t,
  });

  const counts = {};
  for (const d of docs)
    counts[d.document_type_id] = (counts[d.document_type_id] || 0) + 1;

  const missing = [];
  for (const dt of docTypes) {
    const c = counts[dt.id] || 0;
    if (dt.is_required && c < dt.min_count) {
      missing.push({ code: dt.code, required: dt.min_count, present: c });
    }
    if (c > dt.max_count) {
      missing.push({
        code: dt.code,
        error: "too_many",
        max: dt.max_count,
        present: c,
      });
    }
  }
  return { ok: missing.length === 0, missing };
}

export async function submitSubmission(businessId, submissionId) {
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
    // const biz = await Business.findByPk(submission.business_id, {
    //   transaction: t,
    // });
    // if (!biz || biz.external_ref !== businessId) {
    //   const err = new Error("Not found");
    //   err.code = "NOT_FOUND";
    //   err.httpStatus = 404;
    //   throw err;
    // }
    if (!canSubmit(submission)) {
      const err = new Error("Invalid state");
      err.code = "INVALID_STATE";
      err.httpStatus = 409;
      throw err;
    }

    // const bd = submission.metadata?.business_details || {};
    // if (!bd.legal_name || !bd.registration_number) {
    //   const err = new Error("Business details incomplete");
    //   err.code = "REQUIREMENTS_INCOMPLETE";
    //   err.httpStatus = 400;
    //   throw err;
    // }
    const submissionSteps = [
      "business_details",
      "identity_verification",
      "business_address",
      "additional_business_details",
      "business_documents",
    ];
    const completedSteps = submission.completed_steps;

    const missingSteps = submissionSteps.filter(
      (steps) => !completedSteps.includes(steps)
    );

    if (missingSteps.length) {
      const err = new Error("Required documents missing or invalid");
      err.code = "REQUIREMENTS_INCOMPLETE";
      err.httpStatus = 400;
      err.details = missingSteps;
      throw err;
    }

    // if (!reqCheck.ok) {
    //   const err = new Error("Required documents missing or invalid");
    //   err.code = "REQUIREMENTS_INCOMPLETE";
    //   err.httpStatus = 400;
    //   err.details = reqCheck.missing;
    //   throw err;
    // }

    // const reqCheck = await checkRequirementsCompleteness(
    //   submission.id,
    //   submission.market_id,
    //   t
    // );
    // if (!reqCheck.ok) {
    //   const err = new Error("Required documents missing or invalid");
    //   err.code = "REQUIREMENTS_INCOMPLETE";
    //   err.httpStatus = 400;
    //   err.details = reqCheck.missing;
    //   throw err;
    // }

    const from = submission.status;
    await submission.update(
      { status: SubmissionStatuses.Submitted },
      { transaction: t }
    );

    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: businessId,
        action: "submission.submitted",
        from_status: from,
        to_status: SubmissionStatuses.Submitted,
        payload: {},
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "submission",
        aggregate_id: submission.id,
        event_type: "kyc.submission.updated",
        payload: { status: SubmissionStatuses.Submitted },
      },
      t
    );

    await t.commit();
    return submission;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

// Admin triage: submitted -> under_review
export async function triageToUnderReview(adminId, submissionId) {
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
    if (!canTriage(submission)) {
      const err = new Error("Invalid state");
      err.code = "INVALID_STATE";
      err.httpStatus = 409;
      throw err;
    }

    const from = submission.status;
    await submission.update(
      { status: SubmissionStatuses.UnderReview },
      { transaction: t }
    );

    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "admin",
        actor_id: adminId,
        action: "submission.triage.under_review",
        from_status: from,
        to_status: SubmissionStatuses.UnderReview,
        payload: {},
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "submission",
        aggregate_id: submission.id,
        event_type: "kyc.submission.updated",
        payload: { status: SubmissionStatuses.UnderReview },
      },
      t
    );

    await t.commit();
    return submission;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

// Admin decision: under_review -> more_info_required | approved | rejected
export async function adminDecision(
  adminId,
  submissionId,
  { decision, notes }
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
    if (!canDecide(submission)) {
      const err = new Error("Invalid state");
      err.code = "INVALID_STATE";
      err.httpStatus = 409;
      throw err;
    }

    let to;
    if (decision === "more_info_required") to = SubmissionStatuses.MoreInfo;
    else if (decision === "approved") to = SubmissionStatuses.Approved;
    else if (decision === "rejected") to = SubmissionStatuses.Rejected;
    else {
      const err = new Error("Invalid decision");
      err.code = "VALIDATION_ERROR";
      err.httpStatus = 400;
      throw err;
    }

    const from = submission.status;
    await submission.update(
      {
        status: to,
        metadata: {
          ...(submission.metadata || {}),
          admin_notes: notes || null,
        },
      },
      { transaction: t }
    );

    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "admin",
        actor_id: adminId,
        action: `submission.decision.${decision}`,
        from_status: from,
        to_status: to,
        payload: { notes: notes || null },
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "submission",
        aggregate_id: submission.id,
        event_type: "kyc.submission.updated",
        payload: { status: to, decision },
      },
      t
    );

    await t.commit();
    return submission;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

// Document-level decision (approve/reject specific doc)
export async function adminDocumentDecision(
  adminId,
  documentId,
  { decision, reason }
) {
  const t = await sequelize.transaction();
  try {
    const doc = await KycSubmissionDocument.findByPk(documentId, {
      transaction: t,
    });
    if (!doc) {
      const err = new Error("Document not found");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }
    const submission = await KycSubmission.findByPk(doc.submission_id, {
      transaction: t,
    });
    if (!submission) {
      const err = new Error("Submission not found");
      err.code = "NOT_FOUND";
      err.httpStatus = 404;
      throw err;
    }
    if (!canDecide(submission)) {
      const err = new Error("Invalid state for document decision");
      err.code = "INVALID_STATE";
      err.httpStatus = 409;
      throw err;
    }

    let to;
    if (decision === "approve") to = "approved";
    else if (decision === "reject") to = "rejected";
    else {
      const err = new Error("Invalid decision");
      err.code = "VALIDATION_ERROR";
      err.httpStatus = 400;
      throw err;
    }

    const from = doc.status;
    await doc.update(
      {
        status: to,
        metadata: { ...(doc.metadata || {}), rejection_reason: reason || null },
      },
      { transaction: t }
    );

    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "admin",
        actor_id: adminId,
        action: `document.decision.${decision}`,
        from_status: from,
        to_status: to,
        payload: { document_id: doc.id, reason: reason || null },
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "document",
        aggregate_id: doc.id,
        event_type: "kyc.document.updated",
        payload: { status: to, submission_id: submission.id },
      },
      t
    );

    await t.commit();
    return doc;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

export async function adminListSubmissions({
  market_code,
  status,
  from,
  to,
  limit,
  offset,
}) {
  const where = {};
  if (status) where.status = status;

  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = new Date(from);
    if (to) where.created_at[Op.lte] = new Date(to);
  }

  if (market_code) {
    const m = await Market.findOne({ where: { code: market_code } });
    if (!m) return { rows: [], count: 0 };
    where.market_id = m.id;
  }

  const { rows, count } = await KycSubmission.findAndCountAll({
    where,
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });
  return { rows, count };
}
