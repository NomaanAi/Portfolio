import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPrompt } from '../rag/prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MOCK_DATA = {
    projects: [
        "Project Title: Project Alpha\nProblem: text problem\nConstraints: text constraints",
        "Project Title: Project Beta\nProblem: beta problem"
    ]
};

const TESTS = [
    {
        name: "About - Missing",
        query: "Tell me about Nomaan",
        context: [],
        expected: /not documented/i,
        forbidden: /background/i
    },
    {
        name: "Skills - Non-existent",
        query: "Do you know TensorFlow?",
        context: [
            "Skill Name: Python\nCategory: AI / Machine Learning",
            "Skill Name: PyTorch\nCategory: AI / Machine Learning"
        ],
        expected: /not listed|not documented/i,
        forbidden: /Yes|I know/i
    },
    {
        name: "Skills - List Valid",
        query: "list the skills",
        context: [
            "Skill Name: Python\nCategory: AI / Machine Learning",
            "Skill Name: PyTorch\nCategory: AI / Machine Learning",
            "Skill Name: Scikit-learn\nCategory: AI / Machine Learning"
        ],
        expected: (text) => text.includes("Python") && text.includes("PyTorch") && text.includes("Scikit-learn"),
        forbidden: /TensorFlow|Java|Experienc/i
    }
];

async function callLLM(finalPrompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a strict portfolio documentation assistant. Follow the user's provided context rules exactly." },
                    { role: "user", content: finalPrompt }
                ],
                temperature: 0
            })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "ERROR";
    } catch (e) { return "NETWORK_ERROR"; }
}

async function run() {
    for (const test of TESTS) {
        console.log(`TEST: ${test.name}`);
        const p = await buildPrompt(test.query, test.context);
        const r = await callLLM(p);
        console.log(`RESPONSE: ${r}`);

        let pass = true;
        if (test.expected) {
            if (typeof test.expected === 'function') {
                if (!test.expected(r)) {
                    console.log(`FAIL EXPECTED CHECK`);
                    pass = false;
                }
            } else if (!test.expected.test(r)) {
                console.log(`FAIL EXPECTED: ${test.expected}`);
                pass = false;
            }
        }
        if (test.forbidden && test.forbidden.test(r)) {
            console.log(`FAIL FORBIDDEN: ${test.forbidden}`);
            pass = false;
        }
        console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
        console.log("--------------------------------");
    }
}

run();
