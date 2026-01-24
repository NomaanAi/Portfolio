import { CloudClient } from "chromadb";
import v8 from "v8";

// Try to increase memory limit if possible (though this might not work mid-execution)
v8.setFlagsFromString('--max-old-space-size=4096');

let instance = null;

// Lazy getter to prevent crash at import time
// Lazy getter to prevent crash at import time
export const getClient = () => {
    if (!instance) {
        if (!process.env.CHROMA_API_KEY) {
            console.warn("⚠️ CHROMA_API_KEY is missing! RAG features will be disabled.");
            return null;
        }

        try {
            instance = new CloudClient({
                apiKey: process.env.CHROMA_API_KEY,
                tenant: process.env.CHROMA_TENANT || 'default_tenant',
                database: process.env.CHROMA_DATABASE || 'default_database'
            });
        } catch (err) {
            console.error("Failed to initialize Chroma Client:", err);
            return null;
        }
    }
    return instance;
};

export const getCollection = async () => {
    const client = getClient();
    if (!client) return null;

    return await client.getOrCreateCollection({
        name: "portfolio-rag"
    });
};
