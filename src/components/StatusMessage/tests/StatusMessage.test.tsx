import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusMessage } from '../StatusMessage';

describe('StatusMessage', () => {
  it('announces loading politely', () => {
    render(<StatusMessage variant="loading" title="Loading goals…" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading goals…');
  });

  it('shows an error alert with a retry button', async () => {
    const onRetry = vi.fn();
    render(<StatusMessage variant="error" message="Service down" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Service down');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows an empty state', () => {
    render(<StatusMessage variant="empty" title="No transactions" message="Try another filter." />);
    expect(screen.getByRole('heading', { name: 'No transactions' })).toBeInTheDocument();
    expect(screen.getByText('Try another filter.')).toBeInTheDocument();
  });
});
