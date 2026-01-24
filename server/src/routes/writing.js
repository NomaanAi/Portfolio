import express from "express";
import Writing from "../models/Writing.js";
// import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: get published writings
router.get("/", async (req, res) => {
    try {
        const writings = await Writing.find({ published: true })
            .sort({ createdAt: -1 });
        res.json(writings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching writings" });
    }
});

// Public: get single published writing by SLUG
router.get("/:slug", async (req, res) => {
    try {
        const writing = await Writing.findOne({ slug: req.params.slug, published: true });
        if (!writing) return res.status(404).json({ message: "Writing not found" });
        res.json(writing);
    } catch (err) {
        res.status(500).json({ message: "Error fetching writing" });
    }
});

// Admin: get all basic list (drafts included)
// Admin: get all basic list (drafts included)
router.get("/admin/all", async (req, res) => {
    try {
        const writings = await Writing.find().sort({ createdAt: -1 });
        res.json(writings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching writings" });
    }
});

// Admin: create
// Admin: create
router.post("/", async (req, res) => {
    try {
        const writing = await Writing.create(req.body);
        res.status(201).json(writing);
    } catch (err) {
        res.status(400).json({ message: "Error creating writing", error: err.message });
    }
});

// Admin: update
// Admin: update
router.put("/:id", async (req, res) => {
    try {
        const updated = await Writing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "Error updating writing" });
    }
});

// Admin: delete
// Admin: delete
router.delete("/:id", async (req, res) => {
    try {
        await Writing.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting writing" });
    }
});

export default router;
