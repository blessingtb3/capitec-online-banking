import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '../mocks/mockBaseQuery';

/**
 * Root RTK Query API. Feature endpoints are added with injectEndpoints in
 * spendingApi.ts and loansApi.ts. To use a real backend, swap mockBaseQuery
 * for fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }).
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: mockBaseQuery,
  endpoints: () => ({}),
});
