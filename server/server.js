const { getUser, getRepos, getRepoLanguages } = require('./githubService');
const { getProfileData } = require('./githubProfileService');
const { calculateProfileScore } = require('./profileScore');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/analyze', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API Key missing' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini REST API Error:', response.status, errorText);
            return res.status(500).json({ error: 'AI service unavailable' });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        res.json([{ generated_text: text }]);

    } catch (error) {
        console.error('Gemini error:', error);
        res.status(500).json({ error: 'AI service unavailable' });
    }
});

app.post('/analyze-profile', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API Key missing' });
        }

        const profileData = await getProfileData(username);
        const scoreData = calculateProfileScore(profileData);

        const createdAt = profileData.user?.created_at ? new Date(profileData.user.created_at) : null;
        const yearsActive = createdAt ? Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;
        const yearsActiveRounded = Math.round(yearsActive * 10) / 10;

        const prompt = `
You are a senior engineering hiring manager.

Evaluate this GitHub developer profile:

Years Active: ${yearsActiveRounded}
Repositories: ${profileData.repos.length}
Serious Projects: ${scoreData.serious_projects}
Dominant Stack: ${scoreData.specialization}
Recent Activity: ${scoreData.consistency}
Impact Score: ${scoreData.impact_score}
Domains: ${scoreData.domains.length ? scoreData.domains.join(", ") : "None"}

Return only this format with short, crisp bullet points (max 3 bullets per section):

Candidate Level: <one short phrase>
Strengths:
- <short point>
- <short point>
Weaknesses:
- <short point>
- <short point>
Recommended Roles:
- <short role>
- <short role>
Hiring Verdict: <one short phrase>
`.trim();

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini REST API Error:', response.status, errorText);
            return res.status(500).json({ error: 'AI service unavailable' });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        res.json({
            metrics: {
                years_active: yearsActiveRounded,
                repositories: profileData.repos.length,
                ...scoreData
            },
            analysis: text
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Profile analysis failed' });
    }
});

app.listen(PORT, () => {
    console.log(`RepoScanAI running on port ${PORT}`);
});
