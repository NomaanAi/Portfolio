import express from "express";
import { getExperience, createExperience, updateExperience, deleteExperience } from "../controllers/experienceController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getExperience); // Public

// Admin Routes
router.post("/", protect, requireAdmin, createExperience);
router.patch("/:id", protect, requireAdmin, updateExperience);
router.delete("/:id", protect, requireAdmin, deleteExperience);

export default router;
