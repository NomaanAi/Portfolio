import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    versionLabel: { type: String, required: true }, // e.g., "v1.0 - Full Stack"
    filePath: { type: String, required: true }, // Relative path to file
    isActive: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
});

// Ensure only one resume is active at a time (hook will be handled in controller service logic or pre-save if complex, but simple logic in controller is often enough for this scale)
// But to be safe, we can skip unique indexes on boolean since multiple false is allowed.

export default mongoose.model("Resume", resumeSchema);
