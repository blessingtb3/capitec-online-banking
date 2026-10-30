import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders a titled region with its content', () => {
    render(
      <Card id="goals" title="Goals" subtitle="This month" actions={<button>Edit</button>}>
        <p>Body</p>
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'Goals' })).toBeInTheDocument();
    expect(screen.getByText('This month')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
