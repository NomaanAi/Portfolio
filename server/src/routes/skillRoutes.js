import express from "express";
import { getSkills, createSkill, updateSkill, deleteSkill, reorderSkills } from "../controllers/skillController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSkills);

// Admin Routes
router.use(protect);

router.post("/", createSkill);
router.put("/reorder", reorderSkills);
router.patch("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
