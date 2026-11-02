import type { ReactNode } from 'react';
import { ProgressBar } from '../../../components/ProgressBar/ProgressBar';
import type { EligibilityRequest, EligibilityResponse } from '../../../types/loans';
import { formatCurrency, formatPercent, humanise } from '../../../utils/format';
import styles from './EligibilityResult.module.css';

interface EligibilityResultProps {
  result: EligibilityResponse;
  request: EligibilityRequest;
  /** Repayment schedule area, rendered by the parent (it has its own loading state). */
  schedule?: ReactNode;
}

export function EligibilityResult({ result, request, schedule }: EligibilityResultProps) {
  const {
    wrapper,
    banner,
    bannerEligible,
    bannerIneligible,
    bannerIcon,
    bannerIconEligible,
    bannerIconIneligible,
    bannerTitle,
    bannerText,
    likelihoodHead,
    riskLine,
    riskBadge,
    heroFigure,
    heroLabel,
    heroValue,
    heroNote,
    sectionTitle,
    facts,
    disclaimer,
  } = styles;
  const { eligibilityResult, recommendedLoan, affordabilityAnalysis } = result;
  const { isEligible } = eligibilityResult;
  const reduced = recommendedLoan.recommendedAmount > 0 && recommendedLoan.recommendedAmount < request.loanDetails.requestedAmount;
  const likelihoodTone = eligibilityResult.approvalLikelihood >= 75 ? 'success' : eligibilityResult.approvalLikelihood >= 50 ? 'warning' : 'error';

  return (
    <div className={wrapper}>
      <div className={`${banner} ${isEligible ? bannerEligible : bannerIneligible}`}>
        <span className={`${bannerIcon} ${isEligible ? bannerIconEligible : bannerIconIneligible}`} aria-hidden="true">
          {isEligible ? '✓' : '!'}
        </span>
        <div>
          <h3 className={bannerTitle}>{isEligible ? 'You’re likely to qualify' : 'You’re unlikely to qualify right now'}</h3>
          <p className={bannerText}>{eligibilityResult.decisionReason}.</p>
        </div>
      </div>

      <div>
        <div className={likelihoodHead}>
          <span>Approval likelihood</span>
          <span>{eligibilityResult.approvalLikelihood}%</span>
        </div>
        <ProgressBar
          value={eligibilityResult.approvalLikelihood}
          tone={likelihoodTone}
          label="Approval likelihood"
          valueText={`${eligibilityResult.approvalLikelihood}%, ${eligibilityResult.riskCategory} risk`}
        />
        <p className={riskLine}>
          Risk category: <span className={`${riskBadge} ${styles[eligibilityResult.riskCategory]}`}>{humanise(eligibilityResult.riskCategory)}</span>
        </p>
      </div>

      {recommendedLoan.recommendedAmount > 0 && (
        <div className={heroFigure}>
          <p className={heroLabel}>Estimated monthly repayment</p>
          <p className={heroValue} data-testid="monthly-payment">{formatCurrency(recommendedLoan.monthlyPayment)}</p>
          <p className={heroNote}>
            on {formatCurrency(recommendedLoan.recommendedAmount, { decimals: false })} over {request.loanDetails.loanTerm} months
            at {formatPercent(recommendedLoan.interestRate)} a year
            {reduced && ` (you asked for ${formatCurrency(request.loanDetails.requestedAmount, { decimals: false })})`}
          </p>
        </div>
      )}

      <section aria-labelledby="loan-offer-title">
        <h4 className={sectionTitle} id="loan-offer-title">Recommended loan</h4>
        <dl className={facts}>
          <div>
            <dt>Maximum you could borrow</dt>
            <dd>{formatCurrency(recommendedLoan.maxAmount, { decimals: false })}</dd>
          </div>
          <div>
            <dt>Recommended amount</dt>
            <dd>{formatCurrency(recommendedLoan.recommendedAmount, { decimals: false })}</dd>
          </div>
          <div>
            <dt>Interest rate</dt>
            <dd>{formatPercent(recommendedLoan.interestRate)}</dd>
          </div>
          <div>
            <dt>Total repayment</dt>
            <dd>{formatCurrency(recommendedLoan.totalRepayment, { decimals: false })}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="affordability-title">
        <h4 className={sectionTitle} id="affordability-title">Affordability</h4>
        <dl className={facts}>
          <div>
            <dt>Disposable income</dt>
            <dd>{formatCurrency(affordabilityAnalysis.disposableIncome, { decimals: false })}</dd>
          </div>
          <div>
            <dt>Debt-to-income</dt>
            <dd>{formatPercent(affordabilityAnalysis.debtToIncomeRatio)}</dd>
          </div>
          <div>
            <dt>Loan-to-income</dt>
            <dd>{formatPercent(affordabilityAnalysis.loanToIncomeRatio)}</dd>
          </div>
          <div>
            <dt>Affordability</dt>
            <dd>{humanise(affordabilityAnalysis.affordabilityScore)}</dd>
          </div>
        </dl>
      </section>

      {schedule}

      <p className={disclaimer}>
        This is an estimate based on mocked data and simplified rules. It is not a credit offer and does not affect your
        credit record.
      </p>
    </div>
  );
}
