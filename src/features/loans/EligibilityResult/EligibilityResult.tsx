import type { ReactNode } from 'react';
import { ProgressBar } from '../../../components/ProgressBar/ProgressBar';
import type { EligibilityRequest, EligibilityResponse } from '../../../types/loans';
import { formatCurrency, formatPercent, humanise } from '../../../utils/format';
import {
  Banner,
  BannerIcon,
  BannerText,
  BannerTitle,
  Disclaimer,
  Facts,
  HeroFigure,
  HeroLabel,
  HeroNote,
  HeroValue,
  LikelihoodHead,
  RiskBadge,
  RiskLine,
  SectionTitle,
  Wrapper,
} from './EligibilityResult.styles';

interface EligibilityResultProps {
  result: EligibilityResponse;
  request: EligibilityRequest;
  /** Repayment schedule area, rendered by the parent (it has its own loading state). */
  schedule?: ReactNode;
}

export function EligibilityResult({ result, request, schedule }: EligibilityResultProps) {
  const { eligibilityResult, recommendedLoan, affordabilityAnalysis } = result;
  const { isEligible } = eligibilityResult;
  const reduced = recommendedLoan.recommendedAmount > 0 && recommendedLoan.recommendedAmount < request.loanDetails.requestedAmount;
  const likelihoodTone = eligibilityResult.approvalLikelihood >= 75 ? 'success' : eligibilityResult.approvalLikelihood >= 50 ? 'warning' : 'error';

  return (
    <Wrapper>
      <Banner $eligible={isEligible}>
        <BannerIcon $eligible={isEligible} aria-hidden="true">
          {isEligible ? '✓' : '!'}
        </BannerIcon>
        <div>
          <BannerTitle>{isEligible ? 'You’re likely to qualify' : 'You’re unlikely to qualify right now'}</BannerTitle>
          <BannerText>{eligibilityResult.decisionReason}.</BannerText>
        </div>
      </Banner>

      <div>
        <LikelihoodHead>
          <span>Approval likelihood</span>
          <span>{eligibilityResult.approvalLikelihood}%</span>
        </LikelihoodHead>
        <ProgressBar
          value={eligibilityResult.approvalLikelihood}
          tone={likelihoodTone}
          label="Approval likelihood"
          valueText={`${eligibilityResult.approvalLikelihood}%, ${eligibilityResult.riskCategory} risk`}
        />
        <RiskLine>
          Risk category: <RiskBadge $risk={eligibilityResult.riskCategory}>{humanise(eligibilityResult.riskCategory)}</RiskBadge>
        </RiskLine>
      </div>

      {recommendedLoan.recommendedAmount > 0 && (
        <HeroFigure>
          <HeroLabel>Estimated monthly repayment</HeroLabel>
          <HeroValue data-testid="monthly-payment">{formatCurrency(recommendedLoan.monthlyPayment)}</HeroValue>
          <HeroNote>
            on {formatCurrency(recommendedLoan.recommendedAmount, { decimals: false })} over {request.loanDetails.loanTerm} months
            at {formatPercent(recommendedLoan.interestRate)} a year
            {reduced && ` (you asked for ${formatCurrency(request.loanDetails.requestedAmount, { decimals: false })})`}
          </HeroNote>
        </HeroFigure>
      )}

      <section aria-labelledby="loan-offer-title">
        <SectionTitle id="loan-offer-title">Recommended loan</SectionTitle>
        <Facts>
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
        </Facts>
      </section>

      <section aria-labelledby="affordability-title">
        <SectionTitle id="affordability-title">Affordability</SectionTitle>
        <Facts>
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
        </Facts>
      </section>

      {schedule}

      <Disclaimer>
        This is an estimate based on mocked data and simplified rules. It is not a credit offer and does not affect your
        credit record.
      </Disclaimer>
    </Wrapper>
  );
}
