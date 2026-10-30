import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFoundPage } from '../NotFoundPage';

describe('NotFoundPage', () => {
  it('explains the problem and links home', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'We can’t find that page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to spending insights' })).toHaveAttribute('href', '/spending-insights');
  });
});
