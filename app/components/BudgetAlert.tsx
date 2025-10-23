'use client';

import React from 'react';
import { BudgetStatus } from '@/app/utils/budgetAlertService';

interface Props {
  alerts: BudgetStatus[];
  onDismiss?: (category: string) => void;
}

export default function BudgetAlertComponent({ alerts, onDismiss }: Props) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 px-4 py-2">
      {alerts.map((alert, index) => (
        <div
          key={`${alert.category}-${index}`}
          className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-sm ${
            alert.status === 'exceeded'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : alert.status === 'critical'
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
              : alert.status === 'warning'
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
              : 'bg-green-500/10 border-green-500/30 text-green-300'
          }`}
        >
          <div className="flex-1">
            <div className="font-semibold">{alert.category}</div>
            <div className="text-xs opacity-90">
              ₹{alert.spent} spent of ₹{alert.limit} ({alert.percentage.toFixed(0)}%)
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(alert.category)}
              className="text-lg opacity-60 hover:opacity-100 transition"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
