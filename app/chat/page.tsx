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

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();

    // MOST SPECIFIC MATCHES FIRST (longer/more specific queries)
    if ((input.includes('have') && input.includes('$10')) || input.includes('10k') || input.includes('10000')) {
      if (input.includes('spend') || input.includes('budget') || input.includes('can i') || input.includes('allocation')) {
        return `💰 Your $10,000 Budget Breakdown:\n\nGreat question! Here's how you should ideally use $10,000:\n\n📍 Smart Allocation (50/30/20 Rule):\n• Needs (50%): $5,000 - Essential expenses\n  └ Rent, utilities, groceries, insurance\n• Wants (30%): $3,000 - Entertainment & fun\n  └ Dining out, hobbies, shopping\n• Savings (20%): $2,000 - Emergency fund\n  └ For unexpected situations\n\n🎯 Monthly Spending Plan:\n• You can spend: $5,000 (needs) + $3,000 (wants) = $8,000/month\n• Keep in emergency fund: $2,000\n\n💡 Why this matters:\n✅ Needs are covered (you won't go hungry)\n✅ You get to enjoy life (wants are 30%)\n✅ You're protected if something breaks (emergency fund)\n✅ This is the balanced approach to money\n\n🚀 Pro tip: This 50/30/20 rule works at ANY income level!`;
      }
    }

    if (input.includes('how much can i spend') || input.includes('can i afford')) {
      return `💰 How Much Can You Spend?\n\nGreat question! Here's the simple answer:\n\n📊 Use the 50/30/20 Rule:\nOut of every dollar you earn:\n• 50¢ goes to NEEDS (housing, food, utilities)\n• 30¢ goes to WANTS (fun, entertainment, dining out)\n• 20¢ goes to SAVINGS (emergency fund, investments)\n\n💡 Example with $5,000/month income:\n• Needs budget: $2,500/month\n• Wants budget: $1,500/month ← This is what you can "freely" spend\n• Savings: $1,000/month\n\nTotal you can comfortably spend: $4,000/month\n\n✅ Benefits:\n• You have money for fun\n• Bills are covered\n• You're building savings\n• No stress about money\n\n🎯 Action: Calculate YOUR number based on your income!`;
    }

    if (input.includes('budget')) {
      return `📊 What is a Budget? (Simple Explanation)\n\nA budget is just a PLAN for your money. Like a roadmap!\n\n💭 Think of it like this:\nImagine you have $100 to spend. A budget helps you decide:\n• $50 for food (NEEDS - essential)\n• $30 for movies (WANTS - fun)\n• $20 in savings (FUTURE - safety net)\n\n📌 The 50/30/20 Rule (Best Method):\n• 50% for NEEDS: Rent, food, utilities, transportation, insurance\n• 30% for WANTS: Entertainment, dining out, hobbies, shopping\n• 20% for SAVINGS: Emergency fund, debt payment, investments\n\n💡 Real Example ($5,000/month salary):\n• NEEDS: $2,500 (housing, groceries)\n• WANTS: $1,500 (Netflix, dining out, fun)\n• SAVINGS: $1,000 (emergency fund, investments)\n\n✅ Why budgeting works:\n✓ You know where your money goes\n✓ You can enjoy life without guilt\n✓ You'll have emergency money\n✓ You'll reach your financial goals faster\n✓ Less financial stress!\n\n🎯 Start today: Track what you spent yesterday!`;
    }

    if (input.includes('how much should i save') || input.includes('how much to save')) {
      return `🏦 How Much Should You Save?\n\nSimple answer: Save 20% of everything you earn!\n\n📈 The Rule:\nFor every $100 you make → Save $20\n\n💡 Examples:\n• If you earn $1,000/month → Save $200/month\n• If you earn $5,000/month → Save $1,000/month\n• If you earn $10,000/month → Save $2,000/month\n\n🎯 Why 20%?\nIt's enough to:\n✅ Build an emergency fund\n✅ Handle unexpected expenses\n✅ Reach your goals (vacation, car, house)\n✅ Still have money for fun NOW\n\n💰 Emergency Fund Targets:\n1. First goal: Save $1,000 (covers small emergencies)\n2. Next goal: 3 months of living expenses\n3. Ultimate goal: 6 months of living expenses\n\n📊 Example:\nIf your monthly expenses are $2,000:\n• 3-month fund: $6,000\n• 6-month fund: $12,000\n\n🚀 How to save:\n1. Automate it! Set savings transfer on payday\n2. Start small if needed ($50/month is great!)\n3. Increase by 1% each month\n4. Celebrate milestones!\n\n💡 Pro tip: "Pay yourself first" - Save BEFORE spending!`;
    }

    if (input.includes('spend') && !input.includes('how much')) {
      return `💳 Understanding Spending\n\nSpending is using money to buy things or pay for services.\n\n📍 Two Types of Spending:\n\n1️⃣ NEEDS (50% of your budget)\nThings you MUST have:\n• Rent or mortgage\n• Groceries & food\n• Utilities (electricity, water, internet)\n• Transportation (car, bus, bike)\n• Insurance\n• Healthcare\n• Phone\n→ Without these, life becomes very difficult\n\n2️⃣ WANTS (30% of your budget)\nThings you ENJOY but don't need:\n• Dining out at restaurants\n• Netflix, Spotify, subscriptions\n• Shopping clothes, gadgets\n• Movies, concerts, entertainment\n• Hobbies (gaming, sports, travel)\n• Coffee at fancy cafes\n→ These make life enjoyable!\n\n💡 Key Insight:\nMost people struggle because they spend 80% on wants and only 20% on needs. REVERSE this!\n\n✅ Smart Spending Strategy:\n1. List ALL your expenses\n2. Mark each as NEED or WANT\n3. See your real spending\n4. Make adjustments\n5. Save the difference!\n\n🎯 Challenge: Track your spending for 1 week!`;
    }

    if (input.includes('goal') || input.includes('target')) {
      return `🎯 How to Set Financial Goals\n\nFinancial goals are things you want to ACHIEVE with money.\n\n📍 Types of Goals:\n\n⏰ SHORT-TERM (1-12 months):\n• Save $500 for new phone\n• Build $1,000 emergency fund\n• Pay off credit card\n• Save for birthday gift\n→ You can do these soon!\n\n📅 MEDIUM-TERM (1-5 years):\n• Save $15,000 for car down payment\n• Save $10,000 for vacation\n• Build $10,000 emergency fund\n• Pay off student debt\n→ Takes time but very achievable\n\n🏠 LONG-TERM (5+ years):\n• Save for house down payment\n• Retirement savings\n• College fund for kids\n• Build $100,000+ in investments\n→ Start now, benefit later\n\n✅ How to Make Goals Work:\n1. Be SPECIFIC about the amount\n   ❌ Bad: "I want to save money"\n   ✅ Good: "I want to save $5,000"\n\n2. Set a DEADLINE\n   ❌ Bad: "Sometime"\n   ✅ Good: "By December 2025"\n\n3. Break it into MONTHLY STEPS\n   Example: $5,000 in 12 months = $417/month\n\n4. AUTOMATE the savings\n   Set it and forget it!\n\n5. TRACK your progress\n   Watch the number grow! 📈\n\n6. CELEBRATE milestones\n   Save $1,000? Celebrate! 🎉\n\n🚀 Your First Goal:\nWhat's something you want in the next 3 months?`;
    }

    if (input.includes('emergency fund') || input.includes('emergency')) {
      return `🚨 Emergency Fund - Your Financial Safety Net\n\nWhat is it?\nMoney you set aside for unexpected situations when you NEED cash immediately.\n\n💡 Real Examples:\n• Car breaks down: $1,500 repair needed\n• Medical emergency: Hospital bills\n• Job loss: You need money while finding new job\n• Home repair: Roof leak, water heater breaks\n• Pet emergency: Vet bills\n\n💰 How Much to Save:\n\nPhase 1 (STARTER):\n• Target: $1,000\n• Why: Covers 80% of emergencies\n• Timeline: 2-3 months\n\nPhase 2 (BASIC):\n• Target: $3,000-$5,000\n• Why: Covers 3 months of living expenses\n• Timeline: 6-12 months\n\nPhase 3 (COMPLETE):\n• Target: $10,000-$20,000\n• Why: Covers 6 months of living expenses\n• Timeline: 1-2 years\n\n📊 Calculate YOUR target:\nMonthly expenses × 3-6 months = Your goal\n\n✅ Why it's CRITICAL:\n✓ Avoid credit card debt in emergency\n✓ Sleep better at night\n✓ Can take risks (job change, education)\n✓ Don't burden family/friends\n✓ Handle life's surprises\n\n🎯 How to Build It:\n1. Open a separate savings account\n2. Start with ANY amount ($50/month is great!)\n3. Don't touch it unless REAL emergency\n4. Celebrate reaching $1,000! 🎉\n5. Keep growing it\n\n💡 Pro tip: Put it in a separate bank so you won't spend it!`;
    }

    if (input.includes('save') || input.includes('saving')) {
      return `💡 Money Saving Tips - Simple Ways to Keep More Money\n\n🎯 EASY ACTIONS (Start Today):\n1. Track your spending for 1 week\n   → See where money actually goes\n\n2. Cancel subscriptions you don't use\n   → That unused gym? $30 saved!\n\n3. Use public transport instead of taxi\n   → Save $100-200/month\n\n4. Cook at home instead of dining out\n   → Restaurant meal: $15 vs Home meal: $3\n\n5. Use cashback apps\n   → Get 1-2% back on purchases\n\n6. Shop with a list at grocery store\n   → Avoid impulse buying\n\n7. Wait 24 hours before buying\n   → Most impulse purchases are forgotten!\n\n8. Automate savings on payday\n   → Money moves to savings FIRST\n\n💪 BIGGER CHANGES (More Savings):\n1. Find a side hustle\n   → Extra $200-500/month\n\n2. Reduce housing costs\n   → Roommate? Save $200-500/month\n\n3. Switch to cheaper insurance\n   → Compare car/health insurance\n\n4. Cut expensive subscriptions\n   → Premium services you don't need\n\n5. Learn to DIY\n   → Haircut at home, nail care, etc.\n\n6. Build passive income\n   → Money while you sleep!\n\n🚀 THE ULTIMATE STRATEGY:\n"Pay Yourself First"\n→ On payday, move 20% to savings FIRST\n→ Then spend the rest\n→ Works 100% better than trying to save leftover!\n\n📈 The Impact:\n• Saving $100/month = $1,200/year\n• Saving $300/month = $3,600/year\n• Saving $500/month = $6,000/year\n\n🎯 Start with ONE thing this week!`;
    }

    if (input.includes('hello') || input.includes('hi')) {
      return `👋 Hey there!\n\nI'm your Finora Financial Assistant!\n\n💬 I can help you understand:\n• What is budgeting?\n• How much should I save?\n• What are needs vs wants?\n• How much can I spend?\n• How to set financial goals?\n• Emergency funds explained\n• Money-saving tips\n• And more!\n\n💡 Try asking me:\n• "What is a budget?"\n• "I have $10k, how much can I spend?"\n• "How much should I save?"\n• "How do I set goals?"\n\nWhat would you like to learn? 😊`;
    }

    // DEFAULT: suggest topics
    return `💡 Great question! I'm here to help.\n\n📚 Popular topics I can explain simply:\n\n💰 MONEY BASICS:\n• "What is a budget?"\n• "How much should I save?"\n• "How much can I spend?"\n• "What is an emergency fund?"\n\n🛍️ SPENDING & SAVING:\n• "What are needs vs wants?"\n• "How can I save money?"\n• "Tips to spend less?"\n\n🎯 PLANNING:\n• "How do I set financial goals?"\n• "I have $10k, what should I do?"\n• "How to build emergency fund?"\n\n💡 Try asking any of these in your own words!`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = generateResponse(input);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Could you try again?',
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
