const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const models = [
    "HuggingFaceH4/zephyr-7b-beta",
    "sshleifer/tiny-gpt2",
    "bigscience/bloomz-560m",
    "tiiuae/falcon-7b-instruct",
    "gpt2-medium"
];

const baseUrls = [
    "https://router.huggingface.co/hf-inference/models"
];

async function testModel(model, baseUrl) {
    console.log("Key loaded:", process.env.HF_API_KEY ? "YES (" + process.env.HF_API_KEY.substring(0, 4) + "...)" : "NO");
    const url = `${baseUrl}/${model}`;
    console.log(`Testing ${url}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: "Hello, who are you?",
                parameters: { max_new_tokens: 50 }
            }),
        });

        console.log(`Status: ${response.status}`);
        console.log(`Headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
            console.log(`✅ SUCCESS: ${url}`);
            return true;
        } else {
            console.log(`❌ FAILED: ${url}`);
            console.log(await response.text());
            return false;
        }
    } catch (error) {
        console.log(`❌ ERROR: ${url} - ${error.message}`);
        return false;
    }
}

async function checkKey() {
    console.log("Checking key validity...");
    try {
        const response = await fetch("https://huggingface.co/api/whoami-v2", {
            headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}` }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ Key is valid for user: ${data.name}`);
            return true;
        } else {
            console.log(`❌ Key invalid: ${response.status}`);
            return false;
        }
    } catch (e) {
        console.log("❌ Whoami check failed:", e.message);
        return false;
    }
}

async function run() {
    if (!await checkKey()) {
        console.log("⚠️  YOUR API KEY SEEMS INVALID OR EXPIRED. ⚠️");
        return;
    }
    // ... rest of logic
    for (const baseUrl of baseUrls) {
        for (const model of models) {
            if (await testModel(model, baseUrl)) return;
        }
    }
}

run();
