import { render } from '@testing-library/react';
import { Icon, type IconName } from '../Icon';

const NAMES: IconName[] = ['pie-chart', 'bar-chart', 'list', 'badge-check', 'calculator', 'stacked-cards'];

describe('Icon', () => {
  it.each(NAMES)('draws the "%s" icon as a decorative SVG', (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-icon', name);
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg.childElementCount).toBeGreaterThan(0);
  });
});
