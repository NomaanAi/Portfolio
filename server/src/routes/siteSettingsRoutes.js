import express from "express";
import { getSettings, updateSettings } from "../controllers/siteSettingsController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSettings);
router.patch("/", protect, requireAdmin, updateSettings);

export default router;
