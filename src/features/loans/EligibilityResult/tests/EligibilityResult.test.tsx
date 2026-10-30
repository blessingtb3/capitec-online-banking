import { render, screen } from '@testing-library/react';
import type { EligibilityRequest, EligibilityResponse } from '../../../../types/loans';
import { EligibilityResult } from '../EligibilityResult';

// Request and response examples straight from the API spec.
const request: EligibilityRequest = {
  personalInfo: { age: 35, employmentStatus: 'employed', employmentDuration: 24 },
  financialInfo: { monthlyIncome: 25000, monthlyExpenses: 15000, existingDebt: 5000, creditScore: 650 },
  loanDetails: { requestedAmount: 150000, loanTerm: 24, loanPurpose: 'home_improvement' },
};

const response: EligibilityResponse = {
  eligibilityResult: {
    isEligible: true,
    approvalLikelihood: 85,
    riskCategory: 'low',
    decisionReason: 'Strong income-to-expense ratio and manageable existing debt',
  },
  recommendedLoan: {
    maxAmount: 180000,
    recommendedAmount: 150000,
    interestRate: 12.5,
    monthlyPayment: 7089.5,
    totalRepayment: 170148,
  },
  affordabilityAnalysis: {
    disposableIncome: 10000,
    debtToIncomeRatio: 20,
    loanToIncomeRatio: 60,
    affordabilityScore: 'good',
  },
};

describe('EligibilityResult', () => {
  it('presents an eligible result', () => {
    render(<EligibilityResult result={response} request={request} />);
    expect(screen.getByRole('heading', { name: 'You’re likely to qualify' })).toBeInTheDocument();
    expect(screen.getByText('Strong income-to-expense ratio and manageable existing debt.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Approval likelihood' })).toHaveAttribute('aria-valuenow', '85');
    expect(screen.getByTestId('monthly-payment')).toHaveTextContent('R7 089.50');
    expect(screen.getByText('R180 000')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('notes when the recommended amount is lower than requested', () => {
    const reduced = { ...response, recommendedLoan: { ...response.recommendedLoan, recommendedAmount: 120000 } };
    render(<EligibilityResult result={reduced} request={request} />);
    expect(screen.getByText(/you asked for R150 000/)).toBeInTheDocument();
  });

  it('presents a decline with its reason and no repayment figure', () => {
    const declined: EligibilityResponse = {
      ...response,
      eligibilityResult: { isEligible: false, approvalLikelihood: 20, riskCategory: 'high', decisionReason: 'Monthly expenses are equal to or higher than monthly income' },
      recommendedLoan: { ...response.recommendedLoan, maxAmount: 0, recommendedAmount: 0, monthlyPayment: 0, totalRepayment: 0 },
    };
    render(<EligibilityResult result={declined} request={request} />);
    expect(screen.getByRole('heading', { name: 'You’re unlikely to qualify right now' })).toBeInTheDocument();
    expect(screen.queryByTestId('monthly-payment')).not.toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });
});
