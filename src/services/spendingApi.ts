import type {
  CategoryParams,
  CustomerProfile,
  FiltersResponse,
  GoalsResponse,
  Period,
  SpendingByCategory,
  SpendingSummary,
  SpendingTrends,
  TransactionParams,
  TransactionsResponse,
} from '../types/spending';
import { baseApi } from './baseApi';

const customerUrl = (customerId: string) => `/api/customers/${customerId}`;

export const spendingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomerProfile: build.query<CustomerProfile, string>({
      query: (customerId) => ({ url: `${customerUrl(customerId)}/profile` }),
    }),
    getSpendingSummary: build.query<SpendingSummary, { customerId: string; period: Period }>({
      query: ({ customerId, period }) => ({ url: `${customerUrl(customerId)}/spending/summary`, params: { period } }),
    }),
    getSpendingByCategory: build.query<SpendingByCategory, { customerId: string } & CategoryParams>({
      query: ({ customerId, ...params }) => ({ url: `${customerUrl(customerId)}/spending/categories`, params }),
    }),
    getSpendingTrends: build.query<SpendingTrends, { customerId: string; months: number }>({
      query: ({ customerId, months }) => ({ url: `${customerUrl(customerId)}/spending/trends`, params: { months } }),
    }),
    getTransactions: build.query<TransactionsResponse, { customerId: string } & TransactionParams>({
      query: ({ customerId, ...params }) => ({ url: `${customerUrl(customerId)}/transactions`, params }),
    }),
    getGoals: build.query<GoalsResponse, string>({
      query: (customerId) => ({ url: `${customerUrl(customerId)}/goals` }),
    }),
    getFilters: build.query<FiltersResponse, string>({
      query: (customerId) => ({ url: `${customerUrl(customerId)}/filters` }),
    }),
  }),
});

export const {
  useGetCustomerProfileQuery,
  useGetSpendingSummaryQuery,
  useGetSpendingByCategoryQuery,
  useGetSpendingTrendsQuery,
  useGetTransactionsQuery,
  useGetGoalsQuery,
  useGetFiltersQuery,
} = spendingApi;
