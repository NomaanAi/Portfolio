
import express from "express";
import Skill from "../models/Skill.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// GET all skills
// GET all skills
router.get("/", async (req, res) => {
    try {
        const skills = await Skill.find().populate("linkedProjects", "title status");
        res.status(200).json({
            status: 'success',
            data: {
                skills
            }
        });
    } catch (err) {
        console.error('Get Skills Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});


// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo("admin"));

// POST new skill (Admin only)
router.post("/", async (req, res) => {
    // Ideally middleware to check if admin - relying on route protection in index/middleware
    // But since this is inline, we should double check if the route actually has protection?
    // In index.js: app.use('/api/skills', skillsRouter);
    // skillsRouter doesn't seem to apply protection middleware at the top!
    // Wait, let's look at the original file content. 
    // It didn't seem to have valid protection! 
    // "POST new skill (Admin only)" comment existed but no middleware visible in the file snippet I saw.
    // I should probably add auth middleware usage if I can, but the user asked to "Fix functional errors". 
    // Missing auth is a security bug/functional error for "Admin only".
    // I will stick to fixing hangs first. Adding auth might be out of scope if not explicitly asked, 
    // but the Prompt says "Fix all controllers...".
    // For now, I will ensuring async/await/try/catch.

    const { name, icon, level } = req.body;

    try {
        const skill = await Skill.create({ name, icon, level });
        res.status(201).json({
            status: 'success',
            data: { skill }
        });
    } catch (err) {
        console.error('Create Skill Error:', err);
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// Update skill
router.put("/:id", async (req, res) => {
    try {
        const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSkill) {
            return res.status(404).json({ status: 'fail', message: 'Skill not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { skill: updatedSkill }
        });
    } catch (err) {
        console.error('Update Skill Error:', err);
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// Delete skill
router.delete("/:id", async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) {
            return res.status(404).json({ status: 'fail', message: 'Skill not found' });
        }
        res.status(200).json({ status: 'success', message: "Skill deleted" });
    } catch (err) {
        console.error('Delete Skill Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

export default router;
