// app/utils/goalService.ts
// Goal progress tracking and analytics
// Implements goal projection, timeline, and YNAB-style goal tracking

import TransactionService, { Transaction } from './transactionService';

export interface Goal {
  id: string;
  userId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category?: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
}

export interface GoalProgress {
  goal: Goal;
  progressPercent: number;
  amountRemaining: number;
  daysRemaining: number;
  daysTotal: number;
  daysPassed: number;
  averageNeededPerDay: number;
  currentSpendingPerDay: number;
  onTrack: boolean;
  daysToGoalAtCurrentPace: number;
  impactOfOverspending: number; // Days delayed if overspending continues
  status: 'healthy' | 'warning' | 'critical' | 'completed';
  recommendation: string;
}

export interface GoalProjection {
  goal: Goal;
  completionDate: Date;
  daysToCompletion: number;
  requiredDailyAmount: number;
  projectedOverspend: number;
}

class GoalService {
  /**
   * Calculate comprehensive progress for a goal
   */
  static calculateGoalProgress(
    goal: Goal,
    transactions: Transaction[]
  ): GoalProgress {
    const today = new Date();
    const deadline = new Date(goal.deadline);

    // Calculate total days for goal
    const goalCreated = new Date(goal.createdAt);
    const daysTotal = Math.floor((deadline.getTime() - goalCreated.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.floor((today.getTime() - goalCreated.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Calculate progress
    const progressPercent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    const amountRemaining = Math.max(0, goal.targetAmount - goal.currentAmount);

    // Calculate required daily progress
    const averageNeededPerDay = daysRemaining > 0 ? amountRemaining / daysRemaining : 0;

    // Get spending for this goal's category if available
    const goalTransactions = goal.category
      ? transactions.filter((tx) => tx.category === goal.category && tx.transaction_type === 'expense')
      : [];

    const currentSpendingPerDay = goalTransactions.length > 0
      ? goalTransactions.reduce((sum, tx) => sum + tx.amount, 0) / Math.max(daysPassed, 1)
      : 0;

    // Check if on track
    const expectedProgress = goal.targetAmount * (daysPassed / daysTotal);
    const onTrack = goal.currentAmount >= expectedProgress * 0.95; // Allow 5% variance

    // Calculate days to goal at current pace
    const currentDailyAverage = goal.currentAmount / Math.max(daysPassed, 1);
    const daysToGoalAtCurrentPace = currentDailyAverage > 0 ? Math.floor(goal.targetAmount / currentDailyAverage) : 999;

    // Calculate impact of overspending
    const overspendingDailyRate = Math.max(0, currentSpendingPerDay - averageNeededPerDay);
    const impactOfOverspending = daysRemaining > 0 ? overspendingDailyRate * daysRemaining : 0;

    // Determine status
    let status: 'healthy' | 'warning' | 'critical' | 'completed' = 'healthy';
    if (progressPercent >= 100) {
      status = 'completed';
    } else if (onTrack) {
      status = 'healthy';
    } else if (progressPercent >= 50) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      goal,
      progressPercent,
      onTrack,
      daysRemaining,
      averageNeededPerDay,
      currentSpendingPerDay,
      overspendingDailyRate
    );

    return {
      goal,
      progressPercent,
      amountRemaining,
      daysRemaining,
      daysTotal,
      daysPassed,
      averageNeededPerDay: Math.round(averageNeededPerDay * 100) / 100,
      currentSpendingPerDay: Math.round(currentSpendingPerDay * 100) / 100,
      onTrack,
      daysToGoalAtCurrentPace,
      impactOfOverspending: Math.round(impactOfOverspending * 100) / 100,
      status,
      recommendation,
    };
  }

  /**
   * Get all goals and their progress
   */
  static getAllGoalsProgress(
    goals: Goal[],
    transactions: Transaction[]
  ): GoalProgress[] {
    return goals
      .filter((goal) => goal.status === 'active')
      .map((goal) => this.calculateGoalProgress(goal, transactions))
      .sort((a, b) => {
        // Sort by priority: critical first, then by deadline
        const priorityOrder = { critical: 0, warning: 1, healthy: 2, completed: 3 };
        const priorityDiff = priorityOrder[a.status] - priorityOrder[b.status];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.goal.deadline).getTime() - new Date(b.goal.deadline).getTime();
      });
  }

  /**
   * Calculate when a goal will be completed at current pace
   */
  static projectCompletion(goal: Goal, transactions: Transaction[]): GoalProjection {
    const daysPassed = Math.floor(
      (Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const dailyAverage = goal.currentAmount / Math.max(daysPassed, 1);

    const daysToCompletion = dailyAverage > 0 ? Math.ceil(goal.targetAmount / dailyAverage) : 999;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToCompletion);

    const deadline = new Date(goal.deadline);
    const delay = Math.max(0, Math.floor((completionDate.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)));

    const requiredDailyAmount = goal.targetAmount / daysToCompletion;
    const projectedOverspend = Math.max(0, delay * requiredDailyAmount);

    return {
      goal,
      completionDate,
      daysToCompletion,
      requiredDailyAmount: Math.round(requiredDailyAmount * 100) / 100,
      projectedOverspend: Math.round(projectedOverspend * 100) / 100,
    };
  }

  /**
   * Generate smart recommendations for goal progress
   */
  private static generateRecommendation(
    goal: Goal,
    progressPercent: number,
    onTrack: boolean,
    daysRemaining: number,
    averageNeededPerDay: number,
    currentSpendingPerDay: number,
    overspendingDailyRate: number
  ): string {
    // Completed
    if (progressPercent >= 100) {
      return `🎉 Congratulations! You've reached your goal of ₹${goal.targetAmount.toLocaleString('en-IN')}!`;
    }

    // On track
    if (onTrack) {
      return `✅ Great job! At your current pace, you'll reach this goal in approximately ${Math.ceil(goal.targetAmount / (goal.currentAmount / Math.max(1, Math.floor((Date.now() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)))))} days.`;
    }

    // Behind but can catch up
    if (daysRemaining > 30 && progressPercent >= 30) {
      const needed = Math.ceil(averageNeededPerDay);
      return `⚠️ You're behind pace. Increase savings to ₹${needed}/day to reach your goal on time.`;
    }

    // Significantly behind
    if (progressPercent < 30 && daysRemaining > 60) {
      const needed = Math.ceil(averageNeededPerDay);
      return `🚨 You're significantly behind. You need ₹${needed}/day to reach your ₹${goal.targetAmount.toLocaleString('en-IN')} goal by ${new Date(goal.deadline).toLocaleDateString()}.`;
    }

    // Urgent - running out of time
    if (daysRemaining < 30 && progressPercent < 80) {
      const needed = Math.ceil(averageNeededPerDay);
      return `🔴 URGENT: Only ${daysRemaining} days left! You need ₹${needed}/day to reach your goal.`;
    }

    // Almost there
    if (progressPercent >= 80 && daysRemaining > 0) {
      const remaining = goal.targetAmount - goal.currentAmount;
      return `💪 Almost there! Just ₹${Math.ceil(remaining).toLocaleString('en-IN')} more to reach your goal in ${daysRemaining} days.`;
    }

    return 'Keep saving! You can reach your financial goals with consistent effort.';
  }

  /**
   * Calculate impact of different spending scenarios on goal completion
   */
  static calculateScenarios(goal: Goal, dailyAverage: number) {
    const daysToGoal = goal.currentAmount > 0 ? Math.ceil(goal.targetAmount / dailyAverage) : 999;
    const baseCompletion = new Date();
    baseCompletion.setDate(baseCompletion.getDate() + daysToGoal);

    // Scenario 1: Increase spending by 10%
    const increased10 = dailyAverage * 1.1;
    const days10 = goal.currentAmount > 0 ? Math.ceil(goal.targetAmount / increased10) : 999;
    const delay10 = days10 - daysToGoal;

    // Scenario 2: Increase spending by 25%
    const increased25 = dailyAverage * 1.25;
    const days25 = goal.currentAmount > 0 ? Math.ceil(goal.targetAmount / increased25) : 999;
    const delay25 = days25 - daysToGoal;

    // Scenario 3: Decrease spending by 10%
    const decreased10 = dailyAverage * 0.9;
    const days10Decrease = goal.currentAmount > 0 ? Math.ceil(goal.targetAmount / decreased10) : 999;
    const speedup10 = daysToGoal - days10Decrease;

    return {
      baseline: {
        dailyRate: Math.round(dailyAverage * 100) / 100,
        daysToGoal,
        completionDate: baseCompletion,
      },
      increased10Percent: {
        dailyRate: Math.round(increased10 * 100) / 100,
        daysToGoal: days10,
        daysDelayed: delay10,
        completionDate: new Date(baseCompletion.getTime() + delay10 * 24 * 60 * 60 * 1000),
      },
      increased25Percent: {
        dailyRate: Math.round(increased25 * 100) / 100,
        daysToGoal: days25,
        daysDelayed: delay25,
        completionDate: new Date(baseCompletion.getTime() + delay25 * 24 * 60 * 60 * 1000),
      },
      decreased10Percent: {
        dailyRate: Math.round(decreased10 * 100) / 100,
        daysToGoal: days10Decrease,
        daysSpedup: speedup10,
        completionDate: new Date(baseCompletion.getTime() - speedup10 * 24 * 60 * 60 * 1000),
      },
    };
  }

  /**
   * Get goals that need attention
   */
  static getGoalsNeedingAttention(goalProgresses: GoalProgress[]): GoalProgress[] {
    return goalProgresses.filter((gp) => {
      if (gp.status === 'critical') return true;
      if (gp.status === 'warning' && gp.daysRemaining < 14) return true;
      return false;
    });
  }

  /**
   * Calculate savings rate needed for goal
   */
  static calculateRequiredSavingsRate(
    goal: Goal,
    monthlyIncome: number
  ): number {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const monthsRemaining = Math.max(1, (deadline.getFullYear() - today.getFullYear()) * 12 + (deadline.getMonth() - today.getMonth()));

    const totalNeeded = goal.targetAmount - goal.currentAmount;
    const monthlyNeeded = totalNeeded / monthsRemaining;

    return (monthlyNeeded / monthlyIncome) * 100;
  }

  /**
   * Load goals from localStorage
   */
  static loadGoals(userId: number): Goal[] {
    try {
      const key = `finora_goals_${userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
    return [];
  }

  /**
   * Save goals to localStorage
   */
  static saveGoals(userId: number, goals: Goal[]): void {
    try {
      const key = `finora_goals_${userId}`;
      localStorage.setItem(key, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }
}

export default GoalService;
