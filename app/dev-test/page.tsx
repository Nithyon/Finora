'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import ValidationService from '@/app/utils/validationService';
import DemoDataService from '@/app/utils/demoDataService';

export default function DevTestPage() {
  const { user } = useApp();
  const [testResults, setTestResults] = useState<any>(null);
  const [demoDataLoaded, setDemoDataLoaded] = useState(false);

  const handleLoadDemoData = () => {
    if (user?.id) {
      try {
        DemoDataService.loadDemoDataToLocalStorage(user.id);
        setDemoDataLoaded(true);
        alert('Demo data loaded successfully! Refresh the page to see it.');
      } catch (e) {
        alert('Error loading demo data: ' + e);
      }
    }
  };

  const handleClearDemoData = () => {
    if (user?.id) {
      if (confirm('Are you sure? This will delete all test data.')) {
        try {
          DemoDataService.clearDemoData(user.id);
          setDemoDataLoaded(false);
          alert('Demo data cleared. Refresh the page.');
        } catch (e) {
          alert('Error clearing data: ' + e);
        }
      }
    }
  };

  const handleValidationTests = () => {
    const results: Record<string, any> = {};

    // Test amount validation
    results['Amount Validation'] = {
      valid: ValidationService.validateAmount(1000).length === 0,
      negative: ValidationService.validateAmount(-100).length > 0,
      zero: ValidationService.validateAmount(0).length > 0
    };

    // Test budget validation
    results['Budget Validation'] = {
      valid: ValidationService.validateBudget(5000).length === 0,
      invalid: ValidationService.validateBudget(-1000).length > 0
    };

    // Test category validation
    results['Category Validation'] = {
      valid: ValidationService.validateCategory('Groceries').length === 0,
      empty: ValidationService.validateCategory('').length > 0
    };

    // Test goal validation
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const goalValidation = ValidationService.validateGoal(
      'Test Goal',
      50000,
      futureDate.toISOString().split('T')[0]
    );
    results['Goal Validation'] = {
      valid: goalValidation.valid,
      errors: goalValidation.errors.length
    };

    // Test email validation
    results['Email Validation'] = {
      valid: ValidationService.validateEmail('test@example.com').length === 0,
      invalid: ValidationService.validateEmail('invalid-email').length > 0
    };

    // Test income validation
    results['Income Validation'] = {
      valid: ValidationService.validateIncome(50000).length === 0,
      invalid: ValidationService.validateIncome(-1000).length > 0
    };

    setTestResults(results);
  };

  const handleHealthCheck = () => {
    if (!user?.id) {
      alert('User not found');
      return;
    }

    try {
      const transactions = JSON.parse(
        localStorage.getItem(`finora_transactions_${user.id}`) || '[]'
      );
      const budgets = JSON.parse(
        localStorage.getItem('finora_budget_targets') || '[]'
      );

      const dataIntegrity = ValidationService.checkDataIntegrity(
        transactions,
        budgets
      );

      const results: Record<string, any> = {
        'Data Integrity Check': {
          valid: dataIntegrity.valid,
          errors: dataIntegrity.errors.length,
          warnings: dataIntegrity.warnings.length,
          totalTransactions: transactions.length,
          totalBudgets: budgets.length
        }
      };

      if (transactions.length > 0) {
        const stats = DemoDataService.getSummaryStats(transactions, budgets);
        results['Financial Summary'] = stats;
      }

      setTestResults(results);
    } catch (e) {
      alert('Error running health check: ' + e);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a]">
      <header className="sticky top-0 z-40 bg-[#0a0e27]/95 backdrop-blur border-b border-[#2d3748]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-white">🧪 Developer Testing Page</h1>
          <p className="text-xs text-[#a8aac5]">For testing and validation</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Demo Data Section */}
        <div className="mb-8 bg-[#141829] border border-[#2d3748] rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Demo Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleLoadDemoData}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
              📊 Load Realistic Demo Data
            </button>
            <button
              onClick={handleClearDemoData}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
              🗑️ Clear All Demo Data
            </button>
            <p className="text-xs text-[#a8aac5] mt-3">
              Loads 20+ realistic transactions, budgets, and goals for the current month.
              Perfect for testing calculations and visualizations.
            </p>
          </div>
        </div>

        {/* Validation Tests */}
        <div className="mb-8 bg-[#141829] border border-[#2d3748] rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Validation Tests</h2>
          <button
            onClick={handleValidationTests}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition mb-4"
          >
            ✓ Run Validation Tests
          </button>
          <p className="text-xs text-[#a8aac5]">
            Tests amount validation, budget validation, category validation, goal validation, email validation, and income validation.
          </p>
        </div>

        {/* Health Check */}
        <div className="mb-8 bg-[#141829] border border-[#2d3748] rounded-lg p-6">
          <h2 className="text-lg font-bold text-white mb-4">Data Health Check</h2>
          <button
            onClick={handleHealthCheck}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition mb-4"
          >
            🏥 Run Health Check
          </button>
          <p className="text-xs text-[#a8aac5]">
            Checks data integrity, duplicate detection, and generates financial summary statistics.
          </p>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-[#141829] border border-[#2d3748] rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">📋 Test Results</h2>
            <div className="space-y-4">
              {Object.entries(testResults).map(([testName, result]: [string, any]) => (
                <div key={testName} className="bg-[#0a0e27] border border-[#2d3748] rounded p-4">
                  <h3 className="font-semibold text-white mb-2">{testName}</h3>
                  <div className="space-y-1 text-sm">
                    {typeof result === 'object' ? (
                      Object.entries(result).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between text-[#a8aac5]">
                          <span>{key}:</span>
                          <span className={
                            typeof value === 'boolean' 
                              ? value ? 'text-green-400' : 'text-red-400'
                              : 'text-white'
                          }>
                            {String(value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#a8aac5]">{String(result)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-2">💡 Testing Guide</h3>
          <ul className="text-sm text-[#a8aac5] space-y-1">
            <li>✓ Load demo data to populate the app with realistic transactions</li>
            <li>✓ Run validation tests to verify input validation logic</li>
            <li>✓ Run health check to verify data consistency</li>
            <li>✓ Check localStorage to see what data is being persisted</li>
            <li>✓ Visit other pages to see calculations and visualizations</li>
            <li>✓ Check browser console for any errors or warnings</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
