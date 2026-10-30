import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SpendingByCategory } from '../../../../types/spending';
import { CategoryBreakdown } from '../CategoryBreakdown';

const data: SpendingByCategory = {
  dateRange: { startDate: '2024-08-16', endDate: '2024-09-16' },
  totalAmount: 2140.5,
  categories: [
    { name: 'Groceries', amount: 1250.3, percentage: 58.4, transactionCount: 15, color: '#FF6B6B', icon: 'shopping-cart' },
    { name: 'Entertainment', amount: 890.2, percentage: 41.6, transactionCount: 8, color: '#4ECDC4', icon: 'film' },
  ],
};

describe('CategoryBreakdown', () => {
  it('plots each category with its API colour and lists the values', () => {
    render(<CategoryBreakdown data={data} selectedCategory={null} onSelectCategory={() => {}} />);
    const chart = screen.getByTestId('doughnut-chart');
    expect(chart).toHaveAttribute('data-labels', JSON.stringify(['Groceries', 'Entertainment']));
    expect(chart).toHaveAttribute('data-values', JSON.stringify([[1250.3, 890.2]]));
    expect(screen.getByText('58.4% · 15 transactions')).toBeInTheDocument();
    expect(screen.getByText('R1 250.30')).toBeInTheDocument();
  });

  it('selects and deselects a category', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(<CategoryBreakdown data={data} selectedCategory={null} onSelectCategory={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Groceries/ }));
    expect(onSelect).toHaveBeenLastCalledWith('Groceries');

    rerender(<CategoryBreakdown data={data} selectedCategory="Groceries" onSelectCategory={onSelect} />);
    const groceries = screen.getByRole('button', { name: /Groceries/ });
    expect(groceries).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(groceries);
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('shows an empty state when nothing was spent', () => {
    render(<CategoryBreakdown data={{ ...data, totalAmount: 0, categories: [] }} selectedCategory={null} onSelectCategory={() => {}} />);
    expect(screen.getByText('No spending in this period')).toBeInTheDocument();
  });
});
