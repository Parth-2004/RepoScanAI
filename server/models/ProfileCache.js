const mongoose = require('mongoose');

const ProfileCacheSchema = new mongoose.Schema({
  githubUsername: { type: String, required: true, unique: true, index: true },
  metrics: {
    years_active: Number,
    repositories: Number,
    serious_projects: Number,
    specialization: String,
    consistency: String,
    impact_score: Number,
    domains: [String]
  },
  aiAnalysis: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now, expires: '7d' } // 7-day TTL
});

module.exports = mongoose.model('ProfileCache', ProfileCacheSchema);
