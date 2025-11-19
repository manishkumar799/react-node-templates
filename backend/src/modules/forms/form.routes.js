import { Router } from "express";
import validate from "../../common/middleware/validate.js";
import { getKycFormConfigSchema } from "./form.validators.js";
import { getKycFormConfig } from "./form.controller.js";

const router = Router();

// Public route to get form configuration
router.get(
  "/:marketCode/kyc-form-config",
  validate(getKycFormConfigSchema),
  getKycFormConfig
);

export default router;
