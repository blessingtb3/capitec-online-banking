import { PageShell } from '../../components/PageShell/PageShell';
import { ROUTES } from '../../config/routes';
import { HomeLink } from './NotFoundPage.styles';

export function NotFoundPage() {
  return (
    <PageShell documentTitle="Page not found · Capitec" title="We can’t find that page" lead="The link may be out of date.">
      <HomeLink to={ROUTES.spendingInsights}>Go to spending insights</HomeLink>
    </PageShell>
  );
}
