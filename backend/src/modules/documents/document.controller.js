import { Op, sequelize } from "../../common/dal/index.js";
import { auditLog } from "../audit/audit.service.js";
import { enqueueEvent } from "../events/outbox.helper.js";
import { KycDocumentType } from "../markets/documentType.model.js";
import { KycSubmission } from "../submissions/submission.model.js";
import { KycSubmissionDocument } from "../submissions/submissionDocument.model.js";
import {
  getSignedUploadParams,
  deleteByPublicId,
} from "./cloudinary.service.js";
import { uploadToCloudinary } from "./../../common/utils/uploadToCloudinary.js";

import { uploadStepDocument, deleteStepDocument } from "./document.service.js";

export async function uploadDocument(req, res, next) {
  const t = await sequelize.transaction();
  try {
    // Check if file was uploaded
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.httpStatus = 400;
      err.code = "MISSING_FILE";
      throw err;
    }

    const { submission_id, document_type, step_key, field_key } = req.body;

    // Validate submission exists
    const submission = await KycSubmission.findByPk(submission_id, {
      transaction: t,
    });
    if (!submission) {
      const err = new Error("Submission not found");
      err.httpStatus = 404;
      err.code = "NOT_FOUND";
      throw err;
    }

    // Check if submission allows document upload
    if (!["draft", "more_info_required"].includes(submission.status)) {
      const err = new Error(
        "Cannot upload document in current submission status"
      );
      err.httpStatus = 409;
      err.code = "INVALID_STATE";
      throw err;
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer || req.file.path,
      {
        folder: `kyc/${submission_id}`,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      }
    );

    // Save metadata to database
    const documentRecord = await KycSubmissionDocument.create(
      {
        submission_id,
        step_key: step_key || null,
        field_key: field_key || null,
        document_type,
        cloudinary_public_id: uploadResult.public_id,
        cloudinary_secure_url: uploadResult.secure_url,
        filename: req.file.originalname,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
        status: "uploaded",
        metadata: {
          width: uploadResult.width || null,
          height: uploadResult.height || null,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type,
          created_at: uploadResult.created_at,
          bytes: uploadResult.bytes,
        },
      },
      { transaction: t }
    );

    // Audit log
    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: req.user?.business_id || req.user?.sub || "business",
        action: "document.uploaded",
        from_status: null,
        to_status: null,
        payload: {
          document_id: documentRecord.id,
          step_key,
          field_key,
          filename: req.file.originalname,
          mime_type: req.file.mimetype,
          size_bytes: req.file.size,
        },
      },
      t
    );

    // Enqueue event
    await enqueueEvent(
      {
        aggregate_type: "document",
        aggregate_id: documentRecord.id,
        event_type: "kyc.document.uploaded",
        payload: {
          submission_id: submission.id,
          step_key,
          field_key,
          cloudinary_public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        },
      },
      t
    );

    // Clean up temporary file if using disk storage
    if (req.file.path) {
      const fs = await import("fs");
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("File cleanup error:", cleanupError);
      }
    }

    await t.commit();

    return res.status(201).json({
      id: documentRecord.id,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      filename: documentRecord.filename,
      size_bytes: documentRecord.size_bytes,
      mime_type: documentRecord.mime_type,
      status: documentRecord.status,
    });
  } catch (error) {
    await t.rollback();

    // If Cloudinary upload succeeded but DB failed, clean up Cloudinary too
    if (error.cloudinary_public_id) {
      try {
        await deleteByPublicId(error.cloudinary_public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary cleanup error:", cloudinaryError);
      }
    }

    return next(error);
  }
}

export async function getSignedParams(req, res, next) {
  try {
    const { folder } = req.query;
    const params = getSignedUploadParams(folder);
    return res.json(params);
  } catch (e) {
    return next(e);
  }
}

export async function uploadStepDoc(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });
    }

    const document = await uploadStepDocument(businessId, req.body);
    return res.status(201).json(document);
  } catch (e) {
    return next(e);
  }
}

export async function deleteStepDoc(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });
    }

    const { documentId } = req.params;
    const result = await deleteStepDocument(businessId, documentId);
    return res.status(204).json(result);
  } catch (e) {
    return next(e);
  }
}

export async function uploadCallback(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const {
      submission_id,
      document_type_code,
      cloudinary_public_id,
      cloudinary_secure_url,
      filename,
      mime_type,
      size_bytes,
    } = req.body;

    const submission = await KycSubmission.findByPk(submission_id, {
      transaction: t,
    });
    if (!submission) {
      const err = new Error("Submission not found");
      err.httpStatus = 404;
      err.code = "NOT_FOUND";
      throw err;
    }
    if (
      !["draft", "more_info_required", "submitted"].includes(submission.status)
    ) {
      const err = new Error("Submission not editable for uploads");
      err.httpStatus = 409;
      err.code = "INVALID_STATE";
      throw err;
    }

    const docType = await KycDocumentType.findOne({
      where: {
        market_id: submission.market_id,
        code: document_type_code,
        active: true,
      },
      transaction: t,
    });
    if (!docType) {
      const err = new Error("Document type not allowed for this market");
      err.httpStatus = 400;
      err.code = "DOC_TYPE_INVALID";
      throw err;
    }

    const created = await KycSubmissionDocument.create(
      {
        submission_id,
        document_type_id: docType.id,
        cloudinary_public_id,
        cloudinary_secure_url,
        filename,
        mime_type,
        size_bytes,
        status: "uploaded",
        metadata: {},
      },
      { transaction: t }
    );
    await auditLog(
      {
        submission_id,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: req.user?.business_id || req.user?.sub || "business",
        action: "document.uploaded",
        from_status: null,
        to_status: "uploaded",
        payload: {
          document_id: created.id,
          document_type_code: document_type_code,
        },
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "document",
        aggregate_id: created.id,
        event_type: "kyc.document.uploaded",
        payload: { submission_id, document_type_code },
      },
      t
    );
    await t.commit();
    return res.status(201).json(created);
  } catch (e) {
    await t.rollback();
    return next(e);
  }
}

export async function deleteDocument(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { documentId } = req.params;
    const doc = await KycSubmissionDocument.findByPk(documentId, {
      transaction: t,
    });
    if (!doc)
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Document not found" } });

    const submission = await KycSubmission.findByPk(doc.submission_id, {
      transaction: t,
    });
    if (!submission)
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Submission not found" },
      });

    if (!["draft", "more_info_required"].includes(submission.status)) {
      const err = new Error(
        "Cannot delete document in current submission status"
      );
      err.httpStatus = 409;
      err.code = "INVALID_STATE";
      throw err;
    }

    // Delete from Cloudinary
    await deleteByPublicId(doc.cloudinary_public_id);

    await doc.destroy({ transaction: t });
    const docId = doc.id;
    await auditLog(
      {
        submission_id: submission.id,
        business_id: submission.business_id,
        actor_type: "business",
        actor_id: req.user?.business_id || req.user?.sub || "business",
        action: "document.deleted",
        from_status: null,
        to_status: null,
        payload: { document_id: docId },
      },
      t
    );

    await enqueueEvent(
      {
        aggregate_type: "document",
        aggregate_id: docId,
        event_type: "kyc.document.deleted",
        payload: { submission_id: submission.id },
      },
      t
    );
    await t.commit();
    return res.status(204).send();
  } catch (e) {
    await t.rollback();
    return next(e);
  }
}
