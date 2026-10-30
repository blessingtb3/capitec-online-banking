import type { CustomerProfile, FiltersResponse, GoalsResponse } from '../../types/spending';

/** The customer every mock endpoint serves. */
export const CUSTOMER_ID = '12345';

/** The mock API's "today", matching the dates used in the API spec. */
export const MOCK_TODAY = '2024-09-16';

/** Verbatim from the API spec. */
export const customerProfile: CustomerProfile = {
  customerId: '12345',
  name: 'John Doe',
  email: 'john.doe@email.com',
  joinDate: '2023-01-15',
  accountType: 'premium',
  totalSpent: 15420.5,
  currency: 'ZAR',
};

/**
 * From the API spec, plus one addition: the "This month" (month-to-date)
 * preset, which the summary and categories endpoints accept as period=mtd.
 */
export const filters: FiltersResponse = {
  categories: [
    { name: 'Groceries', color: '#FF6B6B', icon: 'shopping-cart' },
    { name: 'Entertainment', color: '#4ECDC4', icon: 'film' },
    { name: 'Transportation', color: '#45B7D1', icon: 'car' },
    { name: 'Dining', color: '#F7DC6F', icon: 'utensils' },
    { name: 'Shopping', color: '#BB8FCE', icon: 'shopping-bag' },
    { name: 'Utilities', color: '#85C1E9', icon: 'zap' },
  ],
  dateRangePresets: [
    { label: 'This month', value: 'mtd' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' },
  ],
};

/** Verbatim from the API spec. */
export const goals: GoalsResponse = {
  goals: [
    {
      id: 'goal_001',
      category: 'Entertainment',
      monthlyBudget: 1000.0,
      currentSpent: 650.3,
      percentageUsed: 65.03,
      daysRemaining: 12,
      status: 'on_track',
    },
    {
      id: 'goal_002',
      category: 'Groceries',
      monthlyBudget: 1500.0,
      currentSpent: 1450.8,
      percentageUsed: 96.72,
      daysRemaining: 12,
      status: 'warning',
    },
  ],
};
