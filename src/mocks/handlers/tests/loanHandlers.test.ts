import { loanProducts } from '../../data/loans';
import type { EligibilityRequest } from '../../../types/loans';
import { calculateRate, checkEligibility, interestRateFor } from '../loanHandlers';

const [personal, vehicle] = loanProducts.products;

// The request example from the API spec.
const specRequest: EligibilityRequest = {
  personalInfo: { age: 35, employmentStatus: 'employed', employmentDuration: 24 },
  financialInfo: { monthlyIncome: 25000, monthlyExpenses: 15000, existingDebt: 5000, creditScore: 650 },
  loanDetails: { requestedAmount: 150000, loanTerm: 24, loanPurpose: 'home_improvement' },
};

const withFinancials = (financialInfo: Partial<EligibilityRequest['financialInfo']>): EligibilityRequest => ({
  ...specRequest,
  financialInfo: { ...specRequest.financialInfo, ...financialInfo },
});

describe('interestRateFor', () => {
  it('maps credit scores onto the product’s rate range', () => {
    expect(interestRateFor(personal, 800)).toBe(10.5);
    expect(interestRateFor(personal, 650)).toBe(12.5);
    expect(interestRateFor(personal, 300)).toBe(18.5);
    expect(interestRateFor(vehicle, 800)).toBe(8.5);
  });
});

describe('checkEligibility', () => {
  it('reproduces the spec example’s outcome', () => {
    const result = checkEligibility(specRequest);
    expect(result.eligibilityResult).toMatchObject({ isEligible: true, riskCategory: 'low' });
    expect(result.eligibilityResult.approvalLikelihood).toBeGreaterThanOrEqual(80);
    expect(result.recommendedLoan).toMatchObject({ recommendedAmount: 150000, interestRate: 12.5 });
    expect(result.recommendedLoan.maxAmount).toBeGreaterThanOrEqual(175000);
    expect(result.affordabilityAnalysis).toMatchObject({
      disposableIncome: 10000,
      debtToIncomeRatio: 20,
      affordabilityScore: 'good',
    });
  });

  it('recommends a smaller amount when the request is unaffordable', () => {
    const result = checkEligibility({ ...specRequest, loanDetails: { ...specRequest.loanDetails, requestedAmount: 250000 } });
    expect(result.eligibilityResult.isEligible).toBe(false);
    expect(result.recommendedLoan.recommendedAmount).toBe(result.recommendedLoan.maxAmount);
    expect(result.recommendedLoan.recommendedAmount).toBeLessThan(250000);
  });

  it('declines when expenses exceed income', () => {
    const result = checkEligibility(withFinancials({ monthlyExpenses: 26000 }));
    expect(result.eligibilityResult.isEligible).toBe(false);
    expect(result.eligibilityResult.riskCategory).toBe('high');
    expect(result.recommendedLoan.recommendedAmount).toBe(0);
  });

  it('declines low credit scores and unemployed applicants', () => {
    expect(checkEligibility(withFinancials({ creditScore: 450 })).eligibilityResult.decisionReason).toMatch(/credit score/);
    const unemployed = checkEligibility({ ...specRequest, personalInfo: { ...specRequest.personalInfo, employmentStatus: 'unemployed' } });
    expect(unemployed.eligibilityResult.isEligible).toBe(false);
  });

  it('rejects invalid requests with the API’s validation message', () => {
    expect(() => checkEligibility({ ...specRequest, personalInfo: { ...specRequest.personalInfo, age: 70 } })).toThrow(
      'Age must be between 18 and 65',
    );
  });

  it('routes vehicle purposes to vehicle finance limits', () => {
    const result = checkEligibility({
      ...specRequest,
      financialInfo: { ...specRequest.financialInfo, monthlyIncome: 60000, monthlyExpenses: 20000 },
      loanDetails: { requestedAmount: 400000, loanTerm: 72, loanPurpose: 'used_vehicle' },
    });
    expect(result.recommendedLoan.interestRate).toBeLessThanOrEqual(vehicle.interestRateRange.max);
    expect(result.recommendedLoan.interestRate).toBeGreaterThanOrEqual(vehicle.interestRateRange.min);
  });
});

describe('calculateRate', () => {
  it('returns the spec shape with a full schedule', () => {
    const result = calculateRate({ loanAmount: 150000, loanTerm: 24, creditScore: 650, loanType: 'personal_loan' });
    expect(result.interestRate).toBe(12.5);
    expect(result.paymentSchedule).toHaveLength(24);
    expect(result.paymentSchedule[0]).toMatchObject({ month: 1, interest: 1562.5 });
    expect(result.totalRepayment).toBeCloseTo(result.totalInterest + 150000, 2);
  });

  it('rejects amounts outside the product range', () => {
    expect(() => calculateRate({ loanAmount: 1000, loanTerm: 24, loanType: 'personal_loan' })).toThrow(/between/);
    expect(() => calculateRate({ loanAmount: 100000, loanTerm: 24, loanType: 'mortgage' as never })).toThrow(/Unknown/);
  });
});
