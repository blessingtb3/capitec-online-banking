import { render } from '@testing-library/react';
import { CategoryIcon } from '../CategoryIcon';

describe('CategoryIcon', () => {
  it('renders a decorative icon on the category colour', () => {
    const { container } = render(<CategoryIcon icon="car" color="#45B7D1" />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge).toHaveAttribute('aria-hidden', 'true');
    expect(getComputedStyle(badge).backgroundColor).toBe('rgb(69, 183, 209)');
    expect(badge.querySelector('svg')).not.toBeNull();
  });
});
