
import KnowledgeBase from '../models/KnowledgeBase.js';
import fs from 'fs';
import path from 'path';

// Helper to calculate Cosine Similarity
const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Embedding Function (Using OpenRouter/OpenAI compatible endpoint)
const getEmbedding = async (text) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // "HTTP-Referer": "https://nomaan.dev", // Optional for OpenRouter
            },
            body: JSON.stringify({
                model: "openai/text-embedding-3-small", // Cost effective
                input: text
            })
        });

        if (!response.ok) {
            // Fallback or just throw
            console.warn("Embedding API failed, status:", response.status);
            return null;
        }

        const data = await response.json();
        return data.data[0].embedding;
    } catch (error) {
        console.error("Embedding Error:", error);
        return null;
    }
};

export const ragService = {
    // 1. INGESTION
    ingestSystemPrompt: async (filePath) => {
        try {
            console.log("Starting Ingestion from:", filePath);
            const rawText = fs.readFileSync(filePath, 'utf-8');

            // Clear existing knowledge base to prevent duplicates
            await KnowledgeBase.deleteMany({});

            // Simple Chunking Strategy: Split by "##" or "---" or meaningful sections
            // For markdown, splitting by headers is best.
            const sections = rawText.split(/^#+\s/gm).filter(s => s.trim().length > 10);

            let count = 0;
            for (const section of sections) {
                // Extract title (first line)
                const lines = section.trim().split('\n');
                const title = lines[0].replace(/[*_]/g, '').trim(); // Clean markdown syntax
                const content = lines.slice(1).join('\n').trim();

                if (!content) continue;

                // Determine category
                let category = 'other';
                const lowerTitle = title.toLowerCase();
                if (lowerTitle.includes('skill')) category = 'skills';
                else if (lowerTitle.includes('project')) category = 'projects';
                else if (lowerTitle.includes('education')) category = 'education';
                else if (lowerTitle.includes('contact')) category = 'contact';
                else if (lowerTitle.includes('identity') || lowerTitle.includes('who')) category = 'identity';

                // Generate Embedding
                const embedding = await getEmbedding(title + "\n" + content);

                await KnowledgeBase.create({
                    title,
                    content: section.trim(), // Store full section including header for context
                    category,
                    embedding: embedding || []
                });
                count++;
            }
            console.log(`Ingested ${count} chunks.`);
            return { success: true, count };
        } catch (error) {
            console.error("Ingestion Failed:", error);
            return { success: false, error: error.message };
        }
    },

    // 2. RETRIEVAL
    retrieve: async (query, limit = 3) => {
        try {
            const queryEmbedding = await getEmbedding(query);

            // Fetch all chunks (Small scale = okay to fetch all ~50 chunks)
            const allChunks = await KnowledgeBase.find({});

            if (!queryEmbedding) {
                // Fallback: Keyword Search if embedding fails
                const regex = new RegExp(query.split(' ').filter(w => w.length > 3).join('|'), 'i');
                const results = allChunks.filter(c => regex.test(c.content)).slice(0, limit);
                return results.map(r => ({ content: r.content, score: 0 }));
            }

            // Calculate similarities
            const scoredChunks = allChunks.map(chunk => {
                if (!chunk.embedding || chunk.embedding.length === 0) return { ...chunk.toObject(), score: -1 };
                return {
                    ...chunk.toObject(),
                    score: cosineSimilarity(queryEmbedding, chunk.embedding)
                };
            });

            // Sort and Top-K
            scoredChunks.sort((a, b) => b.score - a.score);
            return scoredChunks.slice(0, limit);

        } catch (error) {
            console.error("Retrieval Error:", error);
            return [];
        }
    },

    // 3. CRUD MANAGEMENT
    addChunk: async (title, content, category) => {
        try {
            const embedding = await getEmbedding(title + "\n" + content);
            const chunk = await KnowledgeBase.create({
                title,
                content,
                category,
                embedding: embedding || []
            });
            return chunk;
        } catch (error) {
            console.error("Add Chunk Failed:", error);
            throw error;
        }
    },

    updateChunk: async (id, title, content, category) => {
        try {
            const embedding = await getEmbedding(title + "\n" + content);
            const chunk = await KnowledgeBase.findByIdAndUpdate(id, {
                title,
                content,
                category,
                embedding: embedding || []
            }, { new: true });
            return chunk;
        } catch (error) {
            console.error("Update Chunk Failed:", error);
            throw error;
        }
    },

    deleteChunk: async (id) => {
        return await KnowledgeBase.findByIdAndDelete(id);
    },

    getAllChunks: async () => {
        return await KnowledgeBase.find().sort({ category: 1, title: 1 });
    }
};
