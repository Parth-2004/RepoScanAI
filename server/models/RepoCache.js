const mongoose = require('mongoose');

const RepoCacheSchema = new mongoose.Schema({
  repoUrl: { type: String, required: true, unique: true, index: true },
  aiAnalysis: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now, expires: '7d' } // 7-day TTL
});

module.exports = mongoose.model('RepoCache', RepoCacheSchema);
