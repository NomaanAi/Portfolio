import { CloudClient } from "chromadb";

let instance = null;

// Lazy getter to prevent crash at import time
export const getClient = () => {
    if (!instance) {
        if (!process.env.CHROMA_API_KEY) {
            console.error("❌ CHROMA_API_KEY is missing! RAG features will fail.");
        }

        instance = new CloudClient({
            apiKey: process.env.CHROMA_API_KEY,
            tenant: process.env.CHROMA_TENANT || 'default_tenant',
            database: process.env.CHROMA_DATABASE || 'default_database'
        });
    }
    return instance;
};

export const getCollection = async () => {
    const client = getClient();
    return await client.getOrCreateCollection({
        name: "portfolio-rag"
    });
};
