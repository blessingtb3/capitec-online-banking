import styled from 'styled-components';
import { colors, fontSizes, space } from './theme/tokens';

export const Main = styled.main`
  min-height: 70vh;
`;

export const Footer = styled.footer`
  padding: ${space.lg};
  border-top: 1px solid ${colors.border};
  text-align: center;
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;
