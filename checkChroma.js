import { getCollection } from "./server/src/rag/chromaClient.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "server/.env") });

async function check() {
    try {
        const collection = await getCollection();
        const count = await collection.count();
        console.log(`Current items in Chroma: ${count}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
