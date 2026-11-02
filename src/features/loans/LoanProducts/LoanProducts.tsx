import loanImageUrl from '../../../assets/loan.png';
import { Button } from '../../../components/Button/Button';
import type { LoanProduct, LoanProductId } from '../../../types/loans';
import { formatCurrency, humanise } from '../../../utils/format';
import styles from './LoanProducts.module.css';

interface LoanProductsProps {
  products: LoanProduct[];
  onCheckEligibility: (productId: LoanProductId) => void;
}

/** The loan products from GET /api/loans/products. */
export function LoanProducts({ products, onCheckEligibility }: LoanProductsProps) {
  const {
    layout,
    productList,
    productCard,
    productName,
    productDescription,
    facts,
    purposeList,
    illustration,
  } = styles;
  return (
    <div className={layout}>
      <ul className={productList}>
        {products.map((product) => (
          <li className={productCard} key={product.id} aria-labelledby={`product-${product.id}`}>
            <div>
              <h2 className={productName} id={`product-${product.id}`}>{product.name}</h2>
              <p className={productDescription}>{product.description}</p>
            </div>
            <dl className={facts}>
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
            </dl>
            <ul className={purposeList} aria-label={`${product.name} can be used for`}>
              {product.purposes.map((purpose) => (
                <li key={purpose}>{humanise(purpose)}</li>
              ))}
            </ul>
            <div>
              <Button onClick={() => onCheckEligibility(product.id)} aria-label={`Check eligibility for ${product.name}`}>
                Check eligibility
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {/* Decorative: alt="" so screen readers skip it. */}
      <img className={illustration} src={loanImageUrl} alt="" width={667} height={679} />
    </div>
  );
}
