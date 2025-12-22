import express from "express";
import { getSkills, createSkill, updateSkill, deleteSkill, reorderSkills } from "../controllers/skillController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSkills);

// Admin Routes
router.post("/", protect, requireAdmin, createSkill);
router.put("/reorder", protect, requireAdmin, reorderSkills); // Reorder before :id to avoid conflict
router.patch("/:id", protect, requireAdmin, updateSkill);
router.delete("/:id", protect, requireAdmin, deleteSkill);

export default router;
