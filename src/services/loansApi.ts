import type {
  EligibilityRequest,
  EligibilityResponse,
  LoanProductsResponse,
  RateRequest,
  RateResponse,
  ValidationRules,
} from '../types/loans';
import { baseApi } from './baseApi';

export const loansApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLoanProducts: build.query<LoanProductsResponse, void>({
      query: () => ({ url: '/api/loans/products' }),
    }),
    getValidationRules: build.query<ValidationRules, void>({
      query: () => ({ url: '/api/loans/validation-rules' }),
    }),
    checkEligibility: build.mutation<EligibilityResponse, EligibilityRequest>({
      query: (body) => ({ url: '/api/loans/eligibility', method: 'POST', body }),
    }),
    calculateRate: build.mutation<RateResponse, RateRequest>({
      query: (body) => ({ url: '/api/loans/calculate-rate', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetLoanProductsQuery,
  useGetValidationRulesQuery,
  useCheckEligibilityMutation,
  useCalculateRateMutation,
} = loansApi;
