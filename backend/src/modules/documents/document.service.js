import { sequelize } from "../../common/dal/index.js";
import { KycSubmission } from "../submissions/submission.model.js";
import { KycSubmissionDocument } from "../submissions/submissionDocument.model.js";
import { getStepConfiguration } from "../forms/form.service.js";
import { auditLog } from "../audit/audit.service.js";
import { enqueueEvent } from "../events/outbox.helper.js";
import { deleteByPublicId } from "./cloudinary.service.js";

export async function uploadStepDocument(businessId, uploadData) {
  const t = await sequelize.transaction();
  try {
    const {
      submission_id,
      step_key,
      field_key,
      cloudinary_public_id,
      cloudinary_secure_url,
      filename,
      mime_type,
      size_bytes,
    } = uploadData;

    const submission = await KycSubmission.findByPk(submission_id, {
      transaction: t,
    });
    if (!submission) {
      const err = new Error("Submission not found");
      err.httpStatus = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    // Verify step and field configuration
    const step = await getStepConfiguration(submission.market_id, step_key);
    if (!step) {
      const err = new Error("Invalid step");
      err.httpStatus = 400;
      err.code = "INVALID_STEP";
      throw err;
    }

    const field = step.kyc_form_fields.find((f) => f.field_key === field_key);
    if (!field || field.field_type !== "file_upload") {
      const err = new Error("Invalid document field");
      err.httpStatus = 400;
      err.code = "INVALID_FIELD";
      throw err;
    }

    // Validate file type and size
    const allowedTypes = field.field_options?.allowed_types || [];
    if (allowedTypes.length > 0 && !allowedTypes.includes(mime_type)) {
      const err = new Error("File type not allowed");
      err.httpStatus = 400;
      err.code = "INVALID_FILE_TYPE";
      throw err;
    }

    const maxSizeMb = field.field_options?.max_size_mb || 10;
    if (size_bytes > maxSizeMb * 1024 * 1024) {
      const err = new Error("File too large");
      err.httpStatus = 400;
      err.code = "FILE_TOO_LARGE";
      throw err;
    }

    // Create document record
    const created = await KycSubmissionDocument.create(
      {
        submission_id,
        step_key,
        field_key,
        cloudinary_public_id,
        cloudinary_secure_url,
        filename,
        mime_type,
        size_bytes,
        status: "uploaded",
        metadata: { step_key, field_key, field_label: field.field_label },
      },
      { transaction: t }
    );

    // Audit log
    await auditLog(
      {
        submission_id,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: businessId,
        action: "document.uploaded",
        payload: {
          step_key,
          field_key,
          document_id: created.id,
          filename,
        },
      },
      t
    );

    // Event
    await enqueueEvent(
      {
        aggregate_type: "document",
        aggregate_id: created.id,
        event_type: "kyc.document.uploaded",
        payload: { submission_id, step_key, field_key },
      },
      t
    );

    await t.commit();
    return created;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

export async function deleteStepDocument(businessId, documentId) {
  const t = await sequelize.transaction();
  try {
    const doc = await KycSubmissionDocument.findByPk(documentId, {
      transaction: t,
    });
    if (!doc) {
      const err = new Error("Document not found");
      err.httpStatus = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    const submission = await KycSubmission.findByPk(doc.submission_id, {
      transaction: t,
    });
    if (!submission) {
      const err = new Error("Submission not found");
      err.httpStatus = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    // Verify ownership and editability
    if (!["draft", "more_info_required"].includes(submission.status)) {
      const err = new Error(
        "Cannot delete document in current submission status"
      );
      err.httpStatus = 409;
      err.code = "INVALID_STATE";
      throw err;
    }

    // Delete from Cloudinary
    if (doc.cloudinary_public_id) {
      await deleteByPublicId(doc.cloudinary_public_id);
    }

    const docId = doc.id;
    await doc.destroy({ transaction: t });

    // Audit log
    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: businessId,
        action: "document.deleted",
        payload: {
          document_id: docId,
          step_key: doc.step_key,
          field_key: doc.field_key,
        },
      },
      t
    );

    // Event
    await enqueueEvent(
      {
        aggregate_type: "document",
        aggregate_id: docId,
        event_type: "kyc.document.deleted",
        payload: {
          submission_id: submission.id,
          step_key: doc.step_key,
          field_key: doc.field_key,
        },
      },
      t
    );

    await t.commit();
    return { success: true };
  } catch (e) {
    await t.rollback();
    throw e;
  }
}
