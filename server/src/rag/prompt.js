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



    // Explicitly handle empty context to prevent hallucination
    const contextText = contextDocs.length > 0 ? contextDocs.join('\n\n') : "NO DATA FOUND. That information is not documented in the current portfolio.";

    // console.log("System Prompt Loaded:", systemPrompt.length > 50);

    const finalPrompt = `
${systemPrompt}

--- DOCUMENTED PORTFOLIO DATA (CONTEXT) ---
${contextText}
--- END DATA ---

User Question: ${userQuestion}
Assistant Response:
`.trim();

    return finalPrompt;
};
