'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import VirtualBankService, { BankAccount, BankTransaction } from '@/app/utils/virtualBankService';

const ACCOUNT_TYPE_ICONS = {
  savings: '🏦',
  checking: '💳',
  investment: '📈',
};

export default function TransferPage() {
  const router = useRouter();
  const { user } = useApp();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load accounts from localStorage
  useEffect(() => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    const accountsKey = `finora_bank_accounts_${user.id}`;
    const transactionsKey = `finora_bank_transactions_${user.id}`;

    const savedAccounts = localStorage.getItem(accountsKey);
    const savedTransactions = localStorage.getItem(transactionsKey);

    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts));
      } catch (e) {
        console.error('Error loading accounts:', e);
      }
    }

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (e) {
        console.error('Error loading transactions:', e);
      }
    }
  }, [user?.id, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromAccountId) newErrors.fromAccountId = 'Please select source account';
    if (!formData.toAccountId) newErrors.toAccountId = 'Please select destination account';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Enter valid amount';
    if (!formData.description.trim()) newErrors.description = 'Enter transfer description';

    if (formData.fromAccountId && formData.toAccountId && formData.fromAccountId === formData.toAccountId) {
      newErrors.toAccountId = 'Cannot transfer to same account';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage('');

    try {
      const fromAccount = accounts.find(a => a.id === formData.fromAccountId);
      const toAccount = accounts.find(a => a.id === formData.toAccountId);

      if (!fromAccount || !toAccount) {
        setErrors({ general: 'Account not found' });
        return;
      }

      const amount = parseFloat(formData.amount);

      // Use the transfer logic from service
      const result = VirtualBankService.transfer(
        fromAccount,
        toAccount,
        amount,
        formData.description
      );

      // Update accounts
      const updatedAccounts = accounts.map(a => {
        if (a.id === fromAccount.id) return result.fromAccount;
        if (a.id === toAccount.id) return result.toAccount;
        return a;
      });
      setAccounts(updatedAccounts);
      localStorage.setItem(`finora_bank_accounts_${user?.id}`, JSON.stringify(updatedAccounts));

      // Update transactions (add both transfer-out and transfer-in)
      const newTransactions = [...transactions, result.fromTransaction, result.toTransaction];
      setTransactions(newTransactions);
      localStorage.setItem(`finora_bank_transactions_${user?.id}`, JSON.stringify(newTransactions));

      // Show success message
      setSuccessMessage(`✅ Transfer successful! ₹${amount.toLocaleString('en-IN')} transferred.`);

      // Reset form
      setFormData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/accounts');
      }, 2000);
    } catch (error) {
      setErrors({
        general: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fromAccount = accounts.find(a => a.id === formData.fromAccountId);
  const toAccount = accounts.find(a => a.id === formData.toAccountId);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/accounts" className="text-blue-400 hover:text-blue-300">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-white">🔄 Transfer Money</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Info Card */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
          <p className="text-blue-200 text-sm">
            💡 Transfer money between your virtual accounts. Transfer fee: Free
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6">
            <p className="text-green-200 text-sm font-semibold">{successMessage}</p>
            <p className="text-green-300 text-xs mt-1">Redirecting to accounts...</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm font-semibold">{errors.general}</p>
          </div>
        )}

        {/* Transfer Form */}
        <form onSubmit={handleTransfer} className="space-y-4">
          {/* From Account */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <label className="block text-white font-semibold mb-3">From Account</label>

            {accounts.length === 0 ? (
              <p className="text-slate-400 text-sm">No accounts available. Create an account first.</p>
            ) : (
              <div className="space-y-2">
                {accounts.map(account => (
                  <label
                    key={account.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border-2 ${
                      formData.fromAccountId === account.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fromAccount"
                      value={account.id}
                      checked={formData.fromAccountId === account.id}
                      onChange={e => setFormData({ ...formData, fromAccountId: e.target.value })}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold">
                        {ACCOUNT_TYPE_ICONS[account.accountType]} {account.accountName}
                      </p>
                      <p className="text-xs text-slate-400">₹{account.balance.toLocaleString('en-IN')}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {errors.fromAccountId && (
              <p className="text-red-400 text-xs mt-2">{errors.fromAccountId}</p>
            )}
          </div>

          {/* Amount */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <label className="block text-white font-semibold mb-3">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={e => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) setErrors({ ...errors, amount: '' });
                }}
                className="w-full pl-6 pr-3 py-2 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                min="0"
              />
            </div>

            {/* Balance Check */}
            {fromAccount && formData.amount && (
              <div className="mt-2 text-xs">
                {parseFloat(formData.amount) > fromAccount.balance ? (
                  <p className="text-red-400">❌ Insufficient balance</p>
                ) : (
                  <p className="text-green-400">
                    ✅ Available balance: ₹{fromAccount.balance.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            )}

            {errors.amount && (
              <p className="text-red-400 text-xs mt-2">{errors.amount}</p>
            )}
          </div>

          {/* To Account */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <label className="block text-white font-semibold mb-3">To Account</label>

            {accounts.length <= 1 ? (
              <p className="text-slate-400 text-sm">Create more accounts to enable transfers.</p>
            ) : (
              <div className="space-y-2">
                {accounts
                  .filter(a => a.id !== formData.fromAccountId)
                  .map(account => (
                    <label
                      key={account.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border-2 ${
                        formData.toAccountId === account.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="toAccount"
                        value={account.id}
                        checked={formData.toAccountId === account.id}
                        onChange={e => {
                          setFormData({ ...formData, toAccountId: e.target.value });
                          if (errors.toAccountId) setErrors({ ...errors, toAccountId: '' });
                        }}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">
                          {ACCOUNT_TYPE_ICONS[account.accountType]} {account.accountName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {account.accountType === 'savings'
                            ? 'Savings'
                            : account.accountType === 'investment'
                            ? 'Investment'
                            : 'Checking'}
                        </p>
                      </div>
                    </label>
                  ))}
              </div>
            )}

            {errors.toAccountId && (
              <p className="text-red-400 text-xs mt-2">{errors.toAccountId}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <label className="block text-white font-semibold mb-3">Purpose/Description</label>
            <input
              type="text"
              placeholder="e.g., Savings contribution, Emergency fund"
              value={formData.description}
              onChange={e => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />

            {errors.description && (
              <p className="text-red-400 text-xs mt-2">{errors.description}</p>
            )}
          </div>

          {/* Transfer Summary */}
          {formData.fromAccountId && formData.toAccountId && formData.amount && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3">Transfer Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">From</span>
                  <span className="text-white font-semibold">{fromAccount?.accountName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">To</span>
                  <span className="text-white font-semibold">{toAccount?.accountName}</span>
                </div>

                <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-blue-400 font-semibold">₹{parseFloat(formData.amount || '0').toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Fee</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>

                <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between">
                  <span className="text-slate-400">Processing</span>
                  <span className="text-white font-semibold">Instant</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Link
              href="/accounts"
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.fromAccountId ||
                !formData.toAccountId ||
                !formData.amount ||
                !formData.description ||
                accounts.length <= 1
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              {loading ? 'Processing...' : '✅ Confirm Transfer'}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mt-6 mb-6">
          <h3 className="text-white font-semibold mb-2">ℹ️ How Transfers Work</h3>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>✅ Select source and destination accounts</li>
            <li>✅ Enter amount and purpose</li>
            <li>✅ Review transfer summary</li>
            <li>✅ Confirm to complete instantly</li>
            <li>✅ Transaction appears in both accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
