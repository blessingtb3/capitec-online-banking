import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TabPanel, Tabs } from '../Tabs';

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'trends', label: 'Trends' },
  { id: 'budgets', label: 'Budgets' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function Harness() {
  const [active, setActive] = useState<TabId>('summary');
  return (
    <>
      <Tabs tabs={TABS} activeId={active} onChange={setActive} label="Sections" idPrefix="test" />
      {TABS.map((tab) => (
        <TabPanel key={tab.id} idPrefix="test" id={tab.id} activeId={active}>
          {tab.label} content
        </TabPanel>
      ))}
    </>
  );
}

describe('Tabs', () => {
  it('shows only the active panel, labelled by its tab', () => {
    render(<Harness />);
    expect(screen.getByRole('tab', { name: 'Summary' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Summary' })).toHaveTextContent('Summary content');
    expect(screen.queryByRole('tabpanel', { name: 'Trends' })).not.toBeInTheDocument();
  });

  it('switches tab on click and keeps other panels mounted', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('tab', { name: 'Trends' }));
    expect(screen.getByRole('tabpanel', { name: 'Trends' })).toBeVisible();
    expect(screen.getByText('Summary content')).not.toBeVisible();
  });

  it('supports arrow, Home and End keys', async () => {
    render(<Harness />);
    screen.getByRole('tab', { name: 'Summary' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Trends' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Budgets' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Summary' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{Home}');
    expect(screen.getByRole('tab', { name: 'Summary' })).toHaveAttribute('aria-selected', 'true');
  });
});
