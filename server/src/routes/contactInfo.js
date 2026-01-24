import express from "express";
import Contact from "../models/Contact.js";
// import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: get contact info (assumes only one doc or returns all)
router.get("/", async (req, res) => {
    try {
        // Return the first contact doc found, effectively singleton
        const contact = await Contact.findOne();
        // If no data, return empty object or null, don't 404
        res.json(contact || null);
    } catch (err) {
        res.status(500).json({ message: "Error fetching contact info" });
    }
});

// Admin: create or update (upsert-like behavior)
// Admin: create or update (upsert-like behavior)
router.post("/", async (req, res) => {
    try {
        // Check if one exists
        const existing = await Contact.findOne();
        if (existing) {
            // Update existing
            const updated = await Contact.findByIdAndUpdate(existing._id, req.body, { new: true });
            return res.json(updated);
        }
        // Create new
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ message: "Error creating contact info", error: err.message });
    }
});

// Admin: update specific ID
// Admin: update specific ID
router.put("/:id", async (req, res) => {
    try {
        const updated = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "Error updating contact info" });
    }
});

export default router;
