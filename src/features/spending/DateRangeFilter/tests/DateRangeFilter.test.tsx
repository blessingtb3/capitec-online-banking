import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { filters } from '../../../../mocks/data/customer';
import { DateRangeFilter } from '../DateRangeFilter';

function setup(overrides: Partial<Parameters<typeof DateRangeFilter>[0]> = {}) {
  const props = {
    presets: filters.dateRangePresets,
    period: '30d' as const,
    onPeriodChange: vi.fn(),
    ...overrides,
  };
  render(<DateRangeFilter {...props} />);
  return props;
}

describe('DateRangeFilter', () => {
  it('renders the presets from the API and highlights the active one', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Last 30 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Last year' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('offers "This month" first', () => {
    setup();
    const presets = screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-pressed'));
    expect(presets.map((b) => b.textContent)).toEqual(['This month', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year']);
  });

  it('changes period', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    expect(props.onPeriodChange).toHaveBeenCalledWith('7d');
  });

  it('offers no custom dates', () => {
    setup();
    expect(screen.queryByRole('button', { name: 'Custom dates' })).not.toBeInTheDocument();
  });
});
