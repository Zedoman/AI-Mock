const mongoose = require('mongoose');

const userAttemptSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Assuming user ID is provided
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  feedback: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserAttempt', userAttemptSchema);