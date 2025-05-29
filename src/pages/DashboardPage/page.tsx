import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import Sidebar from '@/components/sidebar';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'ai'}>>([]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user' as const
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Simulate AI response (you can replace this with actual AI integration)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: "Thank you for sharing! I'm here to help you discover your ideal career path. Could you tell me more about your interests, skills, or what kind of work environment you prefer?",
          sender: 'ai' as const
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'chatbot':
        navigate('/dashboard');
        break;
      case 'articles':
        // Add route for articles if needed
        navigate('/articles');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Global Sidebar */}
      <Sidebar activePage="chatbot" onNavigate={handleNavigation} />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen pl-4 pr-4 md:pl-6 md:pr-6">
        {/* Header */}
        <header className="pt-20 pb-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              AI Career <span className="text-purple-400">Guidance</span>
            </h1>
            <p className="text-gray-400 text-center mt-2">
              Let's discover your perfect career path together
            </p>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Messages Area */}
          <div className="flex-1 mb-6">
            {messages.length === 0 ? (
              /* Welcome Message */
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Tell me about yourself
                  </h2>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Share your interests, skills, or career goals, and I'll help guide you toward the perfect career path.
                  </p>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-800/50 border border-gray-700/50 text-gray-100'
                      }`}
                    >
                      <p className="text-sm md:text-base">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Input - Fixed at bottom */}
          <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-4 pb-6">
            <div className="relative">
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4 focus-within:border-purple-500/50 transition-colors">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type here"
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-base md:text-lg pr-12"
                  rows={1}
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 opacity-20">
            <div className="w-full h-full bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1"/>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              {/* Animated wave lines */}
              {Array.from({ length: 15 }, (_, i) => {
                const delay = i * 0.1;
                return (
                  <path
                    key={i}
                    d={`M${10 + i * 5},${80 - i * 2} Q${30 + i * 5},${60 - i * 3} ${50 + i * 5},${75 - i * 2} T${90 + i * 5},${70 - i * 2}`}
                    stroke="url(#waveGradient1)"
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.6"
                    className="animate-pulse"
                    style={{ animationDelay: `${delay}s` }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;