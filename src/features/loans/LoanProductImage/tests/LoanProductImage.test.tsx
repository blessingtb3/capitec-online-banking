import { render } from '@testing-library/react';
import { LoanProductImage } from '../LoanProductImage';

describe('LoanProductImage', () => {
  it.each([
    ['personal_loan', 'personal-loan'],
    ['vehicle_loan', 'vehicle-loan'],
  ] as const)('shows the %s photo as a decorative image', (productId, file) => {
    const { container } = render(<LoanProductImage productId={productId} />);
    const image = container.querySelector('img')!;
    expect(image.getAttribute('src')).toContain(file);
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('data-product', productId);
  });
});
