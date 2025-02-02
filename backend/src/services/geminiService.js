const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const CHAT_STAGES = {
  INITIAL: 'initial',
  BUSINESS: 'business',
  INDUSTRY: 'industry',
  AUDIENCE: 'audience',
  BUDGET: 'budget',
  GOALS: 'goals',
  FINAL: 'final'
};

const basePrompt = `You are an expert digital marketing and Google Ads specialist with 10+ years of experience.
Your goal is to gather precise information to create a highly effective Google Ads campaign.
Respond in a professional yet conversational tone.
Ask only ONE question at a time.
Provide brief context why you're asking each question.
`;

async function getNextQuestion(stage, previousResponses = {}) {
  const prompt = `${basePrompt}
Current conversation stage: ${stage}
Previous responses: ${JSON.stringify(previousResponses)}

Based on this, provide:
1. A single focused question for the ${stage} stage
2. Brief explanation why this information matters
3. Optional tip to help user provide better response

Format: JSON with fields: question, explanation, tip`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

async function generateCampaignStrategy(responses) {
  const prompt = `${basePrompt}
Complete business profile:
${JSON.stringify(responses, null, 2)}

Create a comprehensive Google Ads campaign strategy including:
1. Campaign structure
2. Ad copy suggestions (headlines, descriptions)
3. Keywords and match types
4. Bidding strategy
5. Budget allocation
6. Target audience segments
7. Expected KPIs

Format as structured JSON`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

module.exports = {
  CHAT_STAGES,
  getNextQuestion,
  generateCampaignStrategy
};