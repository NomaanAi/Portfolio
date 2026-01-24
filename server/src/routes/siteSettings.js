import express from "express";
import SiteSettings from "../models/SiteSettings.js";
// import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get Site Settings (Public)
// Get Site Settings (Public)
router.get("/", async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            // Seed default if not exists
            settings = await SiteSettings.create({});
        }
        res.status(200).json({
            status: 'success',
            data: {
                siteSettings: settings
            }
        });
    } catch (err) {
        console.error('Get SiteSettings Error:', err);
        res.status(500).json({ status: 'error', message: "Error fetching site settings" });
    }
});

// Update Site Settings (Admin)
// Update Site Settings (Admin)
router.put("/", async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.status(200).json({
            status: 'success',
            data: { siteSettings: settings }
        });
    } catch (err) {
        console.error('Update SiteSettings Error:', err);
        res.status(400).json({ status: 'error', message: "Error updating site settings" });
    }
});

export default router;
