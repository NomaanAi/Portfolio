
import express from "express";
import Skill from "../models/Skill.js";

const router = express.Router();

// GET all skills
router.get("/", async (req, res) => {
    try {
        const skills = await Skill.find().populate("linkedProjects", "title status");
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new skill (Admin only)
router.post("/", async (req, res) => {
    // Ideally middleware to check if admin
    const { name, icon, level } = req.body;
    const skill = new Skill({ name, icon, level });

    try {
        const newSkill = await skill.save();
        res.status(201).json(newSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update skill
router.put("/:id", async (req, res) => {
    try {
        const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSkill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete skill
router.delete("/:id", async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: "Skill deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
