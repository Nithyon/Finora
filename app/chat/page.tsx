'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface NavigationLink {
  text: string;
  path: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  link?: NavigationLink;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 Hey! I'm Your Finora Support Assistant!\n\nI'm here 24/7 to help you navigate the app and understand money management.\n\n🎯 WHAT I CAN DO:\n\n📊 Help with Budgeting\n� Guide you through Spending tracking\n🏦 Explain Virtual Accounts\n🎯 Help you Set Goals\n💡 Share Money-Saving Tips\n📈 Explain Analytics & Trends\n🚨 Explain Emergency Funds\n🔍 Answer any question about Finora\n\n💬 JUST ASK ME ANYTHING!\n\nNo matter how you phrase it:\n• \"How do I track spending?\"\n• \"Where to add transaction?\"\n• \"Budget help needed\"\n• \"Emergency fund?\"\n• \"Goal setting?\"\n• \"Save money tips?\"\n• \"Create account?\"\n• Or literally any question!\n\n🚀 I'll understand and guide you through the app, step by step!\n\nWhat do you need help with? 😊`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userInput: string): { content: string; link?: NavigationLink } => {
    const input = userInput.toLowerCase().trim();

    // KEYWORD MATCHING - INTELLIGENT SUPPORT ASSISTANT
    // This handles questions by understanding keywords regardless of how they're phrased
    
    // SPENDING & TRACKING KEYWORDS
    if (input.match(/spend|spending|expense|track|transaction|add|record|log|how much|money go/)) {
      if (input.match(/where|track|add|record|log|see|view|spending/)) {
        return {
          content: `📊 Track Your Spending - Complete Guide\n\n🎯 QUICK START:\n1. Click "Add Transaction" button\n2. Enter amount spent\n3. Pick category (Food, Transport, etc.)\n4. Save - Done!\n\n📍 VIEW YOUR SPENDING:\n• Go to Spending page\n• See all expenses by category\n• View breakdown (% for each category)\n• Compare vs budget\n• Get alerts if overspending\n\n💡 PRO TIPS:\n✓ Add immediately - don't wait\n✓ Choose accurate categories\n✓ Review weekly for patterns\n✓ Set budget limits per category\n✓ Use categories for planning\n\n🔍 FEATURES:\n• Filter by account type\n• See spending trends\n• Budget vs actual comparison\n• Category breakdown\n• Spending velocity alerts\n\n📌 REMEMBER:\n→ Every transaction = Better insights\n→ More data = Better budgeting\n→ Better budgeting = More money saved!`,
          link: { text: '💳 Add Transaction Now', path: '/add-transaction' }
        };
      }
      
      if (input.match(/budget|allocation|spend|how much/)) {
        return {
          content: `💰 Budget Planning - The 50/30/20 Rule\n\n📊 SIMPLE BREAKDOWN:\nFor every ₹100 you earn:\n• ₹50 → NEEDS (house, food, bills)\n• ₹30 → WANTS (fun, entertainment)\n• ₹20 → SAVINGS (emergency fund)\n\n💡 EXAMPLE - ₹50,000/month:\n• Needs: ₹25,000 (housing, groceries)\n• Wants: ₹15,000 (dining, hobbies, Netflix)\n• Savings: ₹10,000 (emergency fund)\n\n🎯 YOUR MONTHLY SPENDING:\n✓ You can spend: ₹40,000\n✓ Must save: ₹10,000\n✓ You're balanced and safe\n\n✅ WHY THIS WORKS:\n• Bills are always covered\n• You have fun money\n• Building emergency fund\n• Stress-free finances\n\n🚀 NEXT STEPS:\n1. Calculate your numbers\n2. Set up spending limits\n3. Track actual spending\n4. Adjust as needed\n5. Review monthly`,
          link: { text: '📊 Personalize Your Plan', path: '/personalize-plan' }
        };
      }
    }

    // GOALS & SAVINGS KEYWORDS
    if (input.match(/goal|target|save|savings|future|objective|plan|want|dream/)) {
      if (input.match(/set|create|make|how|build/)) {
        return {
          content: `🎯 Goal Setting - Achieve Your Dreams\n\n💭 WHAT ARE GOALS?\nThings you want to achieve with money:\n• Short: Holiday (1-3 months)\n• Medium: Car down payment (1 year)\n• Long: House, retirement (5+ years)\n\n📝 HOW TO SET GOALS:\n1. Pick specific amount (₹5,000, ₹50,000)\n2. Choose target date (Dec 2025)\n3. Break into monthly steps\n4. Automate the savings\n5. Track your progress\n\n💡 GOAL EXAMPLES:\n✓ Emergency Fund: ₹10,000 (6 months)\n✓ Vacation: ₹50,000 (12 months)\n✓ New Device: ₹30,000 (3 months)\n✓ Career Upgrade: ₹20,000 (6 months)\n\n📊 PROGRESS TRACKING:\n• Monthly check-ins\n• Watch number grow\n• Stay motivated\n• Celebrate milestones\n\n🚀 PRO TIP:\n\"Pay yourself first\" → Save on payday BEFORE spending!\n\n⏰ TIMELINE:\n• Month 1-2: Set goals + start saving\n• Month 3: Review progress\n• Month 6: Celebrate hitting 50%!\n• Year 1: GOAL ACHIEVED! 🎉`,
          link: { text: '🎯 Set Your Goals', path: '/reflect' }
        };
      }
    }

    // ACCOUNTS & ORGANIZATION KEYWORDS
    if (input.match(/account|virtual|bank|organize|separate|divide|deposit|withdraw/)) {
      if (input.match(/create|make|setup|account|virtual/)) {
        return {
          content: `🏦 Virtual Accounts - Organize Your Money\n\n💡 WHAT ARE THEY?\nSeparate "piggy banks" in Finora for different purposes:\n• Savings Account\n• Emergency Fund\n• Vacation Fund\n• Investment Account\n• Checking Account\n\n🎯 WHY USE THEM?\n✓ Money stays organized\n✓ Harder to accidentally spend\n✓ Track different goals easily\n✓ See account balances at glance\n✓ Better money management\n\n📌 HOW TO CREATE:\n1. Go to Accounts page\n2. Click \"Create New Account\"\n3. Name it (e.g., \"Holiday Fund\")\n4. Add starting balance\n5. Done!\n\n💰 ACCOUNT EXAMPLES:\n• Emergency Fund: ₹1,000 base\n• Vacation: ₹0 (save ₹500/month)\n• Gadgets: ₹2,000 (save for tech)\n• Investments: ₹5,000 (grow money)\n• Current: ₹10,000 (daily spending)\n\n🔄 OPERATIONS:\n✓ Deposit: Add money to account\n✓ Withdraw: Take money out\n✓ Transfer: Move between accounts\n✓ View: Check balance anytime\n\n🚀 START TODAY:\nCreate your first account now!`,
          link: { text: '🏦 Go to Accounts', path: '/accounts' }
        };
      }
    }

    // FINANCIAL CONCEPTS KEYWORDS
    if (input.match(/emergency|fund|crisis|unexpected|problem|broke|need help/)) {
      return {
        content: `🚨 Emergency Fund - Your Financial Safety Net\n\n💭 WHAT IS IT?\nMoney saved for unexpected situations:\n• Car breaks down\n• Medical emergency\n• Job loss\n• Home repair\n• Pet emergency\n\n📊 HOW MUCH TO SAVE:\n\nPHASE 1 (STARTER):\n• Goal: ₹1,000\n• Covers: 80% of emergencies\n• Timeline: 2-3 months\n\nPHASE 2 (GOOD):\n• Goal: ₹3,000-₹5,000\n• Covers: 3 months expenses\n• Timeline: 6 months\n\nPHASE 3 (EXCELLENT):\n• Goal: ₹10,000-₹20,000\n• Covers: 6 months expenses\n• Timeline: 1-2 years\n\n✅ WHY CRITICAL:\n✓ Avoid credit card debt\n✓ Sleep better at night\n✓ Can handle surprises\n✓ Don't burden family\n✓ Peace of mind\n\n🚀 START NOW:\n1. Open separate account\n2. Start with ₹50-₹100\n3. Add monthly\n4. Don't touch it!\n5. Watch it grow`,
        link: { text: '🏦 Create Emergency Fund', path: '/accounts' }
      };
    }

    // APP NAVIGATION KEYWORDS
    if (input.match(/how do i|how to|help|guide|tutorial|feature|show me|what is/)) {
      if (input.match(/home|start|beginning|dashboard|overview/)) {
        return {
          content: `🏠 Finora Home - Your Financial Dashboard\n\n👋 WELCOME!\nThis is your main hub for money management.\n\n🎯 MAIN FEATURES:\n\n📊 PERSONALIZE YOUR PLAN\n→ Set income & expenses\n→ Define budget limits\n→ Set financial goals\n→ Get tailored advice\n\n💳 SPENDING\n→ Add transactions\n→ Track expenses\n→ View categories\n→ Compare vs budget\n→ Get alerts\n\n📈 ANALYTICS\n→ See spending trends\n→ View charts & graphs\n→ Identify patterns\n→ Plan better\n\n🏦 ACCOUNTS\n→ Create virtual accounts\n→ Organize money\n→ Track balances\n→ Transfer between accounts\n\n🎯 GOALS / REFLECT\n→ Set financial goals\n→ Track progress\n→ Stay motivated\n→ Celebrate wins\n\n💬 CHAT (RIGHT NOW)\n→ Get instant help\n→ Ask anything\n→ Navigate the app\n→ Learn about money\n\n🚀 WHERE TO START:\n1. Set up your plan\n2. Add first transaction\n3. View spending\n4. Set a goal\n5. Use daily!`,
          link: { text: '📊 Go Home', path: '/' }
        };
      }
    }

    // MOST SPECIFIC MATCHES FIRST (longer/more specific queries)
    if ((input.includes('have') && (input.includes('₹1') || input.includes('1 lakh') || input.includes('50000'))) || input.includes('50k') || input.includes('1l')) {
      if (input.includes('spend') || input.includes('budget') || input.includes('can i') || input.includes('allocation')) {
        return {
          content: `💰 Your ₹50,000 Budget Breakdown:\n\nGreat question! Here's how you should ideally use ₹50,000:\n\n📍 Smart Allocation (50/30/20 Rule):\n• Needs (50%): ₹25,000 - Essential expenses\n  └ Rent, utilities, groceries, insurance\n• Wants (30%): ₹15,000 - Entertainment & fun\n  └ Dining out, hobbies, shopping\n• Savings (20%): ₹10,000 - Emergency fund\n  └ For unexpected situations\n\n🎯 Monthly Spending Plan:\n• You can spend: ₹25,000 (needs) + ₹15,000 (wants) = ₹40,000/month\n• Keep in emergency fund: ₹10,000\n\n💡 Why this matters:\n✅ Needs are covered (you won't go hungry)\n✅ You get to enjoy life (wants are 30%)\n✅ You're protected if something breaks (emergency fund)\n✅ This is the balanced approach to money\n\n🚀 Pro tip: This 50/30/20 rule works at ANY income level!`,
          link: { text: '📊 Personalize Your Plan', path: '/personalize-plan' }
        };
      }
    }

    if (input.includes('how much can i spend') || input.includes('can i afford')) {
      return {
        content: `💰 How Much Can You Spend?\n\nGreat question! Here's the simple answer:\n\n📊 Use the 50/30/20 Rule:\nOut of every ₹100 you earn:\n• ₹50 goes to NEEDS (housing, food, utilities)\n• ₹30 goes to WANTS (fun, entertainment, dining out)\n• ₹20 goes to SAVINGS (emergency fund, investments)\n\n💡 Example with ₹50,000/month income:\n• Needs budget: ₹25,000/month\n• Wants budget: ₹15,000/month ← This is what you can "freely" spend\n• Savings: ₹10,000/month\n\nTotal you can comfortably spend: ₹40,000/month\n\n✅ Benefits:\n• You have money for fun\n• Bills are covered\n• You're building savings\n• No stress about money\n\n🎯 Action: Calculate YOUR number based on your income!`,
        link: { text: '📊 Personalize Your Plan', path: '/personalize-plan' }
      };
    }

    // Check for "my budget" or "current budget" variations
    if ((input.includes('my') || input.includes('current') || input.includes('my own')) && input.includes('budget')) {
      return {
        content: `📊 Your Budget - Let's Create One!\n\nGreat question! To see and manage YOUR budget, you need to:\n\n1️⃣ SET UP YOUR BUDGET:\nGo to "Personalize Your Plan" and tell us:\n• How much money you make per month\n• Your main expenses\n• Your financial goals\n\n2️⃣ USE THE 50/30/20 RULE:\nWe'll automatically calculate:\n• 50% for NEEDS (rent, food, utilities)\n• 30% for WANTS (fun, entertainment)\n• 20% for SAVINGS (emergency fund)\n\n3️⃣ TRACK YOUR SPENDING:\nAfter setting your budget:\n• Go to "Spending" to see where your money goes\n• Add transactions as you spend\n• See real-time budget vs actual spending\n• Get alerts if you're overspending\n\n4️⃣ MANAGE YOUR BUDGET:\n• Edit categories anytime\n• Adjust spending limits\n• Set savings goals\n• View spending trends\n\n💡 Example:\nIf you earn ₹50,000/month:\n• NEEDS budget: ₹25,000\n• WANTS budget: ₹15,000\n• SAVINGS goal: ₹10,000\n\n🚀 Let's get started!`,
        link: { text: '📊 Personalize Your Plan', path: '/personalize-plan' }
      };
    }

    if (input.includes('budget')) {
      return {
        content: `📊 What is a Budget? (Simple Explanation)\n\nA budget is just a PLAN for your money. Like a roadmap!\n\n💭 Think of it like this:\nImagine you have ₹1,000 to spend. A budget helps you decide:\n• ₹500 for food (NEEDS - essential)\n• ₹300 for movies (WANTS - fun)\n• ₹200 in savings (FUTURE - safety net)\n\n📌 The 50/30/20 Rule (Best Method):\n• 50% for NEEDS: Rent, food, utilities, transportation, insurance\n• 30% for WANTS: Entertainment, dining out, hobbies, shopping\n• 20% for SAVINGS: Emergency fund, debt payment, investments\n\n💡 Real Example (₹50,000/month salary):\n• NEEDS: ₹25,000 (housing, groceries)\n• WANTS: ₹15,000 (Netflix, dining out, fun)\n• SAVINGS: ₹10,000 (emergency fund, investments)\n\n✅ Why budgeting works:\n✓ You know where your money goes\n✓ You can enjoy life without guilt\n✓ You'll have emergency money\n✓ You'll reach your financial goals faster\n✓ Less financial stress!\n\n🎯 Start today: Track what you spent yesterday!`
      };
    }

    if (input.includes('how much should i save') || input.includes('how much to save')) {
      return {
        content: `🏦 How Much Should You Save?\n\nSimple answer: Save 20% of everything you earn!\n\n📈 The Rule:\nFor every ₹100 you make → Save ₹20\n\n💡 Examples:\n• If you earn ₹10,000/month → Save ₹2,000/month\n• If you earn ₹50,000/month → Save ₹10,000/month\n• If you earn ₹1,00,000/month → Save ₹20,000/month\n\n🎯 Why 20%?\nIt's enough to:\n✅ Build an emergency fund\n✅ Handle unexpected expenses\n✅ Reach your goals (vacation, car, house)\n✅ Still have money for fun NOW\n\n💰 Emergency Fund Targets:\n1. First goal: Save ₹10,000 (covers small emergencies)\n2. Next goal: 3 months of living expenses\n3. Ultimate goal: 6 months of living expenses\n\n📊 Example:\nIf your monthly expenses are ₹30,000:\n• 3-month fund: ₹90,000\n• 6-month fund: ₹1,80,000\n\n🚀 How to save:\n1. Automate it! Set savings transfer on payday\n2. Start small if needed (₹500/month is great!)\n3. Increase by 1% each month\n4. Celebrate milestones!\n\n💡 Pro tip: "Pay yourself first" - Save BEFORE spending!`,
        link: { text: '📊 Personalize Your Plan', path: '/personalize-plan' }
      };
    }

    if (input.includes('spend') && !input.includes('how much')) {
      return {
        content: `💳 Understanding Spending\n\nSpending is using money to buy things or pay for services.\n\n📍 Two Types of Spending:\n\n1️⃣ NEEDS (50% of your budget)\nThings you MUST have:\n• Rent or mortgage\n• Groceries & food\n• Utilities (electricity, water, internet)\n• Transportation (car, bus, bike)\n• Insurance\n• Healthcare\n• Phone\n→ Without these, life becomes very difficult\n\n2️⃣ WANTS (30% of your budget)\nThings you ENJOY but don't need:\n• Dining out at restaurants\n• Netflix, Spotify, subscriptions\n• Shopping clothes, gadgets\n• Movies, concerts, entertainment\n• Hobbies (gaming, sports, travel)\n• Coffee at fancy cafes\n→ These make life enjoyable!\n\n💡 Key Insight:\nMost people struggle because they spend 80% on wants and only 20% on needs. REVERSE this!\n\n✅ Smart Spending Strategy:\n1. List ALL your expenses\n2. Mark each as NEED or WANT\n3. See your real spending\n4. Make adjustments\n5. Save the difference!\n\n🎯 Challenge: Track your spending for 1 week!`,
        link: { text: '📊 View Your Spending', path: '/spending' }
      };
    }

    if (input.includes('goal') || input.includes('target')) {
      return {
        content: `🎯 How to Set Financial Goals\n\nFinancial goals are things you want to ACHIEVE with money.\n\n📍 Types of Goals:\n\n⏰ SHORT-TERM (1-12 months):\n• Save ₹500 for new phone\n• Build ₹1,000 emergency fund\n• Pay off credit card\n• Save for birthday gift\n→ You can do these soon!\n\n📅 MEDIUM-TERM (1-5 years):\n• Save ₹15,000 for car down payment\n• Save ₹10,000 for vacation\n• Build ₹10,000 emergency fund\n• Pay off student debt\n→ Takes time but very achievable\n\n🏠 LONG-TERM (5+ years):\n• Save for house down payment\n• Retirement savings\n• College fund for kids\n• Build ₹100,000+ in investments\n→ Start now, benefit later\n\n✅ How to Make Goals Work:\n1. Be SPECIFIC about the amount\n   ❌ Bad: "I want to save money"\n   ✅ Good: "I want to save ₹5,000"\n\n2. Set a DEADLINE\n   ❌ Bad: "Sometime"\n   ✅ Good: "By December 2025"\n\n3. Break it into MONTHLY STEPS\n   Example: ₹5,000 in 12 months = ₹417/month\n\n4. AUTOMATE the savings\n   Set it and forget it!\n\n5. TRACK your progress\n   Watch the number grow! 📈\n\n6. CELEBRATE milestones\n   Save ₹1,000? Celebrate! 🎉\n\n🚀 Your First Goal:\nWhat's something you want in the next 3 months?`,
        link: { text: '🎯 Set Your Goals', path: '/reflect' }
      };
    }

    if (input.includes('emergency fund') || input.includes('emergency')) {
      return {
        content: `🚨 Emergency Fund - Your Financial Safety Net\n\nWhat is it?\nMoney you set aside for unexpected situations when you NEED cash immediately.\n\n💡 Real Examples:\n• Car breaks down: ₹1,500 repair needed\n• Medical emergency: Hospital bills\n• Job loss: You need money while finding new job\n• Home repair: Roof leak, water heater breaks\n• Pet emergency: Vet bills\n\n💰 How Much to Save:\n\nPhase 1 (STARTER):\n• Target: ₹1,000\n• Why: Covers 80% of emergencies\n• Timeline: 2-3 months\n\nPhase 2 (BASIC):\n• Target: ₹3,000-₹5,000\n• Why: Covers 3 months of living expenses\n• Timeline: 6-12 months\n\nPhase 3 (COMPLETE):\n• Target: ₹10,000-₹20,000\n• Why: Covers 6 months of living expenses\n• Timeline: 1-2 years\n\n📊 Calculate YOUR target:\nMonthly expenses × 3-6 months = Your goal\n\n✅ Why it's CRITICAL:\n✓ Avoid credit card debt in emergency\n✓ Sleep better at night\n✓ Can take risks (job change, education)\n✓ Don't burden family/friends\n✓ Handle life's surprises\n\n🎯 How to Build It:\n1. Open a separate savings account\n2. Start with ANY amount (₹50/month is great!)\n3. Don't touch it unless REAL emergency\n4. Celebrate reaching ₹1,000! 🎉\n5. Keep growing it\n\n💡 Pro tip: Put it in a separate bank so you won't spend it!`,
        link: { text: '📊 Personalize Your Plan', path: '/personalize-plan' }
      };
    }

    if (input.includes('save') || input.includes('saving')) {
      return {
        content: `💡 Money Saving Tips - Simple Ways to Keep More Money\n\n🎯 EASY ACTIONS (Start Today):\n1. Track your spending for 1 week\n   → See where money actually goes\n\n2. Cancel subscriptions you don't use\n   → That unused gym? ₹30 saved!\n\n3. Use public transport instead of taxi\n   → Save ₹100-200/month\n\n4. Cook at home instead of dining out\n   → Restaurant meal: ₹15 vs Home meal: ₹3\n\n5. Use cashback apps\n   → Get 1-2% back on purchases\n\n6. Shop with a list at grocery store\n   → Avoid impulse buying\n\n7. Wait 24 hours before buying\n   → Most impulse purchases are forgotten!\n\n8. Automate savings on payday\n   → Money moves to savings FIRST\n\n💪 BIGGER CHANGES (More Savings):\n1. Find a side hustle\n   → Extra ₹200-500/month\n\n2. Reduce housing costs\n   → Roommate? Save ₹200-500/month\n\n3. Switch to cheaper insurance\n   → Compare car/health insurance\n\n4. Cut expensive subscriptions\n   → Premium services you don't need\n\n5. Learn to DIY\n   → Haircut at home, nail care, etc.\n\n6. Build passive income\n   → Money while you sleep!\n\n🚀 THE ULTIMATE STRATEGY:\n"Pay Yourself First"\n→ On payday, move 20% to savings FIRST\n→ Then spend the rest\n→ Works 100% better than trying to save leftover!\n\n📈 The Impact:\n• Saving ₹100/month = ₹1,200/year\n• Saving ₹300/month = ₹3,600/year\n• Saving ₹500/month = ₹6,000/year\n\n🎯 Start with ONE thing this week!`,
        link: { text: '📊 View Your Budget', path: '/personalize-plan' }
      };
    }

    if (input.includes('hello') || input.includes('hi')) {
      return {
        content: `👋 Hey there!\n\nI'm your Finora Financial Assistant!\n\n💬 I can help you understand:\n• What is budgeting?\n• How much should I save?\n• What are needs vs wants?\n• How much can I spend?\n• How to set financial goals?\n• Emergency funds explained\n• Money-saving tips\n• And more!\n\n💡 Try asking me:\n• "What is a budget?"\n• "I have $10k, how much can I spend?"\n• "How much should I save?"\n• "How do I set goals?"\n\nWhat would you like to learn? 😊`,
        link: { text: '🚀 Get Started', path: '/personalize-plan' }
      };
    }

    // Help with app features
    if (input.includes('how do i') || input.includes('how to') || input.includes('how can i')) {
      if (input.includes('track') || input.includes('add transaction') || input.includes('spending')) {
        return {
          content: `📊 How to Track Your Spending\n\nIt's super easy! Follow these steps:\n\n1️⃣ ADD A TRANSACTION:\n• Go to "Add Transaction"\n• Enter the amount you spent\n• Choose the category (Food, Transport, etc.)\n• Click Save\n• It automatically appears in your Spending page!\n\n2️⃣ VIEW YOUR SPENDING:\n• Go to "Spending" page\n• See all your expenses by category\n• View spending breakdown (what % each category is)\n• See budget vs actual spending\n• Get alerts if you're overspending\n\n3️⃣ FILTER BY ACCOUNT:\n• If you have virtual accounts\n• Select which account to view\n• See spending for that specific account\n\n4️⃣ TRACK TRENDS:\n• Check spending patterns\n• See which categories you spend most on\n• Plan better for next month\n\n💡 Pro tips:\n✓ Add transactions immediately (don't wait!)\n✓ Use honest category names\n✓ Review weekly to spot patterns\n✓ Set budget limits for each category\n\n🎯 Try it now!`,
          link: { text: '💳 Add Transaction', path: '/add-transaction' }
        };
      }
      if (input.includes('goal') || input.includes('target') || input.includes('plan')) {
        return {
          content: `🎯 How to Set Goals in Finora\n\nSetting and tracking goals is the secret to financial success!\n\n1️⃣ OPEN YOUR PLAN:\n• Click "Personalize Your Plan"\n• This is where you set all your goals\n\n2️⃣ SET FINANCIAL GOALS:\n• Short-term (next 3 months)\n• Medium-term (1 year)\n• Long-term (3+ years)\n\n3️⃣ DEFINE YOUR GOALS:\n• Save for vacation: ₹50,000\n• Emergency fund: ₹25,000\n• New phone: ₹15,000\n• Car down payment: ₹200,000\n\n4️⃣ TRACK PROGRESS:\n• Go to "Reflect" or "Analytics"\n• See your progress toward goals\n• Get motivated as you see numbers grow!\n\n5️⃣ REVIEW & ADJUST:\n• Check progress monthly\n• Celebrate milestones\n• Adjust goals if needed\n\n💡 Goal-Setting Tips:\n✓ Start with ONE goal\n✓ Make it specific (amount + date)\n✓ Break into monthly steps\n✓ Automate the savings\n✓ Track progress weekly\n\n🚀 What goal would you like to set?`,
          link: { text: '🎯 Set Your Goals', path: '/reflect' }
        };
      }
      if (input.includes('account') || input.includes('virtual')) {
        return {
          content: `🏦 How to Use Virtual Accounts\n\nVirtual accounts help you organize money for different purposes!\n\n1️⃣ CREATE AN ACCOUNT:\n• Go to "Accounts" page\n• Click "Create New Account"\n• Name it: Savings, Vacation, Emergency, etc.\n• Set opening balance\n• Done!\n\n2️⃣ ACCOUNT TYPES:\n• Savings Account\n• Checking Account\n• Investment Account\n• Business Account\n• Vacation Fund\n• Emergency Fund\n\n3️⃣ MANAGE YOUR ACCOUNTS:\n• Deposit: Add money to account\n• Withdraw: Take money out\n• Transfer: Move money between accounts\n• View balance anytime\n\n4️⃣ TRACK SEPARATELY:\n• Each account shows balance\n• Filter spending by account\n• See which account has most money\n• Better control of finances\n\n💡 Example Accounts:\n• Emergency Fund: ₹10,000\n• Vacation Fund: ₹5,000\n• Regular Checking: ₹15,000\n• Investment Account: ₹8,000\n\n🚀 Create your first account now!`,
          link: { text: '🏦 Manage Accounts', path: '/accounts' }
        };
      }
    }

    // MONEY SAVING KEYWORDS
    if (input.match(/save|saving|reduce|cut|cheaper|ways to save|money tips|financial/)) {
      return {
        content: `� Money Saving Tips - Keep More Money\n\n🎯 EASY ACTIONS (THIS WEEK):\n1. Track spending for 1 week\n   → See where money goes\n2. Cancel unused subscriptions\n   → Gym you don't use? ₹30 saved!\n3. Cook at home vs dining out\n   → Save ₹200-500/month\n4. Use public transport\n   → Save ₹100-200/month\n5. Wait 24 hours before buying\n   → Skip impulse purchases\n6. Use cashback apps\n   → Get 1-2% back\n\n💪 BIGGER CHANGES (SERIOUS SAVINGS):\n1. Find side gig\n   → Extra ₹200-500/month\n2. Find roommate\n   → Save ₹200-500/month\n3. Switch insurance\n   → Compare rates, save 20%\n4. Cut subscriptions\n   → Remove unused paid apps\n5. Learn DIY\n   → Haircut, nails, maintenance\n\n🚀 THE ULTIMATE STRATEGY:\n"Pay Yourself First"\n→ Save on payday BEFORE spending\n→ Even ₹100/month = ₹1,200/year\n→ Even ₹300/month = ₹3,600/year\n→ Even ₹500/month = ₹6,000/year\n\n✅ START TODAY:\nPick ONE tip and do it now!`,
        link: { text: '📊 View Spending', path: '/spending' }
      };
    }

    // ANALYTICS & INSIGHTS KEYWORDS
    if (input.match(/analytics|chart|graph|trend|insight|pattern|analysis|data|report/)) {
      return {
        content: `📈 Analytics - Understand Your Money\n\n� WHAT YOU'LL SEE:\n• Spending charts & graphs\n• Category breakdowns\n• Monthly trends\n• Spending velocity\n• Budget vs actual\n• Goal progress\n\n💡 HOW TO USE ANALYTICS:\n1. Go to Analytics page\n2. View pie chart of spending\n3. See spending trends over time\n4. Identify high-spending categories\n5. Compare to budget limits\n6. Make better decisions\n\n🎯 INSIGHTS YOU'LL GET:\n✓ Which category you spend most on\n✓ If you're on budget pace\n✓ Spending trends month to month\n✓ Where you can cut expenses\n✓ Progress toward goals\n\n📍 USE ANALYTICS TO:\n• Spot problem areas\n• Find saving opportunities\n• Track progress on goals\n• Make smart budget adjustments\n• Celebrate wins\n\n🔍 EXAMPLE INSIGHTS:\n• \"You're spending 45% on food\"\n• \"That's 5% above budget\"\n• \"Last month was ₹2,000 higher\"\n• \"You're 60% toward your goal!\"\n\n� CHECK ANALYTICS NOW:\nSee your financial picture!`,
        link: { text: '📈 View Analytics', path: '/analytics' }
      };
    }

    // GENERAL HELP - DEFAULT RESPONSE
    return {
      content: `👋 Hi! I'm Your Finora Support Assistant!\n\n💬 I CAN HELP YOU WITH:\n\n📊 BUDGETING\n→ Ask: "How to budget?", "50/30/20 rule?", "Plan budget"\n→ I'll explain and guide you\n\n💳 SPENDING\n→ Ask: "How to track spending?", "Add transaction?", "Where to track?"\n→ I'll show you exact steps\n\n🏦 ACCOUNTS\n→ Ask: "Create account?", "Virtual accounts?", "Bank?\"\n→ I'll help you organize money\n\n🎯 GOALS\n→ Ask: "Set goals?", "Plan?", "Future?"\n→ I'll help you achieve dreams\n\n🚨 EMERGENCY FUND\n→ Ask: "Emergency?", "Unexpected?", "Safety?\"\n→ I'll explain why it matters\n\n💡 SAVING MONEY\n→ Ask: "Save money?", "Tips?", "Reduce spending?\"\n→ I'll give actionable ideas\n\n📈 ANALYTICS\n→ Ask: "Charts?", "Trends?", "Insights?\"\n→ I'll explain data visualization\n\n🚀 QUICK START:\nJust ask me anything about:\n• Money management\n• Budgeting\n• Spending\n• Saving\n• Goals\n• Finora features\n\n💡 Try asking:\n\"How do I track spending?\"\n\"How to budget my money?\"\n\"Set a goal for vacation\"\n\"Emergency fund?\"\n\nWhat would you like to learn? 😊`,
      link: { text: '📊 Personalize Plan', path: '/personalize-plan' }
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = generateResponse(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        link: response.link,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-bold text-white">Finora Assistant</h1>
            <span className="text-sm text-[#10b981]">● Online</span>
          </div>
          <Link href="/settings" className="text-[#7a7d97] hover:text-white transition" title="Settings">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 h-[calc(100vh-120px)] flex flex-col">
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
                {msg.link && (
                  <Link
                    href={msg.link.path}
                    className="text-xs bg-[#0066cc] hover:bg-[#0052a3] text-white px-3 py-2 rounded mt-3 inline-block transition"
                  >
                    {msg.link.text} →
                  </Link>
                )}
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
