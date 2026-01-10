import fs from 'fs';
import path from 'path';

export const buildPrompt = async (userQuestion, contextDocs) => {
    // Load System Prompt
    const systemPromptPath = path.resolve(process.cwd(), '../CHATBOT_SYSTEM_PROMPT.md');
    // Adjust path: user said CHATBOT_SYSTEM_PROMPT.md is in root. process.cwd() usually root.
    // Wait, the path provided in listing was `d:\MyPortfilio\CHATBOT_SYSTEM_PROMPT.md`.
    // The server folder is `d:\MyPortfilio\server`.
    // If running node from `server/`, `process.cwd()` is `d:\MyPortfilio\server`.
    // So `../CHATBOT_SYSTEM_PROMPT.md` is correct.

    let systemPrompt = "";
    try {
        systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');
    } catch (e) {
        console.error("Could not load system prompt file, using fallback.");
        systemPrompt = "You are a helpful portfolio assistant.";
    }

    const contextText = contextDocs.join('\n\n');

    const finalPrompt = `
${systemPrompt}

You must answer the user's question explicitly and ONLY using the context provided below. 
Do not hallucinate or use outside knowledge. 
If the answer is not in the context, say you don't know based on the provided profile.

--- CONTEXT START ---
${contextText}
--- CONTEXT END ---

User Question: ${userQuestion}
Assistant Content:
`.trim();

    return finalPrompt;
};
