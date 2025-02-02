d/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const chatService = {
  async sendMessage(message) {
    try {
      const response = await api.post('/chat', {
        sessionId: 'test-session',
        message
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  async createCampaign(sessionId) {
    try {
      const response = await api.post('/campaign', { sessionId });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }
};