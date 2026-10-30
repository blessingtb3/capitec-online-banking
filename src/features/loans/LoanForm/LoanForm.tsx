import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button/Button';
import { SelectField, TextField } from '../../../components/FormField/FormField';
import type { EligibilityRequest, LoanProduct, LoanProductId, ValidationRules } from '../../../types/loans';
import { formatCurrency, humanise } from '../../../utils/format';
import { validateLoanApplication, type LoanErrors, type LoanField } from '../../../utils/validateLoanApplication';
import {
  Actions,
  ErrorSummary,
  Fieldset,
  Form,
  Legend,
  ProductCard,
  ProductMeta,
  ProductName,
  ProductOptions,
} from './LoanForm.styles';
import { EMPTY_VALUES, EXAMPLE_VALUES, toEligibilityRequest, type LoanFormValues } from './loanFormValues';

/** Field order on screen, used to focus the first invalid field. */
const FIELD_ORDER: LoanField[] = [
  'age',
  'employmentStatus',
  'employmentDuration',
  'monthlyIncome',
  'monthlyExpenses',
  'existingDebt',
  'creditScore',
  'loanPurpose',
  'requestedAmount',
  'loanTerm',
];

const fieldId = (field: LoanField) => `loan-${field}`;

interface LoanFormProps {
  products: LoanProduct[];
  rules: ValidationRules;
  isSubmitting: boolean;
  onSubmit: (request: EligibilityRequest, product: LoanProduct) => void;
  /** Preselects a product, e.g. when arriving from the Loan products tab. */
  initialProductId?: LoanProductId;
}

export function LoanForm({ products, rules, isSubmitting, onSubmit, initialProductId }: LoanFormProps) {
  const [values, setValues] = useState<LoanFormValues>({
    ...EMPTY_VALUES,
    productId: initialProductId ?? EMPTY_VALUES.productId,
  });
  const [errors, setErrors] = useState<LoanErrors>({});

  const product = products.find((p) => p.id === values.productId) ?? products[0];
  const isWorking = values.employmentStatus === 'employed' || values.employmentStatus === 'self_employed';

  /** Updates one field and clears its error as the person fixes it. */
  const update = <K extends keyof LoanFormValues>(field: K, value: LoanFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field as LoanField];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const request = toEligibilityRequest(values);
    const nextErrors = validateLoanApplication(request, rules, product);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      // Inputs are always rendered, so they can be focused straight away.
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    onSubmit(request, product);
  };

  const errorCount = Object.keys(errors).length;
  const field = (name: LoanField) => ({
    id: fieldId(name),
    error: errors[name],
  });

  return (
    <Form onSubmit={handleSubmit} noValidate aria-label="Loan eligibility">
      <Fieldset>
        <Legend>Loan type</Legend>
        <ProductOptions role="radiogroup" aria-label="Loan type">
          {products.map((option) => (
            <ProductCard key={option.id} $selected={option.id === product.id}>
              <input
                type="radio"
                name="productId"
                value={option.id}
                checked={option.id === product.id}
                onChange={() => {
                  update('productId', option.id);
                  update('loanPurpose', '');
                }}
              />
              <ProductName>{option.name}</ProductName>
              <ProductMeta>
                {formatCurrency(option.minAmount, { decimals: false })} – {formatCurrency(option.maxAmount, { decimals: false })} ·{' '}
                {option.minTerm}–{option.maxTerm} months · {option.interestRateRange.min}%–{option.interestRateRange.max}%
              </ProductMeta>
            </ProductCard>
          ))}
        </ProductOptions>
      </Fieldset>

      <Fieldset>
        <Legend>About you</Legend>
        <TextField
          {...field('age')}
          label="Age"
          inputMode="numeric"
          value={values.age}
          onChange={(e) => update('age', e.target.value)}
        />
        <SelectField
          {...field('employmentStatus')}
          label="Employment status"
          placeholder="Select your status"
          options={rules.personalInfo.employmentStatus.options.map((option) => ({ value: option, label: humanise(option) }))}
          value={values.employmentStatus}
          onChange={(e) => update('employmentStatus', e.target.value as LoanFormValues['employmentStatus'])}
        />
        <TextField
          {...field('employmentDuration')}
          label="Months in current employment"
          hint={isWorking ? `At least ${rules.personalInfo.employmentDuration.min} months` : 'Only needed if you’re employed'}
          inputMode="numeric"
          disabled={!isWorking}
          value={isWorking ? values.employmentDuration : ''}
          onChange={(e) => update('employmentDuration', e.target.value)}
        />
      </Fieldset>

      <Fieldset>
        <Legend>Your finances (per month)</Legend>
        <TextField
          {...field('monthlyIncome')}
          label="Monthly income"
          hint="Before deductions"
          inputMode="decimal"
          value={values.monthlyIncome}
          onChange={(e) => update('monthlyIncome', e.target.value)}
        />
        <TextField
          {...field('monthlyExpenses')}
          label="Monthly expenses"
          hint="Rent, food, transport, school fees…"
          inputMode="decimal"
          value={values.monthlyExpenses}
          onChange={(e) => update('monthlyExpenses', e.target.value)}
        />
        <TextField
          {...field('existingDebt')}
          label="Existing debt repayments"
          hint="Optional · what you already pay on other loans"
          inputMode="decimal"
          value={values.existingDebt}
          onChange={(e) => update('existingDebt', e.target.value)}
        />
        <TextField
          {...field('creditScore')}
          label="Credit score"
          hint={`Optional · ${rules.financialInfo.creditScore.min}–${rules.financialInfo.creditScore.max}`}
          inputMode="numeric"
          value={values.creditScore}
          onChange={(e) => update('creditScore', e.target.value)}
        />
      </Fieldset>

      <Fieldset>
        <Legend>The loan</Legend>
        <SelectField
          {...field('loanPurpose')}
          label="What is it for?"
          placeholder="Select a purpose"
          options={product.purposes.map((purpose) => ({ value: purpose, label: humanise(purpose) }))}
          value={values.loanPurpose}
          onChange={(e) => update('loanPurpose', e.target.value as LoanFormValues['loanPurpose'])}
        />
        <TextField
          {...field('requestedAmount')}
          label="Loan amount"
          hint={`${formatCurrency(product.minAmount, { decimals: false })} – ${formatCurrency(product.maxAmount, { decimals: false })}`}
          inputMode="decimal"
          value={values.requestedAmount}
          onChange={(e) => update('requestedAmount', e.target.value)}
        />
        <TextField
          {...field('loanTerm')}
          label="Loan term (months)"
          hint={`${product.minTerm}–${product.maxTerm} months`}
          inputMode="numeric"
          value={values.loanTerm}
          onChange={(e) => update('loanTerm', e.target.value)}
        />
      </Fieldset>

      {errorCount > 0 && (
        <ErrorSummary role="alert">
          Please fix {errorCount === 1 ? '1 field' : `${errorCount} fields`} before checking your eligibility.
        </ErrorSummary>
      )}

      <Actions>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Checking…' : 'Check my eligibility'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setValues(EXAMPLE_VALUES);
            setErrors({});
          }}
        >
          Use example values
        </Button>
      </Actions>
    </Form>
  );
}
