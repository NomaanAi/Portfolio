
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },

  // Case Study Fields
  problemStatement: { type: String },
  whyThisProject: { type: String },
  solutionOverview: { type: String },
  systemDesign: { type: String },
  architectureDiagramUrl: { type: String },
  techDecisions: { type: String }, // Storing as rich text/markdown string
  workflow: { type: String },
  challenges: { type: String },
  outcomes: { type: String },
  futureImprovements: { type: String },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Project", projectSchema);
