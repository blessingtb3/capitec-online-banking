import type { MonthlyTrend } from '../../types/spending';

/**
 * 24 months of spending trends (the API's maximum). Jan–Jun 2024 are taken
 * verbatim from the API spec; the surrounding months extend the series so the
 * 6/12/24-month views have data. Sep 2024 is month-to-date (mock "today" is
 * 16 Sep 2024).
 */
export const monthlyTrends: MonthlyTrend[] = [
  { month: '2022-10', totalSpent: 3720.40, transactionCount: 41, averageTransaction: 90.74 },
  { month: '2022-11', totalSpent: 3955.10, transactionCount: 43, averageTransaction: 91.98 },
  { month: '2022-12', totalSpent: 5120.85, transactionCount: 52, averageTransaction: 98.48 },
  { month: '2023-01', totalSpent: 4310.20, transactionCount: 46, averageTransaction: 93.70 },
  { month: '2023-02', totalSpent: 3610.75, transactionCount: 39, averageTransaction: 92.58 },
  { month: '2023-03', totalSpent: 3842.30, transactionCount: 42, averageTransaction: 91.48 },
  { month: '2023-04', totalSpent: 3705.90, transactionCount: 40, averageTransaction: 92.65 },
  { month: '2023-05', totalSpent: 3920.45, transactionCount: 44, averageTransaction: 89.10 },
  { month: '2023-06', totalSpent: 4015.60, transactionCount: 45, averageTransaction: 89.24 },
  { month: '2023-07', totalSpent: 3880.15, transactionCount: 41, averageTransaction: 94.64 },
  { month: '2023-08', totalSpent: 4102.70, transactionCount: 46, averageTransaction: 89.19 },
  { month: '2023-09', totalSpent: 3790.35, transactionCount: 40, averageTransaction: 94.76 },
  { month: '2023-10', totalSpent: 3965.80, transactionCount: 43, averageTransaction: 92.23 },
  { month: '2023-11', totalSpent: 4180.25, transactionCount: 45, averageTransaction: 92.89 },
  { month: '2023-12', totalSpent: 5385.40, transactionCount: 55, averageTransaction: 97.92 },
  { month: '2024-01', totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
  { month: '2024-02', totalSpent: 4150.80, transactionCount: 38, averageTransaction: 109.23 },
  { month: '2024-03', totalSpent: 3750.60, transactionCount: 45, averageTransaction: 83.35 },
  { month: '2024-04', totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.70 },
  { month: '2024-05', totalSpent: 3980.30, transactionCount: 44, averageTransaction: 90.46 },
  { month: '2024-06', totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
  { month: '2024-07', totalSpent: 4105.20, transactionCount: 45, averageTransaction: 91.23 },
  { month: '2024-08', totalSpent: 4390.15, transactionCount: 48, averageTransaction: 91.46 },
  { month: '2024-09', totalSpent: 2310.60, transactionCount: 26, averageTransaction: 88.87 },
];
