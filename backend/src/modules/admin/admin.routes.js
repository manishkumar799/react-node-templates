import { Router } from "express";
import validate from "../../common/middleware/validate.js";
import { requireAuth } from "../../common/middleware/auth.js";
import rbac from "../../common/middleware/rbac.js";
import {
  createMarketSchema,
  upsertDocTypeSchema,
} from "../markets/market.validators.js";
import {
  adminCreateMarket,
  adminListMarkets,
  adminListDocTypes,
  adminUpsertDocType,
} from "../markets/market.controller.js";

const router = Router();

// router.use(requireAuth(true), rbac("admin"));

router.get("/markets", adminListMarkets);
router.post("/markets", validate(createMarketSchema), adminCreateMarket);

router.get("/markets/:marketId/document-types", adminListDocTypes);
router.post(
  "/markets/:marketId/document-types",
  validate(upsertDocTypeSchema),
  adminUpsertDocType
);

export default router;
