import express from "express";

const router = express.Router();

import Contact from "../models/Contact.js";

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!email || !message) {
            return res.status(400).json({ status: "fail", message: "Email and message are required." });
        }

        const newContact = await Contact.create({
            name,
            email,
            subject: subject || "General Inquiry",
            message
        });

        res.status(201).json({
            status: "success",
            message: "Inquiry received successfully.",
            data: {
                id: newContact._id
            }
        });
    } catch (error) {
        console.error("Contact Error:", error);
        res.status(500).json({ status: "error", message: "Failed to process inquiry." });
    }
});

export default router;
