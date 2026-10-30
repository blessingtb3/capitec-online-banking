import { ROUTES } from '../../config/routes';
import { NavItem, NavList } from './MainNav.styles';

const LINKS = [
  { to: ROUTES.spendingInsights, label: 'Spending insights' },
  { to: ROUTES.loanEstimator, label: 'Loan estimator' },
];

/** Links between the app's pages. NavLink sets aria-current="page" on the active one. */
export function MainNav() {
  return (
    <nav aria-label="Main">
      <NavList>
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavItem to={link.to}>{link.label}</NavItem>
          </li>
        ))}
      </NavList>
    </nav>
  );
}
