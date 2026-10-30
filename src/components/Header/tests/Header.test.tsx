import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from '../Header';

const renderHeader = (props: Partial<Parameters<typeof Header>[0]> = {}) =>
  render(
    <MemoryRouter>
      <Header navigation={<nav aria-label="Main">nav</nav>} {...props} />
    </MemoryRouter>,
  );

describe('Header', () => {
  it('shows the Capitec logo, linking to the home page', () => {
    renderHeader();
    const link = screen.getByRole('link', { name: 'Capitec home' });
    expect(link).toHaveAttribute('href', '/spending-insights');
    expect(screen.getByRole('img', { name: 'Capitec home' })).toHaveAttribute('src', expect.stringContaining('capitec-logo'));
  });

  it('shows the navigation and greets the customer by first name', () => {
    renderHeader({ customerName: 'John Doe' });
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByText('Hi, John')).toBeInTheDocument();
  });

  it('omits the greeting until the customer is known', () => {
    renderHeader();
    expect(screen.queryByText(/^Hi,/)).not.toBeInTheDocument();
  });
});
