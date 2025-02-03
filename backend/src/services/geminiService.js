const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

// Enhanced model configuration
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.9,    // Increased for more creative responses
    maxOutputTokens: 1000,  // Reduced for faster responses
    topK: 40,
    topP: 0.8,
  }
});

const CHAT_STAGES = {
  INITIAL: 'initial',
  BUSINESS: 'business',
  INDUSTRY: 'industry',
  AUDIENCE: 'audience',
  BUDGET: 'budget',
  GOALS: 'goals',
  FINAL: 'final'
};

// Improved retry mechanism
async function withRetry(fn, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      if (!response) throw new Error('Empty response received');
      return response;
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Chat history management
let chatHistory = [];

async function getNextQuestion(stage, previousResponses = {}) {
  const prompt = `You are an expert marketing consultant and a specialist at Google Ads campaign creation and management.
Current stage: ${stage}
Previous responses: ${JSON.stringify(previousResponses)}

Based on this context, provide ONE engaging question that:
1. References their previous answers naturally
2. Seeks specific information for ${stage} stage
3. Uses a friendly, professional tone

Response format:
{
  "question": "your question here",
  "context": "brief context based on previous answers",
  "tip": "helpful suggestion based on their situation"
}`;

  try {
    const result = await withRetry(async () => {
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      // Validate JSON response
      const parsed = JSON.parse(text);
      if (!parsed.question) throw new Error('Invalid response format');
      return parsed;
    });

    chatHistory.push({
      stage,
      response: result
    });

    return result;
  } catch (error) {
    console.error('Error getting next question:', error);
    throw new Error('Failed to generate question. Please try again.');
  }
}

async function generateCampaignStrategy(responses) {
  const prompt = `Based on these responses: ${JSON.stringify(responses)}
Create a focused marketing strategy with:
1. Campaign structure
2. Target audience
3. Budget allocation
4. Key performance metrics

Format as JSON.`;

  return await withRetry(async () => {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  });
}

module.exports = {
  CHAT_STAGES,
  getNextQuestion,
  generateCampaignStrategy
};