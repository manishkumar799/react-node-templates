import {
  saveStepData,
  getStepData,
  getSubmissionProgress,
} from "./submissionStep.service.js";

export async function saveStep(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });
    }

    const { id: submissionId, stepKey } = req.params;
    const { form_data } = req.body;

    const result = await saveStepData(
      businessId,
      submissionId,
      stepKey,
      form_data
    );
    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

export async function getStep(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });
    }

    const { id: submissionId, stepKey } = req.params;
    const stepData = await getStepData(businessId, submissionId, stepKey);

    if (!stepData) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Submission not found" },
      });
    }

    return res.json(stepData);
  } catch (e) {
    return next(e);
  }
}

export async function getProgress(req, res, next) {
  try {
    const businessId = req.user?.business_id || req.user?.sub;
    if (!businessId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Business identity required" },
      });
    }

    const { id: submissionId } = req.params;
    const progress = await getSubmissionProgress(businessId, submissionId);

    if (!progress) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Submission not found" },
      });
    }

    return res.json(progress);
  } catch (e) {
    return next(e);
  }
}
