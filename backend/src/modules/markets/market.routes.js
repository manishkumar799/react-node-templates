import { Router } from "express";
import validate from "../../common/middleware/validate.js";
import { getRequirementsSchema } from "./market.validators.js";
import { getRequirements } from "./market.controller.js";

const router = Router();

// Business/public route
router.get(
  "/:marketCode/requirements",
  validate(getRequirementsSchema),
  getRequirements
);

export default router;
