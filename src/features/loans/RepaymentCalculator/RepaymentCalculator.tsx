import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button/Button';
import { Card } from '../../../components/Card/Card';
import { SelectField, TextField } from '../../../components/FormField/FormField';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useCalculateRateMutation } from '../../../services/loansApi';
import type { LoanProduct, LoanProductId, ValidationRules } from '../../../types/loans';
import { formatCurrency, formatPercent } from '../../../utils/format';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { parseAmount } from '../../../utils/parseAmount';
import { RepaymentSchedule } from '../RepaymentSchedule/RepaymentSchedule';
import { Facts, Form, Layout, Placeholder } from './RepaymentCalculator.styles';

interface RepaymentCalculatorProps {
  products: LoanProduct[];
  rules: ValidationRules;
}

type Field = 'loanAmount' | 'loanTerm' | 'creditScore';

/** "What would this loan cost?" Calls POST /api/loans/calculate-rate directly. */
export function RepaymentCalculator({ products, rules }: RepaymentCalculatorProps) {
  const [productId, setProductId] = useState<LoanProductId>(products[0].id);
  const [values, setValues] = useState<Record<Field, string>>({ loanAmount: '', loanTerm: '', creditScore: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [calculateRate, { data, isLoading, isError, error }] = useCalculateRateMutation();

  const product = products.find((p) => p.id === productId) ?? products[0];

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const loanAmount = parseAmount(values.loanAmount);
    const loanTerm = parseAmount(values.loanTerm);
    const creditScore = values.creditScore.trim() === '' ? undefined : parseAmount(values.creditScore);
    const scoreRule = rules.financialInfo.creditScore;

    const nextErrors: Partial<Record<Field, string>> = {};
    if (!(loanAmount >= product.minAmount && loanAmount <= product.maxAmount)) {
      nextErrors.loanAmount = `Enter an amount between ${formatCurrency(product.minAmount, { decimals: false })} and ${formatCurrency(product.maxAmount, { decimals: false })}`;
    }
    if (!(Number.isInteger(loanTerm) && loanTerm >= product.minTerm && loanTerm <= product.maxTerm)) {
      nextErrors.loanTerm = `Enter a term between ${product.minTerm} and ${product.maxTerm} months`;
    }
    if (creditScore !== undefined && !(creditScore >= (scoreRule.min ?? 0) && creditScore <= (scoreRule.max ?? Infinity))) {
      nextErrors.creditScore = scoreRule.errorMessage;
    }
    setErrors(nextErrors);

    const firstInvalid = (['loanAmount', 'loanTerm', 'creditScore'] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(`calc-${firstInvalid}`)?.focus();
      return;
    }
    calculateRate({ loanAmount, loanTerm, creditScore, loanType: product.id });
  };

  const renderResult = () => {
    if (isLoading) return <StatusMessage variant="loading" title="Calculating…" />;
    if (isError) return <StatusMessage variant="error" title="We couldn’t calculate that" message={getErrorMessage(error)} />;
    if (!data) return <Placeholder>Enter an amount and term to see your repayments.</Placeholder>;
    return (
      <>
        <Facts>
          <div>
            <dt>Monthly repayment</dt>
            <dd data-testid="calc-monthly-payment">{formatCurrency(data.monthlyPayment)}</dd>
          </div>
          <div>
            <dt>Interest rate</dt>
            <dd>{formatPercent(data.interestRate)}</dd>
          </div>
          <div>
            <dt>Total interest</dt>
            <dd>{formatCurrency(data.totalInterest, { decimals: false })}</dd>
          </div>
          <div>
            <dt>Total repayment</dt>
            <dd>{formatCurrency(data.totalRepayment, { decimals: false })}</dd>
          </div>
        </Facts>
        <RepaymentSchedule schedule={data.paymentSchedule} />
      </>
    );
  };

  return (
    <Layout>
      <Card id="calculator-form" title="Loan details" subtitle="Your rate depends on the product and your credit score">
        <Form onSubmit={handleSubmit} noValidate aria-label="Repayment calculator">
          <SelectField
            id="calc-product"
            label="Loan type"
            options={products.map((p) => ({ value: p.id, label: p.name }))}
            value={productId}
            onChange={(event) => {
              setProductId(event.target.value as LoanProductId);
              setErrors({});
            }}
          />
          <TextField
            id="calc-loanAmount"
            label="Loan amount"
            hint={`${formatCurrency(product.minAmount, { decimals: false })} – ${formatCurrency(product.maxAmount, { decimals: false })}`}
            inputMode="decimal"
            value={values.loanAmount}
            error={errors.loanAmount}
            onChange={(event) => update('loanAmount', event.target.value)}
          />
          <TextField
            id="calc-loanTerm"
            label="Loan term (months)"
            hint={`${product.minTerm}–${product.maxTerm} months`}
            inputMode="numeric"
            value={values.loanTerm}
            error={errors.loanTerm}
            onChange={(event) => update('loanTerm', event.target.value)}
          />
          <TextField
            id="calc-creditScore"
            label="Credit score"
            hint="Optional · a higher score gets a lower rate"
            inputMode="numeric"
            value={values.creditScore}
            error={errors.creditScore}
            onChange={(event) => update('creditScore', event.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Calculating…' : 'Calculate repayments'}
          </Button>
        </Form>
      </Card>
      <Card id="calculator-result" title="Your repayments">
        <div aria-live="polite">{renderResult()}</div>
      </Card>
    </Layout>
  );
}
