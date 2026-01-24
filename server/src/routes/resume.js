import express from "express";
import multer from "multer";
// import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Resume from "../models/Resume.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// GET active resume (Public)
router.get("/active", async (req, res) => {
  try {
    const activeResume = await Resume.findOne({ isActive: true });
    if (!activeResume) {
      return res.status(404).json({ message: "No active resume found" });
    }

    // Stream the file from Cloudinary to avoid CORS/Auth issues on frontend redirect
    if (activeResume.filePath.startsWith('http')) {
      const response = await fetch(activeResume.filePath);
      if (!response.ok) throw new Error("Failed to fetch from cloud storage");

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Resume_${activeResume.versionLabel}.pdf"`);

      // Node 18+ native fetch has .body as a web stream, but Express needs Node stream
      // We can iterate or use a utility. Or simpler: just use generic redirect if streaming is complex 
      // without extra deps. But streaming is better.
      // Let's use arrayBuffer and sending it (okay for PDF size). 
      // Or response.body (if node-fetch or native).

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.send(buffer);
    }

    res.status(404).json({ message: "Resume URL not found" });
  } catch (err) {
    console.error("Resume fetch error:", err);
    res.status(500).json({ message: "Error fetching active resume" });
  }
});


// GET all resumes (Admin)
// GET all resumes (Admin)
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resumes" });
  }
});

// Upload new resume (Admin)
router.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
      const { versionLabel } = req.body;

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, "resumes");

      // If this is the first resume, make it active by default
      const count = await Resume.countDocuments();
      const isActive = count === 0;

      const newResume = await Resume.create({
        versionLabel: versionLabel || `v${Date.now()}`,
        filePath: result.secure_url, // Store URL
        isActive
      });

      res.status(201).json(newResume);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving resume info" });
    }
  }
);

// Set active resume (Admin)
// Set active resume (Admin)
router.put("/:id/active", async (req, res) => {
  try {
    await Resume.updateMany({}, { isActive: false });
    const updated = await Resume.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error setting active resume" });
  }
});

export default router;
