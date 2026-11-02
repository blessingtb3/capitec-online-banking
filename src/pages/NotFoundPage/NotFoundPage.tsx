import { PageShell } from '../../components/PageShell/PageShell';
import { ROUTES } from '../../config/routes';
import { Link } from 'react-router';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { homeLink } = styles;
  return (
    <PageShell documentTitle="Page not found · Capitec" title="We can’t find that page" lead="The link may be out of date.">
      <Link className={homeLink} to={ROUTES.spendingInsights}>Go to spending insights</Link>
    </PageShell>
  );
}
