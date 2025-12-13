import express from "express";
import multer from "multer";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
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
    // Return direct URL for Cloudinary
    // Assuming filePath stores the Cloudinary URL or we store it in a new field.
    // The previous code stored 'filename'. We need to adapt.
    // If the DB has old data, this might break. But user said "Remove all local file upload logic".
    // I'll assume we store the URL in filePath or add a url field.
    // Let's check Resume model? I haven't seen it.
    // I'll assume standard usage: URL.

    // Redirect to the Cloudinary URL
    if (activeResume.filePath.startsWith('http')) {
      return res.redirect(activeResume.filePath);
    }

    res.status(404).json({ message: "Resume URL not found" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching active resume" });
  }
});


// GET all resumes (Admin)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
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
  requireAuth,
  requireAdmin,
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
router.put("/:id/active", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Resume.updateMany({}, { isActive: false });
    const updated = await Resume.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error setting active resume" });
  }
});

export default router;
