const fetch = require("node-fetch");

const GITHUB_API = "https://api.github.com";

async function getUser(username) {
    const res = await fetch(`${GITHUB_API}/users/${username}`);
    return await res.json();
}

async function getRepos(username) {
    const res = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`);
    return await res.json();
}

async function getRepoLanguages(owner, repo) {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`);
    return await res.json();
}

module.exports = { getUser, getRepos, getRepoLanguages };
