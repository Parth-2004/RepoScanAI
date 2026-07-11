function calculateProfileScore(profileData) {
    const user = profileData.user || {};
    const repos = Array.isArray(profileData.repos) ? profileData.repos : [];
    const commitsByRepo = profileData.commitsByRepo || {};
    const contentsByRepo = profileData.contentsByRepo || {};

    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const yearsActive = createdAt ? Math.max(0, (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;

    const languageCounts = {};
    let languageTotal = 0;
    repos.forEach(repo => {
        if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            languageTotal += 1;
        }
    });

    const dominantLanguageEntry = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0];
    const dominantLanguage = dominantLanguageEntry ? dominantLanguageEntry[0] : 'Unknown';
    const dominantLanguagePct = dominantLanguageEntry && languageTotal ? dominantLanguageEntry[1] / languageTotal : 0;
    const specialization = dominantLanguagePct >= 0.35 ? dominantLanguage : 'Generalist';

    const seriousProjects = repos.filter(repo => !repo.fork && repo.size > 50).length;

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const impactScore = totalStars + (totalForks * 2);

    const recentCommitCount = Object.values(commitsByRepo).flat().filter(commit => {
        const dateStr = commit?.commit?.committer?.date || commit?.commit?.author?.date;
        if (!dateStr) return false;
        const commitTime = new Date(dateStr).getTime();
        if (Number.isNaN(commitTime)) return false;
        const diffDays = (Date.now() - commitTime) / (1000 * 60 * 60 * 24);
        return diffDays <= 90;
    }).length;

    const consistency = recentCommitCount >= 30 ? 'High' : recentCommitCount >= 10 ? 'Moderate' : recentCommitCount >= 1 ? 'Low' : 'Inactive';

    const domains = detectDomains(repos);

    const experienceScore = yearsActive >= 8 ? 25 : yearsActive >= 5 ? 20 : yearsActive >= 3 ? 15 : yearsActive >= 1 ? 8 : yearsActive > 0 ? 4 : 0;
    const consistencyScore = recentCommitCount >= 60 ? 25 : recentCommitCount >= 30 ? 20 : recentCommitCount >= 15 ? 15 : recentCommitCount >= 5 ? 8 : recentCommitCount >= 1 ? 4 : 0;
    const depthScore = seriousProjects >= 8 ? 20 : seriousProjects >= 5 ? 15 : seriousProjects >= 3 ? 10 : seriousProjects >= 1 ? 5 : 0;
    const specializationScore = dominantLanguagePct >= 0.6 ? 10 : dominantLanguagePct >= 0.45 ? 8 : dominantLanguagePct >= 0.3 ? 6 : dominantLanguagePct >= 0.2 ? 4 : 2;
    const impactScorePoints = impactScore >= 2000 ? 20 : impactScore >= 800 ? 16 : impactScore >= 300 ? 12 : impactScore >= 100 ? 8 : impactScore >= 20 ? 5 : impactScore > 0 ? 2 : 0;

    const levelScore = Math.max(0, Math.min(100, Math.round(experienceScore + consistencyScore + depthScore + specializationScore + impactScorePoints)));
    const level = levelScore >= 76 ? 'Senior' : levelScore >= 61 ? 'Strong Mid' : levelScore >= 41 ? 'Mid' : levelScore >= 21 ? 'Junior' : 'Beginner';

    // Calculate Code Health based on tests, CI/CD, and docs in top repos
    let codeHealthScore = 0;
    let codeHealthMax = 0;
    Object.values(contentsByRepo).forEach(contents => {
        if (!Array.isArray(contents) || contents.length === 0) return;
        codeHealthMax += 3; // Max 3 points per repo: 1 for tests, 1 for CI/CD, 1 for docs
        const fileNames = contents.map(c => c.name ? c.name.toLowerCase() : '').filter(Boolean);

        const hasTests = fileNames.some(f => f.includes('test') || f.includes('spec') || f.includes('jest') || f.includes('mocha') || f.includes('pytest'));
        const hasCICD = fileNames.some(f => f.includes('.github') || f.includes('.gitlab-ci.yml') || f.includes('travis.yml') || f.includes('circleci'));
        const hasDocs = fileNames.some(f => f.includes('readme') || f.includes('docs') || f.includes('license') || f.includes('contributing'));

        if (hasTests) codeHealthScore += 1;
        if (hasCICD) codeHealthScore += 1;
        if (hasDocs) codeHealthScore += 1;
    });

    let codeHealth = "Low";
    if (codeHealthMax > 0) {
        const healthRatio = codeHealthScore / codeHealthMax;
        if (healthRatio >= 0.7) codeHealth = "Excellent";
        else if (healthRatio >= 0.4) codeHealth = "Good";
        else if (healthRatio >= 0.2) codeHealth = "Fair";
    }

    // Calculate Uniqueness based on original repos vs forks, and niche languages
    const totalRepos = repos.length;
    const originalRepos = repos.filter(repo => !repo.fork).length;
    const originalityRatio = totalRepos > 0 ? originalRepos / totalRepos : 0;

    // Check for diverse/niche languages
    const uniqueLanguagesCount = Object.keys(languageCounts).length;
    const commonLanguages = ['JavaScript', 'Python', 'Java', 'HTML', 'CSS', 'TypeScript', 'C++', 'C#', 'PHP'];
    const nicheLanguagesCount = Object.keys(languageCounts).filter(lang => !commonLanguages.includes(lang)).length;

    let uniquenessScore = (originalityRatio * 50) + (Math.min(uniqueLanguagesCount, 5) * 5) + (Math.min(nicheLanguagesCount, 3) * 8);
    uniquenessScore = Math.max(0, Math.min(100, Math.round(uniquenessScore)));

    let uniqueness = "Standard";
    if (uniquenessScore >= 80) uniqueness = "Highly Unique";
    else if (uniquenessScore >= 60) uniqueness = "Distinctive";
    else if (uniquenessScore >= 40) uniqueness = "Above Average";

    return {
        level_score: levelScore,
        level,
        specialization,
        consistency,
        domains,
        serious_projects: seriousProjects,
        impact_score: impactScore,
        code_health: codeHealth,
        uniqueness: uniqueness
    };
}

function detectDomains(repos) {
    const domainKeywords = {
        backend: ['api', 'backend', 'server', 'express', 'spring', 'django', 'flask', 'rails', 'laravel', 'fastapi', 'microservice'],
        frontend: ['frontend', 'ui', 'ux', 'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'tailwind'],
        'ai/ml': ['ml', 'ai', 'machine-learning', 'deep-learning', 'pytorch', 'tensorflow', 'keras', 'llm', 'nlp', 'vision'],
        devops: ['devops', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'cicd', 'github-actions', 'helm'],
        data: ['data', 'etl', 'pipeline', 'analytics', 'spark', 'hadoop', 'dbt', 'warehouse', 'sql']
    };

    const domainCounts = {
        backend: 0,
        frontend: 0,
        'ai/ml': 0,
        devops: 0,
        data: 0
    };

    repos.forEach(repo => {
        const topics = Array.isArray(repo.topics) ? repo.topics : [];
        const tokens = [repo.language, repo.name, ...topics].filter(Boolean).join(' ').toLowerCase();
        Object.entries(domainKeywords).forEach(([domain, keywords]) => {
            if (keywords.some(keyword => tokens.includes(keyword))) {
                domainCounts[domain] += 1;
            }
        });
    });

    return Object.entries(domainCounts)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([domain]) => domain);
}

module.exports = { calculateProfileScore };
