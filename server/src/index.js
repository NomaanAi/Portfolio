import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import projectsRouter from "./routes/projects.js";
import resumeRouter from "./routes/resume.js";
import contactRouter from "./routes/contact.js";
import skillsRouter from "./routes/skills.js";
import siteSettingsRouter from "./routes/siteSettings.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Connect to MongoDB
connectDB();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Static for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));



app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio Admin API" });
});

app.get("/api/health", (req, res) => {
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: dbStatus === "connected" ? "ok" : "error",
    db: dbStatus
  });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/contact", contactRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/site-settings", siteSettingsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
