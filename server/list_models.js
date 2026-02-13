const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function listModels() {
    console.log("Listing models...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For some reason the SDK doesn't expose listModels directly on the main class in all versions
        // Let's try to just use a known model and if it fails print error
        // Actually, let's try to use the model manager if available
        // Or just try a different model name 'gemini-1.0-pro'

        // Let's try to fetch models via REST if SDK is tricky
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("Error listing models:", JSON.stringify(data));
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

listModels();
