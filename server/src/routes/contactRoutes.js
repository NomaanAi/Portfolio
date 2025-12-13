import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, message } = req.body;
    if (!email || !message)
        return res.status(400).json({ message: "Invalid data" });

    res.json({ message: "Message received" });
});

export default router;
