import { pipeline } from '@xenova/transformers';

class Embedder {
    constructor() {
        this.pipe = null;
    }

    async init() {
        if (!this.pipe) {
            console.log("Loading embedding model (Xenova/all-MiniLM-L6-v2)...");
            this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }
    }

    async embed(text) {
        if (!this.pipe) await this.init();

        // Clean text
        const cleanedText = text.replace(/\n/g, ' ').trim();

        // Generate embedding
        const output = await this.pipe(cleanedText, { pooling: 'mean', normalize: true });
        return Array.from(output.data); // Convert Float32Array to standard array
    }
}

// Singleton instance
const embedder = new Embedder();
export default embedder;
