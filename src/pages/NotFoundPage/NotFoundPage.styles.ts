import { Link } from 'react-router';
import styled from 'styled-components';
import { colors, fontWeights, radii } from '../../theme/tokens';

export const HomeLink = styled(Link)`
  display: inline-flex;
  padding: 10px 24px;
  border-radius: ${radii.pill};
  background: ${colors.primaryButtonBackground};
  color: ${colors.onPrimary};
  font-weight: ${fontWeights.bold};
  text-decoration: none;

  &:hover {
    background: ${colors.buttonHoverBackground};
  }
`;
