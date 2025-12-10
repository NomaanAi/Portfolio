import express from "express";
import Project from "../models/Project.model.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Public: get published projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ status: "published" })
      .sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Public: get single published project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: "published" });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

// Admin: get all projects (drafts, archived, published)
router.get("/admin/all", authRequired(["admin"]), async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Admin: create project
router.post("/", authRequired(["admin"]), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: "Error creating project" });
  }
});

// Admin: update project
router.put("/:id", authRequired(["admin"]), async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating project" });
  }
});

// Admin: delete project
router.delete("/:id", authRequired(["admin"]), async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting project" });
  }
});

export default router;
