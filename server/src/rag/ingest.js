import fs from 'fs';
import path from 'path';
import { getCollection } from './chromaClient.js';

const isDev = process.env.NODE_ENV === 'development';

export const ingestData = async () => {
    try {
        if (isDev) console.log("Starting RAG Ingestion (Chroma Cloud)...");

        const dataPath = path.resolve(process.cwd(), 'data/nomaan_dataset.json');
        if (!fs.existsSync(dataPath)) {
            if (isDev) console.warn(`Dataset not found at ${dataPath}. Skipping ingestion.`);
            return;
        }

        const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const collection = await getCollection();

        // Naive check: If collection has items, skip (to avoid duplicates)
        // Note: In production, you might want more sophisticated upsert logic.
        const count = await collection.count();
        if (count > 0) {
            if (isDev) console.log(`ChromaDB already has ${count} items. Skipping re-ingestion.`);
            return;
        }

        if (isDev) console.log(`Ingesting ${dataset.length} items...`);

        const ids = [];
        const documents = [];
        const metadatas = [];

        for (const [index, item] of dataset.entries()) {
            // Create a rich document string
            const docText = `Category: ${item.category}. Question: ${item.question} Answer: ${item.answer}`;

            ids.push(`doc_${index}`);
            documents.push(docText);
            metadatas.push({
                category: item.category,
                question: item.question,
                source: "portfolio_dataset"
            });
        }

        // Add to collection (Chroma Cloud creates embeddings automatically)
        await collection.add({
            ids,
            documents,
            metadatas
        });

        if (isDev) console.log("Ingestion complete!");

    } catch (error) {
        // Keep errors visible even in production unless explicitly silenced, 
        // as failed ingestion might break the chatbot.
        console.error("Ingestion failed:", error);
    }
};
