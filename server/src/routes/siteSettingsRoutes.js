import express from "express";
import { getSettings, updateSettings } from "../controllers/siteSettingsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSettings);

// Admin Routes
router.use(protect);
router.patch("/", updateSettings);

export default router;
