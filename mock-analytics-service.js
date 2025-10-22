// Mock Analytics Service - runs on port 8081
// This simulates the Java Analytics service for local development

const http = require('http');
const url = require('url');

// Mock data
const mockData = {
  health: { status: 'UP' },
  monthlySummary: {
    totalIncome: 5000,
    totalExpense: 3200,
    netIncome: 1800,
    byCategory: {
      'Food': 850,
      'Transport': 420,
      'Utilities': 320,
      'Entertainment': 680,
      'Shopping': 930
    },
    transactionCount: 47,
    month: 'October',
    year: '2025'
  },
  spendingForecast: {
    predictedMonthlySpending: {
      'Food': 900,
      'Transport': 450,
      'Utilities': 320,
      'Entertainment': 700,
      'Shopping': 850
    },
    averageMonthlyExpense: 3220,
    recommendation: 'Your spending is stable. Consider increasing savings by 10%.',
    trends: {
      'Food': 'stable',
      'Transport': 'increasing',
      'Entertainment': 'increasing'
    }
  },
  categoryBreakdown: [
    {
      category: 'Food',
      totalAmount: 850,
      percentage: 26.56,
      transactionCount: 12,
      trend: 'up',
      recentTransactions: ['Grocery - $45', 'Restaurant - $60', 'Coffee - $8']
    },
    {
      category: 'Transport',
      totalAmount: 420,
      percentage: 13.13,
      transactionCount: 8,
      trend: 'down',
      recentTransactions: ['Gas - $60', 'Taxi - $25', 'Bus Pass - $50']
    },
    {
      category: 'Utilities',
      totalAmount: 320,
      percentage: 10.0,
      transactionCount: 3,
      trend: 'stable',
      recentTransactions: ['Electric - $120', 'Water - $80', 'Internet - $60']
    },
    {
      category: 'Entertainment',
      totalAmount: 680,
      percentage: 21.25,
      transactionCount: 9,
      trend: 'up',
      recentTransactions: ['Movie - $15', 'Gaming - $20', 'Concert - $75']
    },
    {
      category: 'Shopping',
      totalAmount: 930,
      percentage: 29.06,
      transactionCount: 15,
      trend: 'up',
      recentTransactions: ['Clothes - $120', 'Electronics - $300', 'Books - $35']
    }
  ],
  budgetTracking: {
    budgetLimit: 3500,
    currentSpending: 3200,
    remaining: 300,
    percentageUsed: 91.43,
    status: 'warning',
    byCategory: {
      'Food': { limit: 1000, spent: 850, remaining: 150 },
      'Transport': { limit: 500, spent: 420, remaining: 80 },
      'Utilities': { limit: 400, spent: 320, remaining: 80 },
      'Entertainment': { limit: 800, spent: 680, remaining: 120 },
      'Shopping': { limit: 1000, spent: 930, remaining: 70 }
    }
  },
  insights: {
    message: 'You spent $3,200 this month across 5 categories',
    status: 'success',
    totalTransactions: 47,
    highestSpendingDay: '2025-10-15'
  },
  comparison: {
    currentMonth: 3200,
    previousMonth: 3100,
    changePercentage: 3.23,
    trend: 'up'
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);

  // Health check
  if (pathname === '/api/analytics/health' || pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.health));
    return;
  }

  // Monthly summary
  if (pathname === '/api/analytics/monthly-summary') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.monthlySummary));
    return;
  }

  // Spending forecast
  if (pathname === '/api/analytics/spending-forecast') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.spendingForecast));
    return;
  }

  // Category breakdown
  if (pathname === '/api/analytics/category-breakdown') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.categoryBreakdown));
    return;
  }

  // Budget tracking
  if (pathname === '/api/analytics/budget-tracking') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.budgetTracking));
    return;
  }

  // Insights
  if (pathname === '/api/analytics/insights') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.insights));
    return;
  }

  // Monthly comparison
  if (pathname === '/api/analytics/monthly-comparison') {
    res.writeHead(200);
    res.end(JSON.stringify(mockData.comparison));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  Mock Analytics Service');
  console.log('========================================');
  console.log(`  ✅ Server running on http://localhost:${PORT}`);
  console.log(`  📊 Health check: http://localhost:${PORT}/health`);
  console.log('  ');
  console.log('  Available endpoints:');
  console.log('  - /api/analytics/health');
  console.log('  - /api/analytics/monthly-summary');
  console.log('  - /api/analytics/spending-forecast');
  console.log('  - /api/analytics/category-breakdown');
  console.log('  - /api/analytics/budget-tracking');
  console.log('  - /api/analytics/insights');
  console.log('  - /api/analytics/monthly-comparison');
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('========================================');
  console.log('');
});
