import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api';

export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showCampaignButton, setShowCampaignButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Set initial message
  useEffect(() => {
    setMessages([
      { 
        type: 'bot', 
        content: "Hi! I'll help you create your Google Ads campaign. What's your business name?" 
      }
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = { type: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      
      // Get bot response
      const response = await chatService.sendMessage(input);
      console.log('Server response:', response);

      // Add bot message
      const botMessage = {
        type: 'bot',
        content: response.question || response.message || 'No response content'
      };
      setMessages(prev => [...prev, botMessage]);

      if (response.isComplete) {
        setShowCampaignButton(true);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, there was an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chat-section">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      {showCampaignButton && (
        <button 
          className="create-campaign-button"
          onClick={handleCreateCampaign}
          disabled={isLoading}
        >
          Create Campaign
        </button>
      )}
    </div>
  );
}