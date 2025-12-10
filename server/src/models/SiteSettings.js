import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: "Welcome to my Portfolio" },
        subtitle: { type: String, default: "Full Stack Developer" },
    },
    about: {
        text: { type: String, default: "I am a passionate developer..." },
    },
    sections: {
        projects: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        resume: { type: Boolean, default: true },
    },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("SiteSettings", siteSettingsSchema);
