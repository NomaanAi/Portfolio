import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String }, // Short one-liner
  desc: { type: String, required: true },
  problem: { type: String },
  challenges: { type: String },
  solution: { type: String },
  architecture: { type: String },
  outcome: { type: String },
  learnings: { type: String }, // What broke / improvements
  stack: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ["Completed", "In Progress", "Building"], default: "Completed" },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
