// Virtual Bank Account Service
// Simulates real banking operations with complete logic

export interface BankAccount {
  id: string;
  userId: number;
  accountNumber: string;
  accountType: 'savings' | 'checking' | 'investment';
  accountName: string;
  balance: number;
  currency: string;
  interestRate: number; // Annual interest rate
  createdAt: string;
  isActive: boolean;
  maxTransferLimit: number; // Daily limit
}

export interface BankTransaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer_out' | 'transfer_in' | 'interest';
  amount: number;
  timestamp: string;
  description: string;
  balanceAfter: number;
  reference?: string; // For transfers
  status: 'pending' | 'completed' | 'failed';
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
}

class VirtualBankService {
  /**
   * Generate unique account number (IBAN-like format)
   * Format: FINORA-XXXX-XXXX-XXXX-XXXX
   */
  static generateAccountNumber(): string {
    const segments = Array(4)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10000).toString().padStart(4, '0'));
    return `FINORA-${segments.join('-')}`;
  }

  /**
   * Create a new virtual bank account
   */
  static createAccount(
    userId: number,
    accountName: string,
    accountType: 'savings' | 'checking' | 'investment' = 'checking',
    initialBalance: number = 0
  ): BankAccount {
    // Validate inputs
    if (initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
    if (initialBalance > 1000000) {
      throw new Error('Initial balance exceeds maximum limit (₹1,000,000)');
    }
    if (!accountName.trim()) {
      throw new Error('Account name is required');
    }

    // Determine interest rate based on type
    const interestRates = {
      savings: 4.5,
      checking: 0.5,
      investment: 7.0,
    };

    const account: BankAccount = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      accountNumber: this.generateAccountNumber(),
      accountType,
      accountName,
      balance: initialBalance,
      currency: 'INR',
      interestRate: interestRates[accountType],
      createdAt: new Date().toISOString(),
      isActive: true,
      maxTransferLimit: 100000, // Daily transfer limit
    };

    return account;
  }

  /**
   * Deposit money into account
   */
  static deposit(account: BankAccount, amount: number, description: string = 'Cash Deposit'): {
    account: BankAccount;
    transaction: BankTransaction;
  } {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero');
    }

    const newBalance = account.balance + amount;
    const updatedAccount = { ...account, balance: newBalance };

    const transaction: BankTransaction = {
      id: `txn_${Date.now()}`,
      accountId: account.id,
      type: 'deposit',
      amount,
      timestamp: new Date().toISOString(),
      description,
      balanceAfter: newBalance,
      status: 'completed',
    };

    return { account: updatedAccount, transaction };
  }

  /**
   * Withdraw money from account
   */
  static withdraw(account: BankAccount, amount: number, description: string = 'Cash Withdrawal'): {
    account: BankAccount;
    transaction: BankTransaction;
  } {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than zero');
    }

    if (amount > account.balance) {
      throw new Error(`Insufficient funds. Available balance: ₹${account.balance}`);
    }

    const newBalance = account.balance - amount;
    const updatedAccount = { ...account, balance: newBalance };

    const transaction: BankTransaction = {
      id: `txn_${Date.now()}`,
      accountId: account.id,
      type: 'withdrawal',
      amount,
      timestamp: new Date().toISOString(),
      description,
      balanceAfter: newBalance,
      status: 'completed',
    };

    return { account: updatedAccount, transaction };
  }

  /**
   * Transfer money between accounts
   */
  static transfer(
    fromAccount: BankAccount,
    toAccount: BankAccount,
    amount: number,
    description: string = 'Inter-account Transfer'
  ): {
    fromAccount: BankAccount;
    toAccount: BankAccount;
    fromTransaction: BankTransaction;
    toTransaction: BankTransaction;
  } {
    // Validations
    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    if (amount > fromAccount.balance) {
      throw new Error(`Insufficient funds. Available balance: ₹${fromAccount.balance}`);
    }

    if (amount > fromAccount.maxTransferLimit) {
      throw new Error(`Daily transfer limit exceeded (₹${fromAccount.maxTransferLimit})`);
    }

    if (fromAccount.id === toAccount.id) {
      throw new Error('Cannot transfer to the same account');
    }

    if (!fromAccount.isActive || !toAccount.isActive) {
      throw new Error('Both accounts must be active');
    }

    // Execute transfer
    const fromBalance = fromAccount.balance - amount;
    const toBalance = toAccount.balance + amount;

    const updatedFromAccount = { ...fromAccount, balance: fromBalance };
    const updatedToAccount = { ...toAccount, balance: toBalance };

    const referenceId = `ref_${Date.now()}`;

    const fromTransaction: BankTransaction = {
      id: `txn_${Date.now()}_from`,
      accountId: fromAccount.id,
      type: 'transfer_out',
      amount,
      timestamp: new Date().toISOString(),
      description: `${description} → ${toAccount.accountName}`,
      balanceAfter: fromBalance,
      reference: referenceId,
      status: 'completed',
    };

    const toTransaction: BankTransaction = {
      id: `txn_${Date.now()}_to`,
      accountId: toAccount.id,
      type: 'transfer_in',
      amount,
      timestamp: new Date().toISOString(),
      description: `${description} ← ${fromAccount.accountName}`,
      balanceAfter: toBalance,
      reference: referenceId,
      status: 'completed',
    };

    return { fromAccount: updatedFromAccount, toAccount: updatedToAccount, fromTransaction, toTransaction };
  }

  /**
   * Apply monthly interest
   */
  static applyInterest(account: BankAccount): {
    account: BankAccount;
    transaction: BankTransaction;
  } {
    const monthlyRate = account.interestRate / 12 / 100;
    const interestAmount = Math.round(account.balance * monthlyRate * 100) / 100; // Round to 2 decimals

    if (interestAmount <= 0) {
      throw new Error('Account balance insufficient for interest calculation');
    }

    const newBalance = account.balance + interestAmount;
    const updatedAccount = { ...account, balance: newBalance };

    const transaction: BankTransaction = {
      id: `txn_${Date.now()}_interest`,
      accountId: account.id,
      type: 'interest',
      amount: interestAmount,
      timestamp: new Date().toISOString(),
      description: `Monthly Interest (${account.interestRate}% APR)`,
      balanceAfter: newBalance,
      status: 'completed',
    };

    return { account: updatedAccount, transaction };
  }

  /**
   * Get account statement (last N transactions)
   */
  static getStatement(transactions: BankTransaction[], accountId: string, limit: number = 50): BankTransaction[] {
    return transactions.filter(txn => txn.accountId === accountId).slice(-limit).reverse();
  }

  /**
   * Calculate total income (deposits + transfers in)
   */
  static calculateIncome(transactions: BankTransaction[], accountId: string): number {
    return transactions
      .filter(txn => txn.accountId === accountId && (txn.type === 'deposit' || txn.type === 'transfer_in'))
      .reduce((sum, txn) => sum + txn.amount, 0);
  }

  /**
   * Calculate total expenses (withdrawals + transfers out)
   */
  static calculateExpenses(transactions: BankTransaction[], accountId: string): number {
    return transactions
      .filter(txn => txn.accountId === accountId && (txn.type === 'withdrawal' || txn.type === 'transfer_out'))
      .reduce((sum, txn) => sum + txn.amount, 0);
  }

  /**
   * Get account summary/stats
   */
  static getAccountSummary(
    account: BankAccount,
    transactions: BankTransaction[]
  ): {
    account: BankAccount;
    totalIncome: number;
    totalExpenses: number;
    netFlow: number;
    transactionCount: number;
    lastTransaction?: BankTransaction;
  } {
    const accountTransactions = transactions.filter(txn => txn.accountId === account.id);
    const totalIncome = this.calculateIncome(transactions, account.id);
    const totalExpenses = this.calculateExpenses(transactions, account.id);
    const lastTransaction = accountTransactions[accountTransactions.length - 1];

    return {
      account,
      totalIncome,
      totalExpenses,
      netFlow: totalIncome - totalExpenses,
      transactionCount: accountTransactions.length,
      lastTransaction,
    };
  }

  /**
   * Validate daily transfer limit
   */
  static checkDailyTransferLimit(
    account: BankAccount,
    transactions: BankTransaction[],
    proposedAmount: number
  ): { valid: boolean; message: string; amountUsed: number; amountRemaining: number } {
    const today = new Date().toDateString();
    const todayTransfers = transactions
      .filter(
        txn =>
          txn.accountId === account.id &&
          (txn.type === 'transfer_out' || txn.type === 'withdrawal') &&
          new Date(txn.timestamp).toDateString() === today
      )
      .reduce((sum, txn) => sum + txn.amount, 0);

    const amountUsed = todayTransfers;
    const amountRemaining = account.maxTransferLimit - amountUsed;

    const valid = proposedAmount <= amountRemaining;
    const message = valid ? 'Transfer allowed' : `Daily limit exceeded by ₹${proposedAmount - amountRemaining}`;

    return { valid, message, amountUsed, amountRemaining };
  }

  /**
   * Close account (soft delete)
   */
  static closeAccount(account: BankAccount): BankAccount {
    if (account.balance > 0) {
      throw new Error('Cannot close account with remaining balance. Please withdraw all funds first.');
    }

    return { ...account, isActive: false };
  }

  /**
   * Freeze/Unfreeze account
   */
  static freezeAccount(account: BankAccount): BankAccount {
    return { ...account, isActive: false };
  }

  static unfreezeAccount(account: BankAccount): BankAccount {
    return { ...account, isActive: true };
  }
}

export default VirtualBankService;
