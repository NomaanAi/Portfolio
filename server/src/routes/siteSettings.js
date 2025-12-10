import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// Get Site Settings (Public)
router.get("/", async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            // Seed default if not exists
            settings = await SiteSettings.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching site settings" });
    }
});

// Update Site Settings (Admin)
router.put("/", authRequired(["admin"]), async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(400).json({ message: "Error updating site settings" });
    }
});

export default router;
