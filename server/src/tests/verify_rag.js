import { checkRAGHealth } from '../rag/chromaClient.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verify() {
    console.log("🔍 Verifying RAG Health locally...");
    const isHealthy = await checkRAGHealth();
    if (isHealthy) {
        console.log("✅ RAG is HEALTHY. Embeddings are operational.");
        process.exit(0);
    } else {
        console.error("❌ RAG is UNHEALTHY. Check logs or dependencies.");
        process.exit(1);
    }
}

verify();
