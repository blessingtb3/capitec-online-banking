import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('exposes its value to assistive technology', () => {
    render(<ProgressBar value={65.03} label="Entertainment budget" valueText="65% used" />);
    const bar = screen.getByRole('progressbar', { name: 'Entertainment budget' });
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuetext', '65% used');
  });

  it('clamps values above 100', () => {
    render(<ProgressBar value={140} label="Over budget" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('colours the bar by tone', () => {
    render(<ProgressBar value={90} label="Groceries budget" tone="error" />);
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill).toHaveAttribute('data-tone', 'error');
    expect(getComputedStyle(fill).backgroundColor).toBe('rgb(179, 38, 30)');
  });
});
