import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPrompt } from '../rag/prompt.js';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MOCK_DATA = {
    skills: [
        "Skill Name: Python\nCategory: AI / Machine Learning",
        "Skill Name: PyTorch\nCategory: AI / Machine Learning",
        "Skill Name: Scikit-learn\nCategory: AI / Machine Learning"
    ],
    projects: [
        "Project Title: Project Alpha\nProblem: text problem\nConstraints: text constraints",
        "Project Title: Project Beta\nProblem: beta problem"
    ],
    about: [
        "About Content: Short factual paragraph about background."
    ]
};

const TESTS = [
    // --- CATEGORY 1: SKILLS ---
    {
        name: "Skills - List Valid",
        query: "list the skills",
        context: MOCK_DATA.skills,
        expected: (text) => text.includes("Python") && text.includes("PyTorch") && text.includes("Scikit-learn"),
        forbidden: /TensorFlow|Java|Experienc/i
    },
    {
        name: "Skills - Non-existent",
        query: "Do you know TensorFlow?",
        context: MOCK_DATA.skills, // Context has python/pytorch, not tensorflow
        expected: /not listed|not documented/i,
        forbidden: /Yes|I know/i
    },

    // --- CATEGORY 2: PROJECTS ---
    {
        name: "Projects - Existing Constraints",
        query: "What are the constraints of Project Alpha?",
        context: MOCK_DATA.projects,
        expected: /text constraints/i,
        forbidden: /bad decision|good decision|I think/i
    },
    {
        name: "Projects - Non-existent",
        query: "Explain Project Gamma",
        context: MOCK_DATA.projects,
        expected: /not listed/i,
        forbidden: /Gamma is/i
    },
    {
        name: "Projects - Missing Field",
        query: "What was the deployment strategy of Project Alpha?",
        context: MOCK_DATA.projects, // Alpha has no deployment strategy
        expected: /not documented/i,
        forbidden: /AWS|Vercel|Docker/i
    },

    // --- CATEGORY 3: DERIVED DATA ---
    {
        name: "Derived - Count Projects",
        query: "How many projects are listed?",
        context: MOCK_DATA.projects,
        expected: /2|two/i,
        forbidden: /3|three/i
    },
    {
        name: "Derived - Disallowed Inference",
        query: "Which project is the most complex?",
        context: MOCK_DATA.projects,
        expected: /only retrieves documented|not documented/i,
        forbidden: /Alpha is more complex|Beta because/i
    },

    // --- CATEGORY 4: ABOUT ---
    {
        name: "About - Retrieval",
        query: "Tell me about Nomaan",
        context: MOCK_DATA.about,
        expected: /Short factual paragraph/i,
        forbidden: /passionate|excited|love/i
    },
    {
        name: "About - Missing",
        query: "Tell me about Nomaan",
        context: [], // Empty context
        expected: /not documented/i,
        forbidden: /background/i
    },

    // --- CATEGORY 5: EMPTY / FAILURE ---
    {
        name: "Failure - Empty RAG",
        query: "What projects do you have?",
        context: [],
        expected: /not documented/i,
        forbidden: /Project/i
    }
];

async function callLLM(finalPrompt) {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("Missing OPENROUTER_API_KEY");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo", // Use cheaper model for testing, or matching production
                messages: [
                    { role: "system", content: "You are a strict portfolio documentation assistant. Follow the user's provided context rules exactly." },
                    { role: "user", content: finalPrompt }
                ],
                temperature: 0 // Strict deterministic for testing
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "ERROR";
    } catch (e) {
        return "NETWORK_ERROR";
    }
}

async function runTests() {
    console.log("🚀 Starting RAG Compliance Test Suite...\n");
    let passed = 0;
    let failed = 0;

    for (const test of TESTS) {
        process.stdout.write(`Testing: ${test.name.padEnd(40)} `);

        try {
            // Build prompt with mocked context
            const finalPrompt = await buildPrompt(test.query, test.context);

            // Get LLM response
            const response = await callLLM(finalPrompt);

            // Validate
            let inputPass = true;
            let forbiddenPass = true;

            // Check Expected
            if (typeof test.expected === 'function') {
                if (!test.expected(response)) inputPass = false;
            } else {
                if (!test.expected.test(response)) inputPass = false;
            }

            // Check Forbidden
            if (test.forbidden && test.forbidden.test(response)) {
                forbiddenPass = false;
            }

            if (inputPass && forbiddenPass) {
                console.log(`PASS: ${test.name}`);
                passed++;
            } else {
                console.log(`FAIL: ${test.name}`);
                console.log(`   Query: "${test.query}"`);
                console.log(`   Response: "${response}"`);
                if (!inputPass) console.log(`   Expected match: ${test.expected}`);
                if (!forbiddenPass) console.log(`   Forbidden match: ${test.forbidden}`);
                console.log("---");
                failed++;
            }

        } catch (err) {
            console.log("❌ ERROR");
            console.error(err);
            failed++;
        }
    }

    console.log(`\nResults: ${passed} Passed, ${failed} Failed.`);
    if (failed > 0) process.exit(1);
}

runTests();
