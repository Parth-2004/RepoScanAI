# RepoScanAI — GitHub Developer Profile Analyzer

**RepoScanAI** evaluates GitHub repositories and developer profiles the way a technical recruiter or senior engineer does.

Instead of guessing, it computes structured engineering signals first and then uses AI to interpret them.

It answers practical questions:

> Would a company trust this developer in production?

Live Demo: https://repo-scan-ai.onrender.com/

---

## What Makes This Different
Most tools analyze code quality.  
RepoScanAI analyzes **developer credibility**.

It performs a multi-layer audit:

- Static Analysis → Repository structure & hygiene
- Behavioral Analysis → Commit patterns & consistency
- Architectural Analysis → System organization
- AI Evaluation → Human-like recruiter judgement

---

## Core Evaluation Metrics

The final **Professional Grade (A+ → D)** is computed from four signals:

### 1) Structure
Detects engineering discipline.

Checks for:
- README quality
- license
- project organization
- modular separation
- config management

### 2) Consistency
Measures seriousness of development.

Analyzes:
- commit frequency
- long inactivity gaps
- burst commits (copied projects)
- maintenance behavior

### 3) Project Depth
Measures real engineering work vs tutorial code.

Looks for:
- multiple modules
- business logic presence
- infrastructure code
- data flow complexity

### 4) Professionalism
Measures industry readiness.

Detects:
- documentation
- metadata & topics
- naming clarity
- deployability

---

## Three Analysis Modes

### Mode 1 — Single Repository Audit
**Goal:** Is this project production-ready?

Provides:
- architecture summary
- strengths & weaknesses
- security risks
- hire / reject verdict

Use cases:
- portfolio review
- project evaluation
- hackathon judging

---

### Mode 2 — Repository vs Repository (Peer Comparison)
**Goal:** Which project shows stronger engineering skill?

Compares:
- architecture (modular vs monolithic)
- maintenance (active vs abandoned)
- complexity (original vs tutorial)
- quality (documented vs messy)

Outputs a winner with reasoning similar to interview panel feedback.

Use cases:
- ranking students
- competitions
- shortlisting candidates

---

### Mode 3 — Profile Mode (GitHub Developer Analysis)
**Goal:** Predict engineering maturity (Beginner → Senior) using measurable signals.

Computes:
- years active
- recent activity consistency
- dominant stack specialization
- serious project count
- impact score (stars + forks)
- domain signals (backend, frontend, ai/ml, devops, data)

Outputs:
- candidate level
- primary stack
- consistency rating
- engineering maturity score
- strengths, weaknesses, recommended roles

---

## Features

- AI-generated technical report
- Professional grade scorecard
- Repository comparison
- Developer profile evaluation
- Structured metrics + AI interpretation
- Architecture visualizer
- Security surface detection
- PDF export

---

## Tech Stack

### Frontend
- HTML5
- TailwindCSS
- Vanilla JS
- Marked.js

### Backend
- Node.js
- Express.js
- REST API architecture
- node-fetch

### AI Layer
- Google Gemini (gemini-2.5-flash)
- Structured prompt evaluation

---

## Local Setup

### Requirements
- Node.js ≥ 14
- Google Gemini API Key

### Install

```bash
git clone https://github.com/Parth-2004/RepoScanAI
cd RepoScanAI/server
npm install
```

Create `.env`

```
GEMINI_API_KEY=your_key_here
PORT=3001
```

Run

```bash
npm start
```

Open

```
http://localhost:3001
```

---

## Deployment (Render)

Settings:

Root Directory: `server`  
Build Command: `npm install`  
Start Command: `npm start`  
Environment Variable: `GEMINI_API_KEY`

After deployment the app automatically serves frontend + backend.

---

## Intended Use Cases

- placement preparation
- student portfolio improvement
- hackathon judging
- recruiter screening automation
- open-source contribution assessment

---
