import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { filters } from '../../../../mocks/data/customer';
import { DateRangeFilter } from '../DateRangeFilter';

function setup(overrides: Partial<Parameters<typeof DateRangeFilter>[0]> = {}) {
  const props = {
    presets: filters.dateRangePresets,
    period: '30d' as const,
    customRange: null,
    onPeriodChange: vi.fn(),
    onCustomRangeChange: vi.fn(),
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

  it('applies a valid custom range', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Custom dates' }));
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2024-08-01' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2024-08-31' } });
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(props.onCustomRangeChange).toHaveBeenCalledWith({ startDate: '2024-08-01', endDate: '2024-08-31' });
  });

  it('rejects a range that ends before it starts', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Custom dates' }));
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2024-09-10' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2024-09-01' } });
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.getByRole('alert')).toHaveTextContent('start date must be on or before');
    expect(props.onCustomRangeChange).not.toHaveBeenCalled();
  });

  it('shows the active custom range and no preset as selected', () => {
    setup({ customRange: { startDate: '2024-08-01', endDate: '2024-08-31' } });
    expect(screen.getByText('Showing 1 Aug 2024 – 31 Aug 2024')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last 30 days' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('hides custom dates where only presets are supported', () => {
    setup({ allowCustom: false, customRange: { startDate: '2024-08-01', endDate: '2024-08-31' } });
    expect(screen.queryByRole('button', { name: 'Custom dates' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last 30 days' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Your custom dates apply to the Transactions tab only.')).toBeInTheDocument();
  });
});
