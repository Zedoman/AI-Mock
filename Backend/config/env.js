require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  judge0ApiUrl: process.env.JUDGE0_API_URL,
  judge0ApiKey: process.env.JUDGE0_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
};