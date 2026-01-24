import { connectDB } from "../config/db.js";
import Project from "../models/Project.model.js";
import Skill from "../models/Skill.js";
import SiteSettings from "../models/SiteSettings.js";
import { getCollection } from "../rag/chromaClient.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root (one level up from scripts)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const syncRAG = async () => {
    try {
        console.log("Starting RAG sync...");
        await connectDB();
        console.log("✅ Connected to MongoDB.");

        const collection = await getCollection();
        console.log("✅ Connected to Chroma Cloud.");

        // Clear existing data
        const count = await collection.count();
        if (count > 0) {
            console.log(`Deleting ${count} old items from Chroma...`);
            const all = await collection.get();
            if (all.ids.length > 0) {
                await collection.delete({ ids: all.ids });
                console.log("✅ Old items deleted.");
            }
        }

        const ids = [];
        const documents = [];
        const metadatas = [];

        // 1. Projects
        const projects = await Project.find();
        console.log(`Processing ${projects.length} projects...`);
        projects.forEach((p, i) => {
            const doc = `Project Title: ${p.title}
Problem: ${p.problem || 'N/A'}
Constraints: ${p.challenges || 'N/A'}
Decisions: ${p.architecture || p.solution || 'N/A'}
Outcomes: ${p.outcome || 'N/A'}
Learnings/Improvements: ${p.learnings || 'N/A'}`;

            ids.push(`project_${p._id}`);
            documents.push(doc);
            metadatas.push({ type: "project", title: p.title });
        });

        // 2. Skills
        const skills = await Skill.find();
        console.log(`Processing ${skills.length} skills...`);
        skills.forEach((s, i) => {
            const doc = `Skill Name: ${s.name}
Category: ${s.category}
Description: ${s.description || 'N/A'}`;

            ids.push(`skill_${s._id}`);
            documents.push(doc);
            metadatas.push({ type: "skill", title: s.name });
        });

        // 3. About / Site Settings
        const settings = await SiteSettings.findOne();
        if (settings && settings.about) {
            console.log("Processing About content...");
            const doc = `About Content: ${settings.about.text}
Operating Principles: ${settings.about.principles.map(p => `${p.p}: ${p.d}`).join(", ")}`;

            ids.push("site_settings_about");
            documents.push(doc);
            metadatas.push({ type: "about" });
        }

        if (ids.length > 0) {
            console.log(`🚀 Starting ingestion of ${ids.length} documents into Chroma Cloud...`);
            for (let i = 0; i < ids.length; i++) {
                try {
                    process.stdout.write(`  [${i + 1}/${ids.length}] Ingesting ${ids[i]}... `);
                    await collection.add({
                        ids: [ids[i]],
                        documents: [documents[i]],
                        metadatas: [metadatas[i]]
                    });
                    console.log("✅");
                } catch (err) {
                    console.log("❌");
                    console.error(`    Error ingesting ${ids[i]}:`, err.message);
                }
            }
            console.log("🏁 Sync complete!");
        } else {
            console.log("No data found to sync.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Sync failed:");
        console.error(error);
        process.exit(1);
    }
};

syncRAG();
