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

    // STRICT PRODUCTION CHECK: Fail fast if embeddings or connection are broken.
    // The user requirement is 'If initialization fails: crash the server immediately'.
    // We do not want silent failures in production.
    try {
        return await client.getOrCreateCollection({
            name: "portfolio-rag"
        });
    } catch (error) {
        console.error("❌ CRITICAL RAG FAILURE: Could not initialize Chroma Collection.");
        console.error("Error details:", error);
        console.error("This usually means @chroma-core/default-embed is missing or incompatible.");

        // Force crash in production to avoid silent zombie state
        if (process.env.NODE_ENV === 'production') {
            console.error("💥 Crashing server to force attention to RAG dependency failure.");
            process.exit(1);
        }
        throw error;
    }
};

export const checkRAGHealth = async () => {
    try {
        const col = await getCollection();
        if (!col) return false;
        // Verify we can count (read access)
        await col.count();
        return true;
    } catch (e) {
        return false;
    }
};
