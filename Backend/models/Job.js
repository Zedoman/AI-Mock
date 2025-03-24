const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    codingQuestion: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
      example: { input: String, output: String }, // Expects strings
    },
    createdAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Job', jobSchema);