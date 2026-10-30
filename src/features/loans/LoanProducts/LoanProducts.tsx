import loanImageUrl from '../../../assets/loan.png';
import { Button } from '../../../components/Button/Button';
import type { LoanProduct, LoanProductId } from '../../../types/loans';
import { formatCurrency, humanise } from '../../../utils/format';
import { Description, Facts, Illustration, Layout, Name, ProductCard, ProductList, Purposes } from './LoanProducts.styles';

interface LoanProductsProps {
  products: LoanProduct[];
  onCheckEligibility: (productId: LoanProductId) => void;
}

/** The loan products from GET /api/loans/products. */
export function LoanProducts({ products, onCheckEligibility }: LoanProductsProps) {
  return (
    <Layout>
      <ProductList>
        {products.map((product) => (
          <ProductCard key={product.id} aria-labelledby={`product-${product.id}`}>
            <div>
              <Name id={`product-${product.id}`}>{product.name}</Name>
              <Description>{product.description}</Description>
            </div>
            <Facts>
              <div>
                <dt>Amount</dt>
                <dd>
                  {formatCurrency(product.minAmount, { decimals: false })} – {formatCurrency(product.maxAmount, { decimals: false })}
                </dd>
              </div>
              <div>
                <dt>Term</dt>
                <dd>
                  {product.minTerm}–{product.maxTerm} months
                </dd>
              </div>
              <div>
                <dt>Interest rate</dt>
                <dd>
                  {product.interestRateRange.min}%–{product.interestRateRange.max}%
                </dd>
              </div>
            </Facts>
            <Purposes aria-label={`${product.name} can be used for`}>
              {product.purposes.map((purpose) => (
                <li key={purpose}>{humanise(purpose)}</li>
              ))}
            </Purposes>
            <div>
              <Button onClick={() => onCheckEligibility(product.id)} aria-label={`Check eligibility for ${product.name}`}>
                Check eligibility
              </Button>
            </div>
          </ProductCard>
        ))}
      </ProductList>
      {/* Decorative: alt="" so screen readers skip it. */}
      <Illustration src={loanImageUrl} alt="" width={667} height={679} />
    </Layout>
  );
}
