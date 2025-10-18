'use client';

import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const HuggingFaceChatbot = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get user's financial data for context
      const [transactionsRes, totalsRes] = await Promise.all([
        fetch('http://localhost:8000/api/transactions'),
        fetch('http://localhost:8000/api/stats/totals'),
      ]).catch(() => [null, null]);

      let context = '';
      if (transactionsRes?.ok && totalsRes?.ok) {
        const transactions = await transactionsRes.json();
        const totals = await totalsRes.json();
        context = `\n\n[User Context: Income: $${totals.income.toFixed(2)}, Expenses: $${totals.expense.toFixed(2)}, Balance: $${totals.balance.toFixed(2)}, ${transactions.length} transactions]`;
      }

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input + context }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.reply || 'I could not generate a response. Please try again.',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content:
          'Backend is not running. Start the FastAPI server at http://localhost:8000 to use the AI assistant.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-lime px-6 py-3 font-bold text-navy-dark shadow-lg hover:bg-lime/90 transition-colors"
        >
          ≡ƒÆ¼ Budget Assistant
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-80 rounded-lg border border-navy-light bg-navy-light shadow-2xl flex flex-col h-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-navy p-4">
            <h3 className="font-bold text-white">FINORA Budget AI</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              Γ£ò
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm">
                Hi! I&apos;m your budget AI assistant. Ask me about budgeting, spending, or financial tips!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-xs ${
                    msg.role === 'user'
                      ? 'bg-lime text-navy-dark'
                      : 'bg-navy text-white'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-navy text-white rounded-lg px-3 py-2">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-navy-light p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 rounded bg-navy px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="rounded bg-lime px-3 py-2 font-bold text-navy-dark hover:bg-lime/90 disabled:opacity-50 transition-colors"
            >
              ΓåÆ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
