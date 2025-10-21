'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthProtected } from '@/app/hooks/useAuthProtected';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  useAuthProtected();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! 👋 I&apos;m your Finora financial assistant. Ask me anything about your finances, budgeting tips, spending insights, or financial goals!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulate AI response (backend not connected in demo)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock responses based on common questions
      const userInput = input.toLowerCase();
      let response = '';

      if (userInput.includes('budget')) {
        response = 'Your current budget follows the 50/30/20 rule:\n• Needs: 50% ($750)\n• Wants: 30% ($450)\n• Savings: 20% ($300)\n\nYou&apos;re tracking well! Keep it up! 💪';
      } else if (userInput.includes('spending')) {
        response = 'Your top spending categories this month:\n• Groceries: 35%\n• Entertainment: 25%\n• Transport: 20%\n• Utilities: 20%\n\nTip: Consider reducing entertainment spending to save more! 🎯';
      } else if (userInput.includes('goal') || userInput.includes('target')) {
        response = 'Great goals! Your current progress:\n• Emergency Fund: 50% complete ($5,000 of $10,000)\n• Vacation: 40% complete ($800 of $2,000)\n• Car Down Payment: 45% complete ($4,500 of $10,000)\n\nKeep going! 🚀';
      } else if (userInput.includes('save') || userInput.includes('save money')) {
        response = 'Here are some tips to save more money:\n1. Track every expense\n2. Use the 50/30/20 rule\n3. Automate your savings\n4. Set specific goals\n5. Review monthly\n\nWould you like tips on any of these? 💡';
      } else if (userInput.includes('hello') || userInput.includes('hi')) {
        response = 'Hey there! 👋 How can I help with your finances today? You can ask me about budgeting, spending analysis, goals, or financial advice!';
      } else {
        response = 'That&apos;s a great question! Based on your current financial profile:\n\n• Total Net Worth: $14,850.50\n• Monthly Income: ~$4,500\n• Monthly Expenses: ~$108.81\n• Savings Rate: 97.6%\n\nYou&apos;re doing amazing! Keep maintaining this excellent savings discipline. 🎉';
      }

      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again!',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-lg font-bold text-white flex-1">Finora Assistant</h1>
          <span className="text-sm text-[#10b981]">● Online</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-24 pt-4 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[#0066cc] text-white'
                    : 'bg-[#141829] border border-[#2d3748] text-[#e2e8f0]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#141829] border border-[#2d3748] px-4 py-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#0066cc] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#0066cc] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#0066cc] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#141829] border border-[#2d3748] rounded-lg text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
