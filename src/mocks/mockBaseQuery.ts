import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { EligibilityRequest, RateRequest } from '../types/loans';
import type { CategoryParams, TransactionParams } from '../types/spending';
import { customerProfile, filters, goals } from './data/customer';
import { calculateRate, checkEligibility, getLoanProducts, getValidationRules } from './handlers/loanHandlers';
import {
  assertCustomer,
  getSpendingByCategory,
  getSpendingSummary,
  getSpendingTrends,
  getTransactions,
} from './handlers/spendingHandlers';
import { MockHttpError } from './MockHttpError';

/**
 * A drop-in RTK Query base query that answers from local mock data instead
 * of the network. Endpoints are written exactly as they would be against a
 * real API (url, method, params, body), so switching to the real backend
 * means replacing this with `fetchBaseQuery({ baseUrl })` and nothing else.
 */

export interface MockRequest {
  url: string;
  method?: 'GET' | 'POST';
  /** Query-string params, as an object (like fetchBaseQuery's `params`). */
  params?: object;
  body?: unknown;
}

export interface MockError {
  status: number;
  data: { message: string };
}

type Handler = (match: RegExpMatchArray, request: MockRequest) => unknown;

interface Route {
  method: 'GET' | 'POST';
  path: RegExp;
  handler: Handler;
}

const withCustomer =
  (handler: Handler): Handler =>
  (match, request) => {
    assertCustomer(match[1]);
    return handler(match, request);
  };

const routes: Route[] = [
  { method: 'GET', path: /^\/api\/customers\/([^/]+)\/profile$/, handler: withCustomer(() => customerProfile) },
  {
    method: 'GET',
    path: /^\/api\/customers\/([^/]+)\/spending\/summary$/,
    handler: withCustomer((_, { params }) => getSpendingSummary((params ?? {}) as { period?: unknown })),
  },
  {
    method: 'GET',
    path: /^\/api\/customers\/([^/]+)\/spending\/categories$/,
    handler: withCustomer((_, { params }) => getSpendingByCategory((params ?? {}) as CategoryParams)),
  },
  {
    method: 'GET',
    path: /^\/api\/customers\/([^/]+)\/spending\/trends$/,
    handler: withCustomer((_, { params }) => getSpendingTrends((params ?? {}) as { months?: unknown })),
  },
  {
    method: 'GET',
    path: /^\/api\/customers\/([^/]+)\/transactions$/,
    handler: withCustomer((_, { params }) => getTransactions((params ?? {}) as TransactionParams)),
  },
  { method: 'GET', path: /^\/api\/customers\/([^/]+)\/goals$/, handler: withCustomer(() => goals) },
  { method: 'GET', path: /^\/api\/customers\/([^/]+)\/filters$/, handler: withCustomer(() => filters) },
  { method: 'GET', path: /^\/api\/loans\/products$/, handler: () => getLoanProducts() },
  { method: 'GET', path: /^\/api\/loans\/validation-rules$/, handler: () => getValidationRules() },
  {
    method: 'POST',
    path: /^\/api\/loans\/eligibility$/,
    handler: (_, { body }) => checkEligibility(body as EligibilityRequest),
  },
  {
    method: 'POST',
    path: /^\/api\/loans\/calculate-rate$/,
    handler: (_, { body }) => calculateRate(body as RateRequest),
  },
];

/** Simulated network delay so loading states are visible. Zero under test. */
export const MOCK_LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lets reviewers see error states: add ?mockError=spending or ?mockError=loans
 * to the page URL and every request in that area fails with a 503.
 */
function forcedError(url: string): boolean {
  if (typeof window === 'undefined') return false;
  const area = new URLSearchParams(window.location.search).get('mockError');
  return (area === 'spending' && url.startsWith('/api/customers')) || (area === 'loans' && url.startsWith('/api/loans'));
}

/** Pure request → response routing, exported for unit tests. */
export function routeMockRequest(request: MockRequest): { data: unknown } | { error: MockError } {
  const method = request.method ?? 'GET';
  try {
    if (forcedError(request.url)) throw new MockHttpError(503, 'The service is temporarily unavailable.');
    for (const route of routes) {
      const match = request.url.match(route.path);
      if (match && route.method === method) return { data: route.handler(match, request) };
    }
    throw new MockHttpError(404, `No mock route for ${method} ${request.url}`);
  } catch (error) {
    if (error instanceof MockHttpError) {
      return { error: { status: error.status, data: { message: error.message } } };
    }
    return { error: { status: 500, data: { message: 'Something went wrong. Please try again.' } } };
  }
}

export const mockBaseQuery: BaseQueryFn<MockRequest | string, unknown, MockError> = async (args) => {
  const request = typeof args === 'string' ? { url: args } : args;
  if (MOCK_LATENCY_MS > 0) await wait(MOCK_LATENCY_MS);
  // Return copies so cached data can never be mutated through a shared reference.
  const result = routeMockRequest(request);
  return 'data' in result ? { data: JSON.parse(JSON.stringify(result.data)) } : result;
};
