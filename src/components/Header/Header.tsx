import type { ReactNode } from 'react';
import logoUrl from '../../assets/capitec-logo.png';
import { ROUTES } from '../../config/routes';
import { BrandLink, Greeting, HeaderBar, HeaderInner, LogoFrame, NavSlot } from './Header.styles';

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
        {customerName && <Greeting>Hi, {customerName.split(' ')[0]}</Greeting>}
      </HeaderInner>
    </HeaderBar>
  );
}
