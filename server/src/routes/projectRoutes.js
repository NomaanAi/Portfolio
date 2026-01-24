import express from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProjects); // Public

// Admin Routes
router.use(protect);

router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
