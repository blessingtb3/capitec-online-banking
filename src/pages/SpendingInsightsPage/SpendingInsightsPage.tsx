import { useState } from 'react';
import { Card } from '../../components/Card/Card';
import { PageShell } from '../../components/PageShell/PageShell';
import { StatusMessage } from '../../components/StatusMessage/StatusMessage';
import { TabPanel, Tabs } from '../../components/Tabs/Tabs';
import { CategoryBreakdown } from '../../features/spending/CategoryBreakdown/CategoryBreakdown';
import { DateRangeFilter } from '../../features/spending/DateRangeFilter/DateRangeFilter';
import { GoalsCard } from '../../features/spending/GoalsCard/GoalsCard';
import { SpendingTrendsChart } from '../../features/spending/SpendingTrendsChart/SpendingTrendsChart';
import { SummaryTiles } from '../../features/spending/SummaryTiles/SummaryTiles';
import { TransactionsTable } from '../../features/spending/TransactionsTable/TransactionsTable';
import { useTabParam } from '../../hooks/useTabParam';
import {
  useGetCustomerProfileQuery,
  useGetFiltersQuery,
  useGetSpendingByCategoryQuery,
} from '../../services/spendingApi';
import type { DateRange, Period } from '../../types/spending';
import { formatDate, formatMonth, humanise } from '../../utils/format';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { FilterRow, OverviewStack } from './SpendingInsightsPage.styles';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'pie-chart' },
  { id: 'transactions', label: 'Transactions', icon: 'list' },
  { id: 'trends', label: 'Trends', icon: 'bar-chart' },
] as const;

type TabId = (typeof TABS)[number]['id'];
const TAB_IDS = TABS.map((tab) => tab.id);

/** Tabs whose data depends on the period / date range filter. */
const FILTERED_TABS: TabId[] = ['overview', 'transactions'];

export function SpendingInsightsPage({ customerId }: { customerId: string }) {
  const [activeTab, setActiveTab] = useTabParam<TabId>(TAB_IDS);
  // Opens on the current calendar month, which also shows the monthly budgets.
  const [period, setPeriod] = useState<Period>('mtd');
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  // Clear the category filter whenever Overview becomes the active tab (by click,
  // keyboard or the back button). This adjusts state during render, React's
  // recommended alternative to an effect. It only fires when the tab actually
  // changes, so picking a category on Overview (which sets the category and
  // switches to Transactions together) isn't undone.
  const [previousTab, setPreviousTab] = useState(activeTab);
  if (activeTab !== previousTab) {
    setPreviousTab(activeTab);
    if (activeTab === 'overview') setCategory(null);
  }

  const profile = useGetCustomerProfileQuery(customerId);
  const filters = useGetFiltersQuery(customerId);
  // The overview always follows the preset period, so its tiles and categories agree.
  const categories = useGetSpendingByCategoryQuery({ customerId, period });

  const firstName = profile.data?.name.split(' ')[0];
  // Transactions use a custom range when one is set, otherwise the period's range from the API.
  const transactionRange = customRange ?? categories.data?.dateRange;

  const renderContent = () => {
    if (filters.isLoading) return <StatusMessage variant="loading" title="Loading your insights…" />;
    if (filters.isError || !filters.data) {
      return (
        <StatusMessage
          variant="error"
          title="We couldn’t load your insights"
          message={getErrorMessage(filters.error)}
          onRetry={filters.refetch}
        />
      );
    }

    return (
      <>
        {FILTERED_TABS.includes(activeTab) && (
          <FilterRow>
            <DateRangeFilter
              presets={filters.data.dateRangePresets}
              period={period}
              customRange={customRange}
              onPeriodChange={setPeriod}
              onCustomRangeChange={setCustomRange}
              allowCustom={activeTab === 'transactions'}
            />
          </FilterRow>
        )}

        <TabPanel idPrefix="insights" id="overview" activeId={activeTab}>
          <OverviewStack>
            <SummaryTiles customerId={customerId} period={period} />
            <Card
              id="spending-categories"
              title="Spending by category"
              subtitle={
                categories.data
                  ? `${formatDate(categories.data.dateRange.startDate)} – ${formatDate(categories.data.dateRange.endDate)} · select a category to see its transactions`
                  : undefined
              }
            >
              {categories.isLoading && <StatusMessage variant="loading" title="Loading categories…" />}
              {categories.isError && (
                <StatusMessage
                  variant="error"
                  title="We couldn’t load your categories"
                  message={getErrorMessage(categories.error)}
                  onRetry={categories.refetch}
                />
              )}
              {categories.data && !categories.isError && (
                <CategoryBreakdown
                  data={categories.data}
                  selectedCategory={category}
                  onSelectCategory={(selected) => {
                    setCategory(selected);
                    if (selected) setActiveTab('transactions');
                  }}
                />
              )}
            </Card>
            {/* Budgets are monthly, so they only line up with the "This month" period. */}
            {period === 'mtd' && <GoalsCard customerId={customerId} />}
          </OverviewStack>
        </TabPanel>

        <TabPanel idPrefix="insights" id="transactions" activeId={activeTab}>
          {transactionRange ? (
            <TransactionsTable
              key={`${transactionRange.startDate}|${transactionRange.endDate}|${category ?? 'all'}`}
              customerId={customerId}
              dateRange={transactionRange}
              categories={filters.data.categories}
              category={category}
              onCategoryChange={setCategory}
            />
          ) : (
            <StatusMessage variant="loading" title="Loading transactions…" />
          )}
        </TabPanel>

        <TabPanel idPrefix="insights" id="trends" activeId={activeTab}>
          <SpendingTrendsChart customerId={customerId} />
        </TabPanel>
      </>
    );
  };

  return (
    <PageShell
      documentTitle="Spending insights · Capitec"
      title={firstName ? `${firstName}, here’s your spending` : 'Your spending'}
      lead={
        <>
          See where your money goes, how it compares with the previous period, and how you’re tracking against your budgets.
          {profile.data && (
            <>
              {' '}
              {humanise(profile.data.accountType)} account · customer since {formatMonth(profile.data.joinDate.slice(0, 7))}.
            </>
          )}
        </>
      }
      tabs={<Tabs tabs={TABS} activeId={activeTab} onChange={setActiveTab} label="Spending insights sections" idPrefix="insights" />}
    >
      {renderContent()}
    </PageShell>
  );
}
