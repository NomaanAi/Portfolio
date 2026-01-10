import { getCollection } from './chromaClient.js';

export const retrieveContext = async (query, nResults = 5) => {
    try {
        const collection = await getCollection();

        // Query using text directly (Chroma Cloud embeds it automatically)
        const results = await collection.query({
            queryTexts: [query],
            nResults: nResults
        });

        // Results structure: { ids, distances, metadatas, documents }
        if (!results.documents || results.documents.length === 0) {
            return [];
        }

        // Chroma returns an array of arrays (one per query)
        // We only queried for one string, so we return the first array of documents.
        return results.documents[0];
    } catch (error) {
        console.error("Retrieval error:", error);
        return [];
    }
};
