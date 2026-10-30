import { useState } from 'react';
import { Card } from '../../../components/Card/Card';
import { StatusMessage } from '../../../components/StatusMessage/StatusMessage';
import { useCalculateRateMutation, useCheckEligibilityMutation } from '../../../services/loansApi';
import type { EligibilityRequest, LoanProduct, LoanProductId, ValidationRules } from '../../../types/loans';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { EligibilityResult } from '../EligibilityResult/EligibilityResult';
import { LoanForm } from '../LoanForm/LoanForm';
import { RepaymentSchedule } from '../RepaymentSchedule/RepaymentSchedule';
import { LoanProductImage } from '../LoanProductImage/LoanProductImage';
import { Columns, Placeholder, ResultColumn, ScheduleTitle } from './EligibilityChecker.styles';

interface Submission {
  request: EligibilityRequest;
  product: LoanProduct;
}

interface EligibilityCheckerProps {
  products: LoanProduct[];
  rules: ValidationRules;
  initialProductId?: LoanProductId;
}

/** Form + result. After a successful check, fetches the repayment schedule for the recommended amount. */
export function EligibilityChecker({ products, rules, initialProductId }: EligibilityCheckerProps) {
  const [selectedProductId, setSelectedProductId] = useState<LoanProductId>(initialProductId ?? products[0].id);
  const [checkEligibility, eligibility] = useCheckEligibilityMutation();
  const [calculateRate, rate] = useCalculateRateMutation();
  const [submission, setSubmission] = useState<Submission | null>(null);

  const runCheck = async ({ request, product }: Submission) => {
    setSubmission({ request, product });
    rate.reset();
    try {
      const result = await checkEligibility(request).unwrap();
      const { recommendedAmount } = result.recommendedLoan;
      if (recommendedAmount > 0) {
        calculateRate({
          loanAmount: recommendedAmount,
          loanTerm: request.loanDetails.loanTerm,
          creditScore: request.financialInfo.creditScore,
          loanType: product.id,
        });
      }
    } catch {
      // The error is shown from the mutation's state; nothing else to do here.
    }
  };

  const renderSchedule = () => {
    if (rate.isLoading) return <StatusMessage variant="loading" title="Building your repayment schedule…" />;
    if (rate.isError) {
      return <StatusMessage variant="error" title="We couldn’t build your schedule" message={getErrorMessage(rate.error)} />;
    }
    if (!rate.data) return null;
    return (
      <section aria-labelledby="schedule-title">
        <ScheduleTitle id="schedule-title">Repayment schedule</ScheduleTitle>
        <RepaymentSchedule schedule={rate.data.paymentSchedule} />
      </section>
    );
  };

  const renderResult = () => {
    if (eligibility.isLoading) return <StatusMessage variant="loading" title="Checking your eligibility…" />;
    if (eligibility.isError) {
      return (
        <StatusMessage
          variant="error"
          title="We couldn’t check your eligibility"
          message={getErrorMessage(eligibility.error)}
          onRetry={submission ? () => runCheck(submission) : undefined}
        />
      );
    }
    if (eligibility.data && submission) {
      return <EligibilityResult result={eligibility.data} request={submission.request} schedule={renderSchedule()} />;
    }
    return (
      <Placeholder>
        <strong>Your estimate will appear here</strong>
        <span>Fill in your details and select “Check my eligibility”. It won’t affect your credit record.</span>
      </Placeholder>
    );
  };

  return (
    <Columns>
      <Card id="loan-details" title="Your details" subtitle="All amounts in rands">
        <LoanForm
          products={products}
          rules={rules}
          isSubmitting={eligibility.isLoading}
          initialProductId={initialProductId}
          onProductChange={setSelectedProductId}
          onSubmit={(request, product) => runCheck({ request, product })}
        />
      </Card>
      <ResultColumn>
        {/* Hidden once a check starts, so the estimate takes its place. */}
        {!submission && <LoanProductImage productId={selectedProductId} />}
        <Card id="loan-result" title="Your estimate">
          <div aria-live="polite">{renderResult()}</div>
        </Card>
      </ResultColumn>
    </Columns>
  );
}
