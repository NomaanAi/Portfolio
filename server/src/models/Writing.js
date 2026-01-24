import mongoose from "mongoose";

const writingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Writing", writingSchema);
