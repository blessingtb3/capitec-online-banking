import type { EligibilityRequest, LoanProduct, NumberRule, ValidationRules } from '../types/loans';

export type LoanField =
  | 'age'
  | 'employmentStatus'
  | 'employmentDuration'
  | 'monthlyIncome'
  | 'monthlyExpenses'
  | 'existingDebt'
  | 'creditScore'
  | 'requestedAmount'
  | 'loanTerm'
  | 'loanPurpose';

export type LoanErrors = Partial<Record<LoanField, string>>;

/** Optional numbers arrive as undefined; required-but-empty ones as NaN. */
function checkNumber(value: number | undefined, rule: NumberRule): string | undefined {
  if (value === undefined || Number.isNaN(value)) return rule.required ? rule.errorMessage : undefined;
  if (rule.min !== undefined && value < rule.min) return rule.errorMessage;
  if (rule.max !== undefined && value > rule.max) return rule.errorMessage;
  return undefined;
}

const rand = (value: number) => `R${value.toLocaleString('en-US')}`;

/**
 * Validates a loan application against the API's validation rules.
 * Amount and term limits come from the selected product when it differs
 * from the rules (the rules describe the personal loan).
 * Returns an empty object when everything is valid.
 */
export function validateLoanApplication(
  application: EligibilityRequest,
  rules: ValidationRules,
  product: LoanProduct,
): LoanErrors {
  const { personalInfo, financialInfo, loanDetails } = application;
  const errors: LoanErrors = {};

  errors.age = checkNumber(personalInfo.age, rules.personalInfo.age);

  if (!rules.personalInfo.employmentStatus.options.includes(personalInfo.employmentStatus)) {
    errors.employmentStatus = rules.personalInfo.employmentStatus.errorMessage;
  }

  // Employment duration only applies to people who are working.
  if (personalInfo.employmentStatus === 'employed' || personalInfo.employmentStatus === 'self_employed') {
    errors.employmentDuration = checkNumber(personalInfo.employmentDuration, rules.personalInfo.employmentDuration);
  }

  errors.monthlyIncome = checkNumber(financialInfo.monthlyIncome, rules.financialInfo.monthlyIncome);
  errors.monthlyExpenses = checkNumber(financialInfo.monthlyExpenses, rules.financialInfo.monthlyExpenses);
  if (Number.isNaN(financialInfo.existingDebt) || financialInfo.existingDebt < 0) {
    errors.existingDebt = 'Existing debt repayments cannot be negative';
  }
  errors.creditScore = checkNumber(financialInfo.creditScore, rules.financialInfo.creditScore);

  const amountRule: NumberRule = {
    ...rules.loanDetails.requestedAmount,
    min: product.minAmount,
    max: product.maxAmount,
    errorMessage:
      product.minAmount === rules.loanDetails.requestedAmount.min &&
      product.maxAmount === rules.loanDetails.requestedAmount.max
        ? rules.loanDetails.requestedAmount.errorMessage
        : `Loan amount must be between ${rand(product.minAmount)} and ${rand(product.maxAmount)}`,
  };
  errors.requestedAmount = checkNumber(loanDetails.requestedAmount, amountRule);

  const termRule: NumberRule = {
    ...rules.loanDetails.loanTerm,
    min: product.minTerm,
    max: product.maxTerm,
    errorMessage:
      product.minTerm === rules.loanDetails.loanTerm.min && product.maxTerm === rules.loanDetails.loanTerm.max
        ? rules.loanDetails.loanTerm.errorMessage
        : `Loan term must be between ${product.minTerm} and ${product.maxTerm} months`,
  };
  errors.loanTerm = checkNumber(loanDetails.loanTerm, termRule);

  if (!product.purposes.includes(loanDetails.loanPurpose)) {
    errors.loanPurpose = 'Please choose what the loan is for';
  }

  // Drop the fields that passed.
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as LoanErrors;
}
