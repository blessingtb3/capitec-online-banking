import { useState } from 'react';
import { PageShell } from '../../components/PageShell/PageShell';
import { StatusMessage } from '../../components/StatusMessage/StatusMessage';
import { TabPanel, Tabs } from '../../components/Tabs/Tabs';
import { EligibilityChecker } from '../../features/loans/EligibilityChecker/EligibilityChecker';
import { LoanProducts } from '../../features/loans/LoanProducts/LoanProducts';
import { RepaymentCalculator } from '../../features/loans/RepaymentCalculator/RepaymentCalculator';
import { useTabParam } from '../../hooks/useTabParam';
import { useGetLoanProductsQuery, useGetValidationRulesQuery } from '../../services/loansApi';
import type { LoanProductId } from '../../types/loans';
import { getErrorMessage } from '../../utils/getErrorMessage';

// The first tab is the one the page opens on.
const TABS = [
  { id: 'products', label: 'Loan products', icon: 'stacked-cards' },
  { id: 'eligibility', label: 'Eligibility', icon: 'badge-check' },
  { id: 'calculator', label: 'Repayment calculator', icon: 'calculator' },
] as const;

type TabId = (typeof TABS)[number]['id'];
const TAB_IDS = TABS.map((tab) => tab.id);

export function LoanEstimatorPage() {
  const [activeTab, setActiveTab] = useTabParam<TabId>(TAB_IDS);
  const [chosenProductId, setChosenProductId] = useState<LoanProductId | undefined>();
  const products = useGetLoanProductsQuery();
  const rules = useGetValidationRulesQuery();

  const renderContent = () => {
    if (products.isLoading || rules.isLoading) return <StatusMessage variant="loading" title="Loading loan options…" />;
    if (products.isError || rules.isError || !products.data || !rules.data) {
      return (
        <StatusMessage
          variant="error"
          title="We couldn’t load the loan estimator"
          message={getErrorMessage(products.error ?? rules.error)}
          onRetry={() => {
            products.refetch();
            rules.refetch();
          }}
        />
      );
    }

    return (
      <>
        <TabPanel idPrefix="loans" id="products" activeId={activeTab}>
          <LoanProducts
            products={products.data.products}
            onCheckEligibility={(productId) => {
              setChosenProductId(productId);
              setActiveTab('eligibility');
            }}
          />
        </TabPanel>
        <TabPanel idPrefix="loans" id="eligibility" activeId={activeTab}>
          {/* Re-mounts with the product chosen on the Loan products tab. */}
          <EligibilityChecker
            key={chosenProductId ?? 'default'}
            products={products.data.products}
            rules={rules.data}
            initialProductId={chosenProductId}
          />
        </TabPanel>
        <TabPanel idPrefix="loans" id="calculator" activeId={activeTab}>
          <RepaymentCalculator products={products.data.products} rules={rules.data} />
        </TabPanel>
      </>
    );
  };

  return (
    <PageShell
      documentTitle="Loan estimator · Capitec"
      title="See what you could borrow"
      lead="Compare our loan products, check your eligibility and work out your repayments. Estimates won’t affect your credit record."
      tabs={<Tabs tabs={TABS} activeId={activeTab} onChange={setActiveTab} label="Loan estimator sections" idPrefix="loans" />}
    >
      {renderContent()}
    </PageShell>
  );
}
