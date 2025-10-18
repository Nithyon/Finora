'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  account: string;
}

interface TransactionListProps {
  refresh?: number;
}

export const TransactionList = ({ refresh }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        setError('');
      }
    } catch (err) {
      setError('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTransactions(transactions.filter((t) => t.id !== id));
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red">{error}</p>;
  if (transactions.length === 0)
    return <p className="text-gray-400 text-center py-8">No transactions yet. Add one!</p>;

  return (
    <div className="space-y-2">
      {transactions.map((txn) => (
        <div
          key={txn.id}
          className="flex items-center justify-between bg-navy rounded-lg p-4 hover:bg-navy/80 transition-colors border border-navy-light"
        >
          <div className="flex-1">
            <p className="font-semibold text-white">{txn.description}</p>
            <p className="text-sm text-gray-400">
              {txn.category} • {new Date(txn.date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className={`font-bold text-lg ${txn.type === 'income' ? 'text-lime' : 'text-gray-200'}`}>
              {txn.type === 'income' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
            </p>
            <button
              onClick={() => deleteTransaction(txn.id)}
              className="text-red hover:text-red/80 transition-colors text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
