require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY
};