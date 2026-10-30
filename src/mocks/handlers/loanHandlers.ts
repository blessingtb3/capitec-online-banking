import type {
  AffordabilityScore,
  EligibilityRequest,
  EligibilityResponse,
  EmploymentStatus,
  LoanProduct,
  LoanProductId,
  RateRequest,
  RateResponse,
  RiskCategory,
} from '../../types/loans';
import { buildPaymentSchedule, monthlyPayment, principalForPayment, roundToCents } from '../../utils/loanMath';
import { validateLoanApplication } from '../../utils/validateLoanApplication';
import { loanProducts, validationRules } from '../data/loans';
import { MockHttpError } from '../MockHttpError';

/**
 * Mock credit engine. These rules are illustrative and simple on purpose;
 * they are not a real bank's credit policy.
 *
 *  - Rate: set by credit score within the product's rate range.
 *  - Affordable repayment: 85% of disposable income (income − expenses).
 *  - Eligible when the person passes the hard checks, the repayment is
 *    affordable and total debt repayments stay at or below 60% of income.
 */

export const AFFORDABLE_SHARE_OF_DISPOSABLE = 0.85;
export const MAX_TOTAL_DEBT_TO_INCOME = 0.6;
export const MIN_CREDIT_SCORE = 500;
/** Used when the customer doesn't supply a credit score (it is optional). */
export const DEFAULT_CREDIT_SCORE = 600;

const VEHICLE_PURPOSES = ['new_vehicle', 'used_vehicle'];

function findProduct(id: LoanProductId): LoanProduct {
  const product = loanProducts.products.find((p) => p.id === id);
  if (!product) throw new MockHttpError(400, `Unknown loan type "${id}".`);
  return product;
}

/** Credit-score bands mapped onto the product's rate range. */
export function interestRateFor(product: LoanProduct, creditScore = DEFAULT_CREDIT_SCORE): number {
  const { min, max } = product.interestRateRange;
  const position = creditScore >= 750 ? 0 : creditScore >= 650 ? 0.25 : creditScore >= 550 ? 0.5 : creditScore >= 450 ? 0.75 : 1;
  return Math.round((min + (max - min) * position) * 100) / 100;
}

/* ------------------------------------------------------------------ */
/* GET /api/loans/products, GET /api/loans/validation-rules            */
/* ------------------------------------------------------------------ */

export const getLoanProducts = () => loanProducts;
export const getValidationRules = () => validationRules;

/* ------------------------------------------------------------------ */
/* POST /api/loans/calculate-rate                                      */
/* ------------------------------------------------------------------ */

export function calculateRate(body: RateRequest): RateResponse {
  const product = findProduct(body.loanType);
  if (!(body.loanAmount >= product.minAmount && body.loanAmount <= product.maxAmount)) {
    throw new MockHttpError(400, `Loan amount must be between R${product.minAmount} and R${product.maxAmount}.`);
  }
  if (!(Number.isInteger(body.loanTerm) && body.loanTerm >= product.minTerm && body.loanTerm <= product.maxTerm)) {
    throw new MockHttpError(400, `Loan term must be between ${product.minTerm} and ${product.maxTerm} months.`);
  }

  const interestRate = interestRateFor(product, body.creditScore);
  const payment = monthlyPayment(body.loanAmount, interestRate, body.loanTerm);
  const paymentSchedule = buildPaymentSchedule(body.loanAmount, interestRate, body.loanTerm);
  const totalRepayment = roundToCents(paymentSchedule.reduce((total, row) => total + row.payment, 0));

  return {
    interestRate,
    monthlyPayment: payment,
    totalInterest: roundToCents(totalRepayment - body.loanAmount),
    totalRepayment,
    paymentSchedule,
  };
}

/* ------------------------------------------------------------------ */
/* POST /api/loans/eligibility                                         */
/* ------------------------------------------------------------------ */

const EMPLOYMENT_POINTS: Record<EmploymentStatus, number> = {
  employed: 10,
  self_employed: 7,
  retired: 5,
  unemployed: 0,
};

function affordabilityScoreFor(paymentToDisposable: number): AffordabilityScore {
  if (paymentToDisposable <= 0.5) return 'excellent';
  if (paymentToDisposable <= 0.75) return 'good';
  if (paymentToDisposable <= 0.9) return 'fair';
  return 'poor';
}

function riskCategoryFor(likelihood: number): RiskCategory {
  if (likelihood >= 75) return 'low';
  if (likelihood >= 50) return 'medium';
  return 'high';
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function checkEligibility(body: EligibilityRequest): EligibilityResponse {
  const productId: LoanProductId = VEHICLE_PURPOSES.includes(body.loanDetails.loanPurpose)
    ? 'vehicle_loan'
    : 'personal_loan';
  const product = findProduct(productId);

  // Server-side validation mirrors the rules the form uses.
  const errors = validateLoanApplication(body, validationRules, product);
  const firstError = Object.values(errors)[0];
  if (firstError) throw new MockHttpError(400, firstError);

  const { personalInfo, financialInfo, loanDetails } = body;
  const { monthlyIncome, monthlyExpenses, existingDebt } = financialInfo;
  const creditScore = financialInfo.creditScore ?? DEFAULT_CREDIT_SCORE;

  const interestRate = interestRateFor(product, creditScore);
  const disposableIncome = roundToCents(monthlyIncome - monthlyExpenses);
  const affordablePayment = Math.max(0, disposableIncome * AFFORDABLE_SHARE_OF_DISPOSABLE);
  const requestedPayment = monthlyPayment(loanDetails.requestedAmount, interestRate, loanDetails.loanTerm);

  const maxAmount = Math.min(
    product.maxAmount,
    Math.floor(principalForPayment(affordablePayment, interestRate, loanDetails.loanTerm) / 1000) * 1000,
  );
  const recommendedAmount = maxAmount >= product.minAmount ? Math.min(loanDetails.requestedAmount, maxAmount) : 0;
  const recommendedPayment = monthlyPayment(recommendedAmount, interestRate, loanDetails.loanTerm);

  const totalDebtToIncome = (existingDebt + requestedPayment) / monthlyIncome;

  // Hard checks, in the order we'd explain them to a customer.
  let declineReason: string | null = null;
  if (personalInfo.employmentStatus === 'unemployed') {
    declineReason = 'A regular income from employment, self-employment or a pension is required';
  } else if (creditScore < MIN_CREDIT_SCORE) {
    declineReason = `A credit score of at least ${MIN_CREDIT_SCORE} is required`;
  } else if (disposableIncome <= 0) {
    declineReason = 'Monthly expenses are equal to or higher than monthly income';
  } else if (requestedPayment > affordablePayment) {
    declineReason =
      recommendedAmount > 0
        ? 'The repayment on the requested amount is higher than what your disposable income can comfortably cover'
        : 'Your disposable income cannot cover the repayment on the minimum loan amount';
  } else if (totalDebtToIncome > MAX_TOTAL_DEBT_TO_INCOME) {
    declineReason = 'Existing debt plus this repayment would take up too much of your income';
  }
  const isEligible = declineReason === null;

  // Likelihood: a simple, explainable score out of 100.
  const creditPoints = clamp(((creditScore - 300) / 550) * 25, 0, 25);
  const headroomPoints = affordablePayment > 0 ? clamp((1 - requestedPayment / affordablePayment) * 10, 0, 10) : 0;
  const employmentPoints = EMPLOYMENT_POINTS[personalInfo.employmentStatus];
  const approvalLikelihood = isEligible
    ? Math.round(clamp(55 + creditPoints + headroomPoints + employmentPoints, 0, 97))
    : Math.round(clamp(10 + creditPoints, 5, 40));

  const decisionReason = isEligible
    ? creditScore >= 650 && totalDebtToIncome <= 0.5
      ? 'Strong income-to-expense ratio and manageable existing debt'
      : 'The repayment is affordable, but your credit score or existing debt adds some risk'
    : declineReason!;

  return {
    eligibilityResult: {
      isEligible,
      approvalLikelihood,
      riskCategory: riskCategoryFor(approvalLikelihood),
      decisionReason,
    },
    recommendedLoan: {
      maxAmount: Math.max(0, maxAmount),
      recommendedAmount,
      interestRate,
      monthlyPayment: recommendedPayment,
      totalRepayment: roundToCents(recommendedPayment * loanDetails.loanTerm),
    },
    affordabilityAnalysis: {
      disposableIncome,
      debtToIncomeRatio: Math.round((existingDebt / monthlyIncome) * 1000) / 10,
      loanToIncomeRatio: Math.round((loanDetails.requestedAmount / (monthlyIncome * 12)) * 1000) / 10,
      affordabilityScore: disposableIncome > 0 ? affordabilityScoreFor(requestedPayment / disposableIncome) : 'poor',
    },
  };
}
