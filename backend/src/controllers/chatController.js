const geminiService = require('../services/geminiService');
const automationService = require('../services/automationService');

class ChatController {
  constructor() {
    this.conversations = new Map();
    this.handleChat = this.handleChat.bind(this);
    this.createCampaign = this.createCampaign.bind(this);
  }

  async handleChat(req, res) {
    try {
      const { sessionId, message } = req.body;
      
      // Initialize or get existing conversation
      if (!this.conversations.has(sessionId)) {
        this.conversations.set(sessionId, {
          stage: geminiService.CHAT_STAGES.INITIAL,
          responses: {}
        });
      }

      const conversation = this.conversations.get(sessionId);
      
      // Store response if not initial
      if (conversation.stage !== geminiService.CHAT_STAGES.INITIAL) {
        conversation.responses[conversation.stage] = message;
      }

      // Determine next stage
      conversation.stage = this.getNextStage(conversation.stage);

      // Get AI response for next stage
      if (conversation.stage !== geminiService.CHAT_STAGES.FINAL) {
        const nextQuestion = await geminiService.getNextQuestion(
          conversation.stage, 
          conversation.responses
        );

        return res.json({
          ...nextQuestion,
          isComplete: false
        });
      }

      // Final stage - generate campaign strategy
      const strategy = await geminiService.generateCampaignStrategy(conversation.responses);
      return res.json({
        message: "Campaign strategy ready!",
        strategy,
        isComplete: true
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getNextStage(currentStage) {
    const stages = Object.values(geminiService.CHAT_STAGES);
    const currentIndex = stages.indexOf(currentStage);
    return stages[currentIndex + 1] || geminiService.CHAT_STAGES.FINAL;
  }

  async createCampaign(req, res) {
    try {
      const { sessionId } = req.body;
      const conversation = this.conversations.get(sessionId);
      
      if (!conversation) {
        throw new Error('No conversation found');
      }

      await automationService.createCampaign(conversation.responses);
      res.json({ message: "Campaign creation started successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ChatController();