import {
  createSubmissionForBusiness,
  getSubmissionForBusiness,
  listSubmissionsForBusiness,
  updateSubmissionBusinessDetails,
  submitSubmission,
  adminListSubmissions,
  triageToUnderReview,
  adminDecision,
  adminDocumentDecision,
} from "./submission.service.js";

export async function createSubmission(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub; // token mapping
    if (!businessId)
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });

    const { market_code, business_details } = req.body;
    const submission = await createSubmissionForBusiness(
      businessId,
      market_code,
      business_details
    );
    return res.status(201).json(submission);
  } catch (e) {
    return next(e);
  }
}

export async function getSubmission(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId)
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });

    const s = await getSubmissionForBusiness(businessId, req.params.id);
    if (!s)
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Submission not found" },
      });
    return res.json(s);
  } catch (e) {
    return next(e);
  }
}

export async function listSubmissions(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId)
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });

    const { status, limit, offset } = req.query;
    const { rows, count } = await listSubmissionsForBusiness(businessId, {
      status,
      limit: Number(limit),
      offset: Number(offset),
    });
    return res.json({ data: rows, count });
  } catch (e) {
    return next(e);
  }
}

export async function updateSubmission(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId)
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });

    const submission = await updateSubmissionBusinessDetails(
      businessId,
      req.params.id,
      req.body.business_details
    );
    return res.json(submission);
  } catch (e) {
    return next(e);
  }
}

export async function submit(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId)
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });

    const submission = await submitSubmission(businessId, req.params.id);
    return res.json(submission);
  } catch (e) {
    return next(e);
  }
}

// Admin

export async function adminList(req, res, next) {
  try {
    const { market_code, status, from, to, limit, offset } = req.query;
    const { rows, count } = await adminListSubmissions({
      market_code,
      status,
      from,
      to,
      limit: Number(limit),
      offset: Number(offset),
    });
    return res.json({ data: rows, count });
  } catch (e) {
    return next(e);
  }
}
export async function triage(req, res, next) {
  try {
    const adminId = req.user?.sub || req.user?.id || "admin";
    const submission = await triageToUnderReview(adminId, req.params.id);
    return res.json(submission);
  } catch (e) {
    return next(e);
  }
}

export async function adminDecide(req, res, next) {
  try {
    const adminId = req.user?.sub || req.user?.id || "admin";
    const submission = await adminDecision(adminId, req.params.id, req.body);
    return res.json(submission);
  } catch (e) {
    return next(e);
  }
}

export async function adminDocDecide(req, res, next) {
  try {
    const adminId = req.user?.sub || req.user?.id || "admin";
    const doc = await adminDocumentDecision(
      adminId,
      req.params.documentId,
      req.body
    );
    return res.json(doc);
  } catch (e) {
    return next(e);
  }
}
