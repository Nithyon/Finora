'use client';

import { useState, useEffect, useRef } from 'react';

interface Transaction {
  id: number;
  desc: string;
  amt: number;
  cat: string;
  date: string;
}

interface Account {
  id: number;
  name: string;
  balance: number;
}

interface UserSetupData {
  salary: string;
  checkingBalance: string;
  savingsBalance: string;
  monthlyBudget: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupMode, setSetupMode] = useState<'manual' | 'chat' | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Manual setup data
  const [userSetup, setUserSetup] = useState<UserSetupData>({
    salary: '',
    checkingBalance: '',
    savingsBalance: '',
    monthlyBudget: '',
  });

  // Chat setup
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Accounts and transactions state
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: 'Checking', balance: 0 },
    { id: 2, name: 'Savings', balance: 0 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Check if user has completed setup
  useEffect(() => {
    const setup = localStorage.getItem('finora_setup');
    if (setup) {
      const parsedSetup = JSON.parse(setup) as UserSetupData;
      setUserSetup(parsedSetup);
      setAccounts([
        { id: 1, name: 'Checking', balance: parseFloat(parsedSetup.checkingBalance) || 0 },
        { id: 2, name: 'Savings', balance: parseFloat(parsedSetup.savingsBalance) || 0 },
      ]);
      setTransactions([
        { id: 1, desc: `Monthly Salary`, amt: parseFloat(parsedSetup.salary) || 0, cat: 'Income', date: 'This month' },
      ]);
      setIsSetupComplete(true);
    } else {
      setShowSetupModal(true);
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const completeSetup = (data: UserSetupData) => {
    localStorage.setItem('finora_setup', JSON.stringify(data));
    setAccounts([
      { id: 1, name: 'Checking', balance: parseFloat(data.checkingBalance) || 0 },
      { id: 2, name: 'Savings', balance: parseFloat(data.savingsBalance) || 0 },
    ]);
    setTransactions([
      { id: 1, desc: `Monthly Salary`, amt: parseFloat(data.salary), cat: 'Income', date: 'This month' },
    ]);
    setShowSetupModal(false);
    setIsSetupComplete(true);
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSetup.salary || !userSetup.monthlyBudget) {
      alert('Please fill in salary and monthly budget');
      return;
    }
    completeSetup(userSetup);
  };

  const handleSetupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSetup(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetSetup = () => {
    localStorage.removeItem('finora_setup');
    setShowSetupModal(true);
    setSetupMode(null);
    setIsSetupComplete(false);
    setChatMessages([]);
  };

  // Extract financial data from chat using regex patterns
  const extractFinancialData = (text: string): Partial<UserSetupData> => {
    const data: Partial<UserSetupData> = {};
    
    // Extract salary/income (look for numbers with $ or currency context)
    const salaryMatch = text.match(/(?:salary|income|earn|make).*?[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (salaryMatch) {
      data.salary = salaryMatch[1].replace(/,/g, '');
    }

    // Extract budget (look for "budget" mentions)
    const budgetMatch = text.match(/(?:budget).*?[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (budgetMatch) {
      data.monthlyBudget = budgetMatch[1].replace(/,/g, '');
    }

    // Extract checking balance
    const checkingMatch = text.match(/(?:checking|chequing).*?[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (checkingMatch) {
      data.checkingBalance = checkingMatch[1].replace(/,/g, '');
    }

    // Extract savings balance
    const savingsMatch = text.match(/(?:savings).*?[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    if (savingsMatch) {
      data.savingsBalance = savingsMatch[1].replace(/,/g, '');
    }

    return data;
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    const newMessages = [...chatMessages, { role: 'user' as const, content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsLoading(true);

    try {
      // Try to extract data from user message
      const extractedData = extractFinancialData(chatInput);

      // Check if we have all required fields
      const hasAllData = extractedData.salary && extractedData.monthlyBudget && extractedData.checkingBalance && extractedData.savingsBalance;

      let assistantResponse = '';

      if (extractedData.salary) {
        assistantResponse += `✅ Got your salary: $${extractedData.salary}\n`;
      }
      if (extractedData.monthlyBudget) {
        assistantResponse += `✅ Your monthly budget: $${extractedData.monthlyBudget}\n`;
      }
      if (extractedData.checkingBalance) {
        assistantResponse += `✅ Checking balance: $${extractedData.checkingBalance}\n`;
      }
      if (extractedData.savingsBalance) {
        assistantResponse += `✅ Savings balance: $${extractedData.savingsBalance}\n`;
      }

      if (!assistantResponse) {
        assistantResponse = "I didn't find any financial information in your message. Could you tell me:\n• Your monthly salary\n• Your monthly budget\n• Checking account balance\n• Savings account balance\n\nFor example: \"My salary is $5000, budget is $2000, checking has $3000, and savings has $10000\"";
      } else if (hasAllData) {
        assistantResponse += "\n🎉 Perfect! I have all your information. Let me set up your account...";
        
        // Complete setup with extracted data
        const finalSetup: UserSetupData = {
          salary: extractedData.salary || '',
          monthlyBudget: extractedData.monthlyBudget || '',
          checkingBalance: extractedData.checkingBalance || '',
          savingsBalance: extractedData.savingsBalance || '',
        };

        setTimeout(() => {
          completeSetup(finalSetup);
        }, 1500);
      } else {
        assistantResponse += "\n📝 I still need more info. Could you tell me " + 
          [!extractedData.salary && 'your salary', 
           !extractedData.monthlyBudget && 'your budget',
           !extractedData.checkingBalance && 'checking balance',
           !extractedData.savingsBalance && 'savings balance']
          .filter(Boolean).join(', ') + "?";
      }

      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: assistantResponse }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I had trouble processing that. Could you try again?' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyBudget = parseFloat(userSetup.monthlyBudget) || 0;
  const currentSpending = transactions
    .filter(t => t.amt < 0)
    .reduce((sum, t) => sum + Math.abs(t.amt), 0);
  const remaining = monthlyBudget - currentSpending;
  const spendingPercentage = monthlyBudget > 0 ? (currentSpending / monthlyBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      {/* Setup Modal */}
      {showSetupModal && !isSetupComplete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {setupMode === null ? (
            // Mode Selection
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-8 max-w-sm w-full">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Finora! 👋</h2>
              <p className="text-sm text-[#a8aac5] mb-8">How would you like to set up your account?</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSetupMode('manual')}
                  className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <span>📝</span> Manual Setup
                </button>
                <button
                  onClick={() => {
                    setSetupMode('chat');
                    setChatMessages([
                      {
                        role: 'assistant',
                        content: "Hi! 👋 I'm your Finora Financial Assistant. Let's set up your account! Just tell me:\n\n💰 Your monthly salary\n📊 Your monthly budget\n🏦 Your checking account balance\n💳 Your savings account balance\n\nFor example: \"My salary is $5000, I have a $2000 budget, $3000 in checking, and $10000 in savings\""
                      }
                    ]);
                  }}
                  className="w-full bg-[#5500cc] hover:bg-[#440099] text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <span>💬</span> Chat with Me
                </button>
              </div>
            </div>
          ) : setupMode === 'manual' ? (
            // Manual Setup Form
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-8 max-w-sm w-full">
              <button
                onClick={() => setSetupMode(null)}
                className="text-xs text-[#7a7d97] hover:text-white mb-4"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">Set Up Your Profile</h2>
              <p className="text-sm text-[#a8aac5] mb-6">Enter your financial details</p>
              
              <form onSubmit={handleSetupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Monthly Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={userSetup.salary}
                    onChange={handleSetupChange}
                    placeholder="e.g., 5000"
                    className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Monthly Budget</label>
                  <input
                    type="number"
                    name="monthlyBudget"
                    value={userSetup.monthlyBudget}
                    onChange={handleSetupChange}
                    placeholder="e.g., 2000"
                    className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Checking Account Balance</label>
                  <input
                    type="number"
                    name="checkingBalance"
                    value={userSetup.checkingBalance}
                    onChange={handleSetupChange}
                    placeholder="e.g., 3000"
                    className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Savings Account Balance</label>
                  <input
                    type="number"
                    name="savingsBalance"
                    value={userSetup.savingsBalance}
                    onChange={handleSetupChange}
                    placeholder="e.g., 10000"
                    className="w-full bg-[#1a1f3a] border border-[#2d3748] rounded px-4 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition mt-6"
                >
                  Get Started
                </button>
              </form>
            </div>
          ) : (
            // Chat Setup
            <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 max-w-sm w-full h-[500px] flex flex-col">
              <button
                onClick={() => setSetupMode(null)}
                className="text-xs text-[#7a7d97] hover:text-white mb-2"
              >
                ← Back
              </button>
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-[#0066cc] text-white'
                          : 'bg-[#1a1f3a] text-[#a8aac5] border border-[#2d3748]'
                      }`}
                    >
                      {msg.content.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#1a1f3a] border border-[#2d3748] text-[#a8aac5] px-4 py-2 rounded-lg">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Tell me your finances..."
                  disabled={isLoading}
                  className="flex-1 bg-[#1a1f3a] border border-[#2d3748] rounded px-3 py-2 text-white placeholder-[#7a7d97] focus:outline-none focus:border-[#0066cc] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#5500cc] hover:bg-[#440099] disabled:opacity-50 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Finora</h1>
          {isSetupComplete && (
            <button
              onClick={handleResetSetup}
              className="text-xs text-[#0066cc] hover:text-[#0052a3] font-semibold"
            >
              Reconfigure
            </button>
          )}
        </div>
      </header>

      {isSetupComplete && (
        <main className="max-w-md mx-auto px-4 pb-24 pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
            <p className="text-sm text-[#a8aac5]">Here&apos;s your financial overview</p>
          </div>

          {/* Net Worth Card */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
            <p className="text-xs uppercase text-[#7a7d97] font-semibold mb-2">Net Worth</p>
            <h3 className="text-3xl font-bold text-white mb-4">${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <div className="grid grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div key={acc.id} className="bg-[#1a1f3a] rounded p-3 border border-[#2d3748]">
                  <p className="text-xs text-[#7a7d97] mb-1">{acc.name}</p>
                  <p className="font-bold text-white">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
            <p className="text-xs uppercase text-[#7a7d97] font-semibold mb-4">Monthly Budget</p>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-bold text-white">${currentSpending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-xs text-[#7a7d97]">of ${monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-[#2d3748] rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-[#0066cc] to-[#5500cc] rounded-full transition-all"
                  style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#a8aac5] mt-2">
                ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining
              </p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[{ l: 'Needs', p: '40%' }, { l: 'Wants', p: '35%' }, { l: 'Goals', p: '20%' }, { l: 'Flex', p: '5%' }].map((i) => (
                <div key={i.l} className="bg-[#1a1f3a] rounded p-2 text-center border border-[#2d3748]">
                  <p className="text-xs text-[#7a7d97] mb-1">{i.l}</p>
                  <p className="text-sm font-bold text-white">{i.p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Card */}
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-bold text-white mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-xs text-[#7a7d97]">No transactions yet</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between pb-3 mb-3 border-b border-[#2d3748] last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{tx.desc}</p>
                    <p className="text-xs text-[#7a7d97]">{tx.cat} • {tx.date}</p>
                  </div>
                  <p className={tx.amt > 0 ? 'font-bold text-[#10b981]' : 'font-bold text-[#ef4444]'}>
                    {tx.amt > 0 ? '+' : '-'}${Math.abs(tx.amt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))
            )}
          </div>

          <button className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-3 rounded-lg font-semibold transition">
            + Add Transaction
          </button>
        </main>
      )}
    </div>
  );
}
