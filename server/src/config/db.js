import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️  MONGO_URI not set, database connection skipped.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
