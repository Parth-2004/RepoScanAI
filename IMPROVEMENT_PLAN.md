# RepoScanAI - Improvement & Scaling Plan

This document outlines the strategic roadmap to evolve RepoScanAI from its current state into a production-ready application. The architecture is designed to support a scale of ~100 active users, focusing on cost-efficiency, aesthetic appeal, and robust API usage optimization.

## 1. Architecture Overview

To support the current requirements, the architecture will transition to a more modern, decoupled stack:
- **Frontend:** React (SPA) replacing the current Vanilla JS/HTML setup.
- **Backend:** Node.js + Express.js (existing, but enhanced with auth and caching).
- **Database:** MongoDB (NoSQL) for user data and caching API responses.
- **Authentication:** Google OAuth 2.0.

## 2. Frontend Revamp (React + Aesthetics)

The frontend will be completely rewritten to deliver a modern, "GitHub-ready" aesthetic.

### Technology Stack
- **Framework:** React (Vite for fast bundling).
- **Styling:** TailwindCSS for utility-first styling.
- **Animations:** Framer Motion for smooth page transitions and micro-interactions.
- **Assets:** 3D icons (e.g., from libraries like Spline or UI8) to make the design pop and look premium.

### Key Pages & Components
1. **Hero Landing Page:**
   - **Design:** Dark mode focused, neon accents, sleek typography (similar to GitHub, Vercel, or Linear).
   - **Content:** Clear value proposition ("RepoScanAI — GitHub Developer Profile Analyzer").
   - **Visuals:** Floating 3D icons representing code, AI, and security.
   - **Call to Action (CTA):** A prominent "Try Now" button that redirects the user to the Google Login flow.
2. **Authentication Flow:**
   - A dedicated, beautifully animated login screen for Google OAuth.
3. **Dashboard / Analysis Page:**
   - Rebuilding the current analysis view using React components for the scorecard, metrics, and AI breakdown.
   - Framer motion will be used to animate the appearance of the scorecard and metrics.

## 3. Backend Enhancements

### Google OAuth Integration
- **Implementation:** Use `passport-google-oauth20` in the Express backend.
- **Flow:**
  1. User clicks "Try Now" and is redirected to Google.
  2. Google authenticates and redirects back to the server.
  3. Server creates/fetches the user in MongoDB and issues a JWT (JSON Web Token) to the React frontend.
  4. React uses this JWT for subsequent authenticated requests (e.g., initiating a repo scan).

### API Caching Strategy (MongoDB)
To avoid hitting GitHub and Gemini API rate limits and reduce costs, all analysis results will be cached.

- **Implementation:** Before making a request to GitHub or Gemini, the backend will check MongoDB for a recent analysis of that specific repository or profile.
- **Cache Invalidation:** Cached results can have a Time-To-Live (TTL) of e.g., 7 days. If a user requests an analysis older than 7 days, a fresh fetch is triggered, and the cache is updated.

## 4. Database Schema (MongoDB)

Using MongoDB allows flexible storage of the structured AI responses and user metadata.

### `Users` Collection
Stores user profiles who have logged in via Google.
```json
{
  "_id": "ObjectId",
  "googleId": "String",
  "email": "String",
  "name": "String",
  "avatarUrl": "String",
  "createdAt": "Date",
  "lastLogin": "Date"
}
```

### `ProfileAnalysisCache` Collection
Stores the cached AI and metric results for GitHub developer profiles.
```json
{
  "_id": "ObjectId",
  "githubUsername": "String (Indexed)",
  "metrics": {
    "years_active": "Number",
    "repositories": "Number",
    "serious_projects": "Number",
    "specialization": "String",
    "consistency": "String",
    "impact_score": "Number",
    "domains": ["String"]
  },
  "aiAnalysis": "String (Markdown)",
  "scannedAt": "Date (TTL Index for expiration)"
}
```

### `RepoAnalysisCache` Collection
Stores the cached AI and metric results for individual repositories.
```json
{
  "_id": "ObjectId",
  "repoUrl": "String (Indexed)",
  "aiAnalysis": "String (Markdown)",
  "scannedAt": "Date (TTL Index for expiration)"
}
```

## 5. Deployment & Infrastructure (for ~100 users)

Given the target scale of ~100 users, the infrastructure should be kept simple and low-cost.

- **Frontend Hosting:** Vercel or Netlify (Free tier is more than sufficient).
- **Backend Hosting:** Render, Heroku, or Railway (Basic tier).
- **Database:** MongoDB Atlas (M0 Free Cluster is perfect for this scale).
- **Secrets Management:** Environment variables for `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MONGO_URI`, and `JWT_SECRET`.

## 6. Step-by-Step Implementation Roadmap

1. **Phase 1: Setup & Database**
   - Initialize MongoDB Atlas cluster.
   - Set up Mongoose models in the Node.js backend.
   - Implement the caching layer in the existing `/analyze` and `/analyze-profile` routes.
2. **Phase 2: Authentication**
   - Register the application in Google Cloud Console to get OAuth credentials.
   - Implement Passport.js Google Auth on the backend.
   - Create JWT generation and verification middleware.
3. **Phase 3: Frontend Rewrite**
   - Initialize Vite + React + Tailwind project.
   - Build the Hero page with 3D assets and Framer Motion animations.
   - Implement the "Try Now" button and OAuth redirect flow.
   - Build the Dashboard for authenticated users to input GitHub URLs/usernames.
4. **Phase 4: Integration & Polish**
   - Connect the React frontend to the enhanced Express backend.
   - Add loading states, error handling, and toast notifications.
   - Deploy frontend and backend.
