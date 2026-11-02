import personalLoanImageUrl from '../../../assets/personal-loan.png';
import vehicleLoanImageUrl from '../../../assets/vehicle-loan.png';
import type { LoanProductId } from '../../../types/loans';
import styles from './LoanProductImage.module.css';

/** The photo shown for each loan type. */
const PRODUCT_IMAGES: Record<LoanProductId, string> = {
  personal_loan: personalLoanImageUrl,
  vehicle_loan: vehicleLoanImageUrl,
};

/** Decorative photo for the selected loan type (alt="" so screen readers skip it). */
export function LoanProductImage({ productId }: { productId: LoanProductId }) {
  const { photo } = styles;
  return <img className={photo} src={PRODUCT_IMAGES[productId]} alt="" data-product={productId} />;
}
