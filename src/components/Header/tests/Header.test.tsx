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

  it('shows the navigation and greets the customer by first name, with a profile icon', () => {
    renderHeader({ customerName: 'John Doe' });
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    const greeting = screen.getByText('Hi, John');
    const icon = screen.getByTestId('profile-icon');
    expect(greeting).toContainElement(icon);
    // Decorative: screen readers only hear "Hi, John".
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(greeting.firstElementChild).toBe(icon);
  });

  it('omits the greeting and icon until the customer is known', () => {
    renderHeader();
    expect(screen.queryByText(/^Hi,/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('profile-icon')).not.toBeInTheDocument();
  });
});
