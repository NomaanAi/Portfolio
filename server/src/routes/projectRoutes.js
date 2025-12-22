import express from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProjects); // Public

// Admin Routes
router.post("/", protect, requireAdmin, createProject);
router.patch("/:id", protect, requireAdmin, updateProject);
router.delete("/:id", protect, requireAdmin, deleteProject);

export default router;
