import type { EligibilityRequest, EmploymentStatus, LoanProductId, LoanPurpose } from '../../../types/loans';
import { parseAmount } from '../../../utils/parseAmount';

/** Raw form state: strings, exactly as typed. */
export interface LoanFormValues {
  productId: LoanProductId;
  age: string;
  employmentStatus: EmploymentStatus | '';
  employmentDuration: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  existingDebt: string;
  creditScore: string;
  requestedAmount: string;
  loanTerm: string;
  loanPurpose: LoanPurpose | '';
}

export const EMPTY_VALUES: LoanFormValues = {
  productId: 'personal_loan',
  age: '',
  employmentStatus: '',
  employmentDuration: '',
  monthlyIncome: '',
  monthlyExpenses: '',
  existingDebt: '',
  creditScore: '',
  requestedAmount: '',
  loanTerm: '',
  loanPurpose: '',
};

/** The request example from the API spec, for the "Use example" shortcut. */
export const EXAMPLE_VALUES: LoanFormValues = {
  productId: 'personal_loan',
  age: '35',
  employmentStatus: 'employed',
  employmentDuration: '24',
  monthlyIncome: '25000',
  monthlyExpenses: '15000',
  existingDebt: '5000',
  creditScore: '650',
  requestedAmount: '150000',
  loanTerm: '24',
  loanPurpose: 'home_improvement',
};

/** Converts form strings into the API request shape. */
export function toEligibilityRequest(values: LoanFormValues): EligibilityRequest {
  return {
    personalInfo: {
      age: parseAmount(values.age),
      employmentStatus: values.employmentStatus as EmploymentStatus,
      // Duration only applies to people who are working.
      employmentDuration:
        values.employmentStatus === 'employed' || values.employmentStatus === 'self_employed'
          ? parseAmount(values.employmentDuration)
          : 0,
    },
    financialInfo: {
      monthlyIncome: parseAmount(values.monthlyIncome),
      monthlyExpenses: parseAmount(values.monthlyExpenses),
      // Optional fields: blank existing debt means none; blank credit score is omitted.
      existingDebt: values.existingDebt.trim() === '' ? 0 : parseAmount(values.existingDebt),
      ...(values.creditScore.trim() === '' ? {} : { creditScore: parseAmount(values.creditScore) }),
    },
    loanDetails: {
      requestedAmount: parseAmount(values.requestedAmount),
      loanTerm: parseAmount(values.loanTerm),
      loanPurpose: values.loanPurpose as LoanPurpose,
    },
  };
}

const isFilled = (value: string) => value.trim() !== '';

/**
 * True once every required field has a value, so the submit button can be
 * enabled. Existing debt and credit score are optional, and months employed
 * only applies to people who are working. Range checks happen on submit.
 */
export function isFormComplete(values: LoanFormValues): boolean {
  const isWorking = values.employmentStatus === 'employed' || values.employmentStatus === 'self_employed';
  return (
    isFilled(values.age) &&
    values.employmentStatus !== '' &&
    (!isWorking || isFilled(values.employmentDuration)) &&
    isFilled(values.monthlyIncome) &&
    isFilled(values.monthlyExpenses) &&
    values.loanPurpose !== '' &&
    isFilled(values.requestedAmount) &&
    isFilled(values.loanTerm)
  );
}
