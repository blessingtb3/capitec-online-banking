import { ROUTES } from '../../config/routes';
import { NavLink } from 'react-router';
import styles from './MainNav.module.css';

const LINKS = [
  { to: ROUTES.spendingInsights, label: 'Spending insights' },
  { to: ROUTES.loanEstimator, label: 'Loan estimator' },
];

/** Links between the app's pages. NavLink sets aria-current="page" on the active one. */
export function MainNav() {
  const { navList, navItem } = styles;
  return (
    <nav aria-label="Main">
      <ul className={navList}>
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink className={navItem} to={link.to}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
