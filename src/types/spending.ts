/** Types for the Customer Spending Insights API (see src/docs). Amounts are in rands (ZAR). */

/**
 * '7d' | '30d' | '90d' | '1y' come from the API spec. 'mtd' (month to date:
 * the 1st of the current calendar month up to today) is an addition to it.
 */
export type Period = 'mtd' | '7d' | '30d' | '90d' | '1y';

export type SortBy = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export type CategoryIcon = 'shopping-cart' | 'film' | 'car' | 'utensils' | 'shopping-bag' | 'zap';

export interface CustomerProfile {
  customerId: string;
  name: string;
  email: string;
  joinDate: string;
  accountType: string;
  totalSpent: number;
  currency: string;
}

export interface SpendingSummary {
  period: Period;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string | null;
  comparedToPrevious: {
    spentChange: number;
    transactionChange: number;
  };
}

export interface CategorySpend {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: CategoryIcon;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SpendingByCategory {
  dateRange: DateRange;
  totalAmount: number;
  categories: CategorySpend[];
}

export interface MonthlyTrend {
  month: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface SpendingTrends {
  trends: MonthlyTrend[];
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: CategoryIcon;
  categoryColor: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export type GoalStatus = 'on_track' | 'warning' | 'exceeded';

export interface SpendingGoal {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: GoalStatus;
}

export interface GoalsResponse {
  goals: SpendingGoal[];
}

export interface FilterCategory {
  name: string;
  color: string;
  icon: CategoryIcon;
}

export interface DateRangePreset {
  label: string;
  value: Period;
}

export interface FiltersResponse {
  categories: FilterCategory[];
  dateRangePresets: DateRangePreset[];
}

/* ---- Request params ---- */

export interface CategoryParams {
  period?: Period;
  startDate?: string;
  endDate?: string;
}

export interface TransactionParams {
  limit?: number;
  offset?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: SortBy;
}
