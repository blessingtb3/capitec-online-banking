/** Types for the Loan Eligibility Simulator API (see src/docs). Amounts are in rands (ZAR). */

export type EmploymentStatus = 'employed' | 'self_employed' | 'unemployed' | 'retired';

export type LoanProductId = 'personal_loan' | 'vehicle_loan';

export type LoanPurpose =
  | 'debt_consolidation'
  | 'home_improvement'
  | 'education'
  | 'medical'
  | 'other'
  | 'new_vehicle'
  | 'used_vehicle';

export type RiskCategory = 'low' | 'medium' | 'high';

export type AffordabilityScore = 'excellent' | 'good' | 'fair' | 'poor';

export interface EligibilityRequest {
  personalInfo: {
    age: number;
    employmentStatus: EmploymentStatus;
    employmentDuration: number;
  };
  financialInfo: {
    monthlyIncome: number;
    monthlyExpenses: number;
    existingDebt: number;
    creditScore?: number;
  };
  loanDetails: {
    requestedAmount: number;
    loanTerm: number;
    loanPurpose: LoanPurpose;
  };
}

export interface EligibilityResponse {
  eligibilityResult: {
    isEligible: boolean;
    approvalLikelihood: number;
    riskCategory: RiskCategory;
    decisionReason: string;
  };
  recommendedLoan: {
    maxAmount: number;
    recommendedAmount: number;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
  };
  affordabilityAnalysis: {
    disposableIncome: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    affordabilityScore: AffordabilityScore;
  };
}

export interface LoanProduct {
  id: LoanProductId;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: { min: number; max: number };
  purposes: LoanPurpose[];
}

export interface LoanProductsResponse {
  products: LoanProduct[];
}

export interface RateRequest {
  loanAmount: number;
  loanTerm: number;
  creditScore?: number;
  loanType: LoanProductId;
}

export interface PaymentScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface RateResponse {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleRow[];
}

export interface NumberRule {
  min?: number;
  max?: number;
  required: boolean;
  errorMessage: string;
}

export interface OptionsRule {
  required: boolean;
  options: EmploymentStatus[];
  errorMessage: string;
}

export interface ValidationRules {
  personalInfo: {
    age: NumberRule;
    employmentStatus: OptionsRule;
    employmentDuration: NumberRule;
  };
  financialInfo: {
    monthlyIncome: NumberRule;
    monthlyExpenses: NumberRule;
    creditScore: NumberRule;
  };
  loanDetails: {
    requestedAmount: NumberRule;
    loanTerm: NumberRule;
  };
}
