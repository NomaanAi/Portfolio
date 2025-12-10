import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authRequired } from "../middleware/auth.js";
import Resume from "../models/Resume.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "uploads", "resume");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

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
    const resumePath = path.join(uploadDir, activeResume.filePath);
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ message: "Resume file not found on server" });
    }
    res.download(resumePath);
  } catch (err) {
    res.status(500).json({ message: "Error fetching active resume" });
  }
});


// GET all resumes (Admin)
router.get("/", authRequired(["admin"]), async (req, res) => {
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
  authRequired(["admin"]),
  upload.single("resume"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
      const { versionLabel } = req.body;
      // If this is the first resume, make it active by default
      const count = await Resume.countDocuments();
      const isActive = count === 0;

      const newResume = await Resume.create({
        versionLabel: versionLabel || `v${Date.now()}`,
        filePath: req.file.filename,
        isActive
      });

      res.status(201).json(newResume);
    } catch (err) {
      res.status(500).json({ message: "Error saving resume info" });
    }
  }
);

// Set active resume (Admin)
router.put("/:id/active", authRequired(["admin"]), async (req, res) => {
  try {
    await Resume.updateMany({}, { isActive: false });
    const updated = await Resume.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error setting active resume" });
  }
});

export default router;
