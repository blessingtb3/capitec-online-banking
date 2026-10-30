import { EMPTY_VALUES, EXAMPLE_VALUES, isFormComplete, type LoanFormValues } from '../loanFormValues';

describe('isFormComplete', () => {
  it('is false for an empty form and true for the example values', () => {
    expect(isFormComplete(EMPTY_VALUES)).toBe(false);
    expect(isFormComplete(EXAMPLE_VALUES)).toBe(true);
  });

  it.each<keyof LoanFormValues>([
    'age',
    'employmentStatus',
    'employmentDuration',
    'monthlyIncome',
    'monthlyExpenses',
    'loanPurpose',
    'requestedAmount',
    'loanTerm',
  ])('is false when the required field "%s" is empty', (field) => {
    expect(isFormComplete({ ...EXAMPLE_VALUES, [field]: '' })).toBe(false);
  });

  it('treats whitespace as empty', () => {
    expect(isFormComplete({ ...EXAMPLE_VALUES, monthlyIncome: '   ' })).toBe(false);
  });

  it('does not need existing debt or a credit score', () => {
    expect(isFormComplete({ ...EXAMPLE_VALUES, existingDebt: '', creditScore: '' })).toBe(true);
  });

  it('does not need months employed when retired or unemployed', () => {
    expect(isFormComplete({ ...EXAMPLE_VALUES, employmentStatus: 'retired', employmentDuration: '' })).toBe(true);
    expect(isFormComplete({ ...EXAMPLE_VALUES, employmentStatus: 'unemployed', employmentDuration: '' })).toBe(true);
    expect(isFormComplete({ ...EXAMPLE_VALUES, employmentStatus: 'self_employed', employmentDuration: '' })).toBe(false);
  });
});
