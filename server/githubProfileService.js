const fetch = require('node-fetch');

const GITHUB_API = 'https://api.github.com';
const DEFAULT_HEADERS = {
    'User-Agent': 'RepoScanAI',
    'Accept': 'application/vnd.github+json,application/vnd.github.mercy-preview+json'
};

async function fetchJson(url) {
    const res = await fetch(url, { headers: DEFAULT_HEADERS });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GitHub API error ${res.status}: ${text}`);
    }
    return await res.json();
}

async function getUserProfile(username) {
    return await fetchJson(`${GITHUB_API}/users/${username}`);
}

async function getUserRepos(username) {
    return await fetchJson(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`);
}

function getTopRepos(repos, count = 5) {
    return repos
        .filter(repo => !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, count);
}

async function getRepoCommits(owner, repo) {
    return await fetchJson(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=30`);
}

async function getProfileData(username) {
    const user = await getUserProfile(username);
    const repos = await getUserRepos(username);
    const topRepos = getTopRepos(repos, 5);

    const commitsEntries = await Promise.all(
        topRepos.map(async (repo) => {
            try {
                const commits = await getRepoCommits(username, repo.name);
                return [repo.name, commits];
            } catch {
                return [repo.name, []];
            }
        })
    );

    const commitsByRepo = Object.fromEntries(commitsEntries);

    return { user, repos, topRepos, commitsByRepo };
}

module.exports = { getProfileData };
