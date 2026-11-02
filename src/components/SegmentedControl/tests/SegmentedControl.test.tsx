import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../SegmentedControl';

const OPTIONS = [
  { value: 6, label: '6M' },
  { value: 12, label: '12M' },
];

describe('SegmentedControl', () => {
  it('marks the selected option as pressed', () => {
    render(<SegmentedControl label="Months" options={OPTIONS} value={12} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: '12M' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '6M' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports the chosen value', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Months" options={OPTIONS} value={12} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '6M' }));
    expect(onChange).toHaveBeenCalledWith(6);
  });
});
