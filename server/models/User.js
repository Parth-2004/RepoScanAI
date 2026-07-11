const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  avatarUrl: { type: String },
  lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
