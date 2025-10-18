// ============================================
// UTILITY CONSTANTS
// ============================================

export const APP_NAME = 'Finora';
export const APP_TAGLINE = 'Financial Mastery';

// API
export const API_TIMEOUT = 30000; // 30 seconds

// Transaction categories
export const TRANSACTION_CATEGORIES = [
  'Groceries',
  'Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
] as const;

// Budget periods
export const BUDGET_PERIODS = ['weekly', 'monthly', 'yearly'] as const;

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_EMAIL: 'user_email',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Theme colors (matching Tailwind config)
export const COLORS = {
  navy: '#1a1f3a',
  navyDark: '#0f1219',
  navyLight: '#252d45',
  lime: '#84cc16',
  blue: '#6366f1',
  blueDark: '#4f46e5',
  red: '#dc2626',
  primary: '#0066cc',
  primaryHover: '#0052a3',
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_TRANSACTION_AMOUNT: 0.01,
  MAX_TRANSACTION_AMOUNT: 1000000,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

// Chart colors
export const CHART_COLORS = [
  '#6366f1', // blue
  '#84cc16', // lime
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
] as const;
