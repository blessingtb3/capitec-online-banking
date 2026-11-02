import type { ReactNode } from 'react';
import logoUrl from '../../assets/capitec-logo.png';
import { ROUTES } from '../../config/routes';
import { Link } from 'react-router';
import styles from './Header.module.css';

interface HeaderProps {
  /** Main navigation (the feature tabs). */
  navigation: ReactNode;
  customerName?: string;
}

export function Header({ navigation, customerName }: HeaderProps) {
  const { headerBar, headerInner, brandLink, logoFrame, navSlot, greeting, profileIcon } = styles;
  return (
    <header className={headerBar}>
      <div className={headerInner}>
        <Link className={brandLink} to={ROUTES.spendingInsights}>
          <span className={logoFrame}>
            <img src={logoUrl} alt="Capitec home" />
          </span>
        </Link>
        <div className={navSlot}>{navigation}</div>
        {customerName && (
          <p className={greeting}>
            <svg className={profileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" focusable="false" data-testid="profile-icon">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3.5" />
              <path d="M5.5 18.5a7.5 7.5 0 0 1 13 0" strokeLinecap="round" />
            </svg>
            Hi, {customerName.split(' ')[0]}
          </p>
        )}
      </div>
    </header>
  );
}
