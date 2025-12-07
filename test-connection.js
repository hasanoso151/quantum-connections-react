import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Helper to read .env file manually since we don't have dotenv
function loadEnv() {
    const envFiles = [
        '.env',
        '.env.local',
        '.env.development',
        '.env.development.local'
    ];

    let loaded = false;

    envFiles.forEach(file => {
        try {
            const envPath = path.resolve(process.cwd(), file);
            if (fs.existsSync(envPath)) {
                console.log(`📝 Found ${file}`);
                const data = fs.readFileSync(envPath, 'utf8');
                data.split('\n').forEach(line => {
                    // Trim whitespace and ignore comments
                    line = line.trim();
                    if (!line || line.startsWith('#')) return;

                    const match = line.match(/^([^=]+)=(.*)$/);
                    if (match) {
                        const key = match[1].trim();
                        let value = match[2].trim();

                        // Remove quotes if present
                        if ((value.startsWith('"') && value.endsWith('"')) ||
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.slice(1, -1);
                        }

                        if (!process.env[key]) {
                            process.env[key] = value;
                        }
                    }
                });
                loaded = true;
            }
        } catch (err) {
            console.log(`⚠️ Error reading ${file}:`, err.message);
        }
    });

    if (!loaded) {
        console.log("⚠️ No .env files found.");
    }
}

loadEnv();

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY;

// Debug: Print keys (masked) to help troubleshooting
console.log("Debug: Checked keys:");
console.log("- API_KEY:", process.env.API_KEY ? "Found" : "Missing");
console.log("- GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
console.log("- GEMMA_API_KEY:", process.env.GEMMA_API_KEY ? "Found" : "Missing");

if (!apiKey) {
    console.error("❌ Error: API Key not found in environment variables or .env/.env.local files.");
    console.log("Please make sure you have a .env.local file with API_KEY, GEMINI_API_KEY, or GEMMA_API_KEY defined.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function test() {
    console.log("🔄 Testing connection to model: gemma-3-12b-it...");
    try {
        const response = await ai.models.generateContent({
            model: "gemma-3-12b-it",
            contents: "Hello! Reply with 'Connected to Gemma!' if you receive this.",
        });

        // Check for response text
        const text = response.text;

        if (text) {
            console.log("✅ Connection Successful!");
            console.log("🤖 Response:", text);
        } else {
            console.log("⚠️ Received response but no text content found.");
            console.log("Response Object:", JSON.stringify(response, null, 2));
        }

    } catch (error) {
        console.error("❌ Connection Failed:", error.message);
        if (error.response) {
            console.error("Error Details:", JSON.stringify(error.response, null, 2));
        }
    }
}

test();
