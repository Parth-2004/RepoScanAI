# Deploying RepoScanAI

RepoScanAI is now a full-stack Node.js application that serves its own frontend. This makes it easy to deploy on free platforms like **Render**, **Vercel**, or **Railway**.

## Option 1: Deploy on Render (Recommended for Free Tier)

1.  **Push to GitHub**:
    - Initialize a git repo in the `server` folder (or root, but `server` is easier).
    - Commit all files (ensure `.env` is NOT committed, but `package.json` and `public/` are).
2.  **Create Web Service**:
    - Go to [dashboard.render.com](https://dashboard.render.com/).
    - Click **New +** -> **Web Service**.
    - Connect your GitHub repo.
3.  **Configure**:
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Root Directory**: `server` (if your repo root is `New folder`, otherwise leave blank).
4.  **Environment Variables**:
    - Add `GEMINI_API_KEY` with your key value.
5.  **Deploy**:
    - Click "Create Web Service". Render will build and deploy.
    - You will get a URL like `https://reposcanai.onrender.com`.

## Option 2: Local Network Sharing (Temporary)

If you just want to share on your local WiFi:
1.  Find your computer's local IP (e.g., `192.168.1.15`).
2.  Run `npm start` on your computer.
3.  Tell your friend to open `http://192.168.1.15:3001` on their device (connected to same WiFi).
*Note: This requires your firewall to allow Node.js.*

## Project Structure for Deployment
- `server.js`: Entry point. Starts Express server and serves `public/`.
- `public/index.html`: The frontend application.
- `package.json`: Dependencies (`express`, `cors`, `@google/generative-ai`).
- `.env`: **Secrets (Do not commit this!)**
