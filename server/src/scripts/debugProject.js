import { connectDB } from "../config/db.js";
import Project from "../models/Project.model.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function debugProject() {
    try {
        await connectDB();
        const project = await Project.findOne();
        console.log("Found project:");
        console.log(JSON.stringify(project, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugProject();
