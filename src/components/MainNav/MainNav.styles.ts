import { NavLink } from 'react-router';
import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii } from '../../theme/tokens';

/** The segmented "Personal | Business" style switch from the brand site. */
export const NavList = styled.ul`
  display: flex;
  margin: 0;
  padding: 3px;
  list-style: none;
  border-radius: ${radii.sm};
  background: ${colors.primaryButtonBackground};

  li {
    flex: 1;
  }
`;

export const NavItem = styled(NavLink)`
  display: block;
  padding: 8px 22px;
  border-radius: 6px;
  color: ${colors.onPrimary};
  font-size: ${fontSizes.md};
  font-weight: ${fontWeights.bold};
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: ${colors.buttonHoverBackground};
  }

  &.active {
    background: ${colors.background};
    color: ${colors.primaryButtonBackground};
  }
`;
