import { Router } from "express";
import validate from "../../common/middleware/validate.js";
import { requireAuth } from "../../common/middleware/auth.js";
import rbac from "../../common/middleware/rbac.js";
import {
  createSubmissionSchema,
  getSubmissionSchema,
  listSubmissionsSchema,
  updateSubmissionSchema,
  submitActionSchema,
  adminListSchema,
  triageSchema,
  adminDecisionSchema,
  adminDocDecisionSchema,
} from "./submission.validators.js";
import {
  createSubmission,
  getSubmission,
  listSubmissions,
  updateSubmission,
  submit,
  adminList,
  triage,
  adminDecide,
  adminDocDecide,
} from "./submission.controller.js";
import {
  // ... existing imports
  saveStepDataSchema,
  getStepDataSchema,
  getSubmissionProgressSchema,
} from "./submissionStep.validators.js";

import {
  // ... existing imports
  saveStep,
  getStep,
  getProgress,
} from "./submissionStep.controller.js";

const router = Router();

// Business routes
router.post(
  "/submissions",
  requireAuth(true),
  rbac("business"),
  validate(createSubmissionSchema),
  createSubmission
);
router.get(
  "/submissions",
  requireAuth(true),
  rbac("business"),
  validate(listSubmissionsSchema),
  listSubmissions
);
router.get(
  "/submissions/:id",
  requireAuth(true),
  rbac("business"),
  validate(getSubmissionSchema),
  getSubmission
);
router.patch(
  "/submissions/:id",
  requireAuth(true),
  rbac("business"),
  validate(updateSubmissionSchema),
  updateSubmission
);
router.post(
  "/submissions/:id/submit",
  requireAuth(true),
  rbac("business"),
  validate(submitActionSchema),
  submit
);

router.post(
  "/submissions/:id/steps/:stepKey",
  requireAuth(true),
  rbac("business"),
  validate(saveStepDataSchema),
  saveStep
);

router.get(
  "/submissions/:id/steps/:stepKey",
  requireAuth(true),
  rbac("business"),
  validate(getStepDataSchema),
  getStep
);

router.get(
  "/submissions/:id/progress",
  requireAuth(true),
  rbac("business"),
  validate(getSubmissionProgressSchema),
  getProgress
);

// Admin routes
router.get(
  "/admin/submissions",
  requireAuth(true),
  rbac("admin"),
  validate(adminListSchema),
  adminList
);
router.post(
  "/admin/submissions/:id/triage",
  requireAuth(true),
  rbac("admin"),
  validate(triageSchema),
  triage
);
router.post(
  "/admin/submissions/:id/decision",
  requireAuth(true),
  rbac("admin"),
  validate(adminDecisionSchema),
  adminDecide
);
router.post(
  "/admin/documents/:documentId/decision",
  requireAuth(true),
  rbac("admin"),
  validate(adminDocDecisionSchema),
  adminDocDecide
);

export default router;
