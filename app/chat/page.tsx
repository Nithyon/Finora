'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 Hey! I'm your Finora Financial Assistant!\n\nI'm here to help you understand money and make smarter financial decisions.\n\n💬 You can ask me about:\n• How to create a budget\n• Understanding spending (needs vs wants)\n• How much money to save\n• Setting financial goals\n• Building an emergency fund\n• Money-saving tips\n• And much more!\n\nJust ask me anything about your finances, and I'll explain it in simple terms! 😊`,
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
      // Simulate AI response with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userInput = input.toLowerCase();
      let response = '';

      // Smart responses with explanations
      if (userInput.includes('current budget') || userInput.includes('how much can i spend') || userInput.includes('$10k') || userInput.includes('$10000') || (userInput.includes('have') && userInput.includes('spend'))) {
        response = `💰 Your Current Budget Breakdown:\n\nIf you have $10,000 in your bank account, here's how much you should ideally allocate:\n\n📍 Monthly Spending Plan:\n• Needs (50%): $5,000 - for essential expenses\n• Wants (30%): $3,000 - for fun and entertainment  \n• Savings (20%): $2,000 - for emergencies and goals\n\n🎯 This means:\n• You can safely spend $8,000/month\n• Keep $2,000 for emergencies\n\n💡 Pro tip: Emergency fund should cover 3-6 months of living expenses!`;
      } else if (userInput.includes('budget')) {
        response = `📊 Let me explain your budget:\n\nYour monthly budget is the total amount you plan to spend each month. It's like your spending plan!\n\n💡 Smart budgeting follows the 50/30/20 rule:\n• 50% for NEEDS (housing, food, utilities)\n• 30% for WANTS (entertainment, dining out)\n• 20% for SAVINGS & DEBT\n\nFor example, if you make $5,000/month:\n• Needs: $2,500\n• Wants: $1,500\n• Savings: $1,000\n\n✅ This helps you balance spending with saving for the future!`;
      } else if (userInput.includes('how much should i save')) {
        response = `🏦 How Much Should You Save?\n\nGreat question! Here's the simple answer:\n\n📈 The 50/30/20 Rule:\n• SAVE 20% of your income every month\n\nExample:\n• If you earn $5,000/month → Save $1,000/month\n• If you earn $10,000/month → Save $2,000/month\n\n🎯 Emergency Fund Goal:\n• Aim to save 3-6 months of living expenses\n• This protects you from unexpected situations\n\n✨ Benefits of consistent saving:\n• Financial security & peace of mind\n• Reach your goals faster (vacation, car, house)\n• Less stress about money\n• Build wealth over time\n\nStart small if needed - even $100/month counts!`;
      } else if (userInput.includes('spending')) {
        response = `📊 Understanding Your Spending:\n\nSpending is money you use to buy things or pay for services.\n\n💭 Types of Spending:\n\n1️⃣ NEEDS (50%) - Essential & necessary:\n   • Rent/Mortgage\n   • Groceries & food\n   • Utilities (electricity, water)\n   • Transportation\n   • Insurance\n\n2️⃣ WANTS (30%) - Fun & enjoyable:\n   • Dining out\n   • Movies & entertainment\n   • Hobbies\n   • Shopping\n   • Subscriptions\n\n3️⃣ SAVINGS & DEBT (20%):\n   • Emergency fund\n   • Debt payments\n   • Investments\n\n💡 Track your spending to see where your money goes!`;
      } else if (userInput.includes('goal') || userInput.includes('target')) {
        response = `🎯 How to Set Financial Goals:\n\nFinancial goals are things you want to achieve with your money.\n\n📍 Examples of Good Goals:\n\nShort-term (1-12 months):\n• Save $2,000 for vacation\n• Build $1,000 emergency fund\n• Pay off small debt\n\nMedium-term (1-5 years):\n• Save $15,000 for car down payment\n• Build $10,000 emergency fund\n• Start investing\n\nLong-term (5+ years):\n• Save for house down payment\n• Retirement planning\n• Build $100,000+ in savings\n\n✅ How to achieve goals:\n1. Be specific about the amount\n2. Set a deadline\n3. Break it into monthly steps\n4. Track your progress\n5. Celebrate milestones!\n\nFor example: "I want to save $5,000 in 12 months" = $417/month`;
      } else if (userInput.includes('save') || userInput.includes('save money')) {
        response = `💡 Money Saving Tips:\n\nHere are simple ways to save more money:\n\n🎯 Easy Actions:\n1. Track every expense - see where money goes\n2. Use the 50/30/20 budget rule\n3. Cut unnecessary subscriptions\n4. Cook at home instead of dining out\n5. Use public transport or carpool\n6. Set up automatic savings transfers\n7. Avoid impulse purchases - wait 24 hours\n8. Use cashback apps and rewards programs\n\n💪 Bigger Changes:\n• Find a side hustle for extra income\n• Reduce housing costs if possible\n• Switch to cheaper insurance\n• Build passive income streams\n\n🚀 Pro Strategy:\n"Pay yourself first" - Move 20% of your income to savings BEFORE spending on wants!\n\nStart with ONE action this week. Small steps = big results! 💰`;
      } else if (userInput.includes('emergency fund')) {
        response = `🚨 Emergency Fund - Your Financial Safety Net:\n\nWhat is it?\nMoney set aside for unexpected expenses like medical bills, car repairs, or job loss.\n\n💰 How Much to Save:\n• Starter goal: $1,000 (first 3 months)\n• Basic: $3,000-$5,000 (3 months living expenses)\n• Ideal: $10,000-$20,000 (6 months living expenses)\n\n📊 Example:\nIf your monthly expenses are $2,000:\n• Beginner target: $6,000\n• Complete target: $12,000\n\n✅ Why it matters:\n• Avoid going into debt during emergencies\n• Sleep better at night knowing you're prepared\n• Freedom to take risks (job change, education)\n• Don't need to borrow from family\n\n🎯 How to Build It:\n• Start with $50-100/month\n• When it reaches $1,000, celebrate!\n• Keep building to 3-6 months expenses\n• Keep it in a separate savings account\n\nThis is your most important safety cushion! �️`;
      } else if (userInput.includes('hello') || userInput.includes('hi')) {
        response = 'Hey there! 👋\n\nI\'m your Finora Financial Assistant. I\'m here to help you understand money better!\n\n💬 You can ask me about:\n• How to budget your money\n• Understanding spending (needs vs wants)\n• How much to save\n• Setting financial goals\n• Emergency funds\n• Money-saving tips\n• And more!\n\nWhat would you like to learn about? 😊';
      } else {
        response = `💡 That's a great question!\n\nLet me help you understand finances better. Here are some popular topics:\n\n📌 Basic Concepts:\n• "What is a budget?"\n• "How much should I save?"\n• "What is an emergency fund?"\n\n💰 Spending & Money:\n• "How can I save more money?"\n• "What are needs vs wants?"\n• "How much can I spend?"\n\n🎯 Planning:\n• "How do I set financial goals?"\n• "Should I invest?"\n• "How to pay off debt?"\n\nTry asking any of these, or tell me about your specific situation!`;
      }

      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Could you try asking again in a different way?',
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
