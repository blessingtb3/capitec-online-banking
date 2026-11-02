import { loanProducts, validationRules } from '../../mocks/data/loans';
import type { EligibilityRequest } from '../../types/loans';
import { validateLoanApplication } from '../validateLoanApplication';

const [personal, vehicle] = loanProducts.products;

const valid: EligibilityRequest = {
  personalInfo: { age: 35, employmentStatus: 'employed', employmentDuration: 24 },
  financialInfo: { monthlyIncome: 25000, monthlyExpenses: 15000, existingDebt: 5000, creditScore: 650 },
  loanDetails: { requestedAmount: 150000, loanTerm: 24, loanPurpose: 'home_improvement' },
};

const withChanges = (changes: {
  personalInfo?: Partial<EligibilityRequest['personalInfo']>;
  financialInfo?: Partial<EligibilityRequest['financialInfo']>;
  loanDetails?: Partial<EligibilityRequest['loanDetails']>;
}): EligibilityRequest => ({
  personalInfo: { ...valid.personalInfo, ...changes.personalInfo },
  financialInfo: { ...valid.financialInfo, ...changes.financialInfo },
  loanDetails: { ...valid.loanDetails, ...changes.loanDetails },
});

describe('validateLoanApplication', () => {
  it('accepts the spec example', () => {
    expect(validateLoanApplication(valid, validationRules, personal)).toEqual({});
  });

  it('uses the API error messages', () => {
    const errors = validateLoanApplication(
      withChanges({ personalInfo: { age: 17, employmentDuration: 2 }, financialInfo: { monthlyIncome: 4000, creditScore: 900 } }),
      validationRules,
      personal,
    );
    expect(errors).toEqual({
      age: 'Age must be between 18 and 65',
      employmentDuration: 'Minimum 3 months employment required',
      monthlyIncome: 'Minimum monthly income of R5,000 required',
      creditScore: 'Credit score must be between 300 and 850',
    });
  });

  it('treats a missing credit score as fine (it is optional)', () => {
    const request = withChanges({});
    delete request.financialInfo.creditScore;
    expect(validateLoanApplication(request, validationRules, personal)).toEqual({});
  });

  it('flags empty required numbers', () => {
    const errors = validateLoanApplication(withChanges({ financialInfo: { monthlyExpenses: NaN } }), validationRules, personal);
    expect(errors.monthlyExpenses).toBe('Please enter your monthly expenses');
  });

  it('skips employment duration for people who are not working', () => {
    const errors = validateLoanApplication(
      withChanges({ personalInfo: { employmentStatus: 'retired', employmentDuration: 0 } }),
      validationRules,
      personal,
    );
    expect(errors.employmentDuration).toBeUndefined();
  });

  it('applies the selected product’s limits and purposes', () => {
    const errors = validateLoanApplication(
      withChanges({ loanDetails: { requestedAmount: 20000, loanTerm: 84 } }),
      validationRules,
      vehicle,
    );
    expect(errors.requestedAmount).toBe('Loan amount must be between R50,000 and R1,500,000');
    expect(errors.loanTerm).toBe('Loan term must be between 12 and 72 months');
    expect(errors.loanPurpose).toBe('Please choose what the loan is for');
  });
});
