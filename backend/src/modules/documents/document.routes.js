import { Router } from "express";
import validate from "../../common/middleware/validate.js";
import { requireAuth } from "../../common/middleware/auth.js";
import rbac from "../../common/middleware/rbac.js";
import {
  uploadCallbackSchema,
  deleteDocSchema,
  uploadStepDocumentSchema,
  deleteStepDocumentSchema,
} from "./document.validators.js";
import {
  getSignedParams,
  uploadCallback,
  deleteDocument,
  uploadStepDoc,
  deleteStepDoc,
  uploadDocument,
} from "./document.controller.js";
import { upload } from "../../common/middleware/upload.js";

const router = Router();

// Business: get signed upload parameters (server-provided constraints)
router.get(
  "/signed-params",
  requireAuth(true),
  rbac("business"),
  getSignedParams
);

// Business: callback to save document metadata after Cloudinary upload completes
// router.post(
//   "/upload",
//   requireAuth(true),
//   rbac("business"),
//   validate(uploadCallbackSchema),
//   uploadCallback
// );
router.post(
  "/upload",
  requireAuth(true),
  rbac("business"),
  upload.single("file"),
  uploadDocument
);

// Business: delete a document in allowed states
router.delete(
  "/:documentId",
  requireAuth(true),
  rbac("business"),
  validate(deleteDocSchema),
  deleteDocument
);

router.post(
  "/upload-step",
  requireAuth(true),
  rbac("business"),
  validate(uploadStepDocumentSchema),
  uploadStepDoc
);

router.delete(
  "/step/:documentId",
  requireAuth(true),
  rbac("business"),
  validate(deleteStepDocumentSchema),
  deleteStepDoc
);

export default router;
