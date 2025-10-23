'use client';

import React from 'react';
import BudgetAlertService, { BudgetStatus } from '@/app/utils/budgetAlertService';

interface BudgetAlertProps {
  budgetStatuses: BudgetStatus[];
  onDismiss?: (categoryName: string) => void;
}

export default function BudgetAlertComponent({ budgetStatuses, onDismiss }: BudgetAlertProps) {
  const activeAlerts = BudgetAlertService.getActiveAlerts(budgetStatuses);

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Alert Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-l-4 border-yellow-500">
        <span className="text-2xl">📢</span>
        <h3 className="text-white font-semibold">Budget Alerts ({activeAlerts.length})</h3>
      </div>

      {/* Individual Alerts */}
      {activeAlerts.map((alert, index) => {
        const icon = BudgetAlertService.getSeverityIcon(alert.status);
        const colorClass = BudgetAlertService.getSeverityColor(alert.status);
        const message = BudgetAlertService.generateAlertMessage(alert);

        return (
          <div
            key={`${alert.category}-${index}`}
            className={`bg-gradient-to-r ${colorClass} rounded-lg p-4 text-white shadow-lg animate-pulse`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl min-w-fit">{icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{alert.category} Budget Alert</p>
                  <p className="text-sm mt-1 opacity-90">{message}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        alert.status === 'exceeded'
                          ? 'bg-red-300'
                          : alert.status === 'critical'
                          ? 'bg-orange-300'
                          : 'bg-yellow-300'
                      }`}
                      style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-2 text-xs opacity-85 grid grid-cols-2 gap-2">
                    <div>
                      <p>Spent: ₹{alert.spent.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p>Limit: ₹{alert.limit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dismiss Button */}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.category)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition min-w-fit"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full uppercase">
                {alert.status}
              </span>
              <span className="text-xs opacity-75">
                {alert.percentage >= 100
                  ? `Over budget by ₹${Math.abs(alert.remaining).toLocaleString('en-IN')}`
                  : `${alert.remaining.toLocaleString('en-IN')} remaining`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
