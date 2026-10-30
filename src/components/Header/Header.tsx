import type { ReactNode } from 'react';
import logoUrl from '../../assets/capitec-logo.png';
import { ROUTES } from '../../config/routes';
import { BrandLink, Greeting, HeaderBar, HeaderInner, LogoFrame, NavSlot, ProfileIcon } from './Header.styles';

interface HeaderProps {
  /** Main navigation (the feature tabs). */
  navigation: ReactNode;
  customerName?: string;
}

export function Header({ navigation, customerName }: HeaderProps) {
  return (
    <HeaderBar>
      <HeaderInner>
        <BrandLink to={ROUTES.spendingInsights}>
          <LogoFrame>
            <img src={logoUrl} alt="Capitec home" />
          </LogoFrame>
        </BrandLink>
        <NavSlot>{navigation}</NavSlot>
        {customerName && (
          <Greeting>
            <ProfileIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" focusable="false" data-testid="profile-icon">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3.5" />
              <path d="M5.5 18.5a7.5 7.5 0 0 1 13 0" strokeLinecap="round" />
            </ProfileIcon>
            Hi, {customerName.split(' ')[0]}
          </Greeting>
        )}
      </HeaderInner>
    </HeaderBar>
  );
}
