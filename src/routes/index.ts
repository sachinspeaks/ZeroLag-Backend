import { Router } from "express";
import { healthCheck } from "../controllers/healthController.js";
import { AppLinkController } from "../controllers/appLink.js";
import { ValidateLinkController } from "../controllers/validateLink.js";
import { ProLinkController } from "../controllers/proLink.js";

const router = Router();

router.get("/", healthCheck);
router.get("/user-link", AppLinkController);
router.post("/validate-link", ValidateLinkController);
router.get("/pro-link", ProLinkController);

export default router;
