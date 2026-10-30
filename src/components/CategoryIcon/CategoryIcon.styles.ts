import styled from 'styled-components';
import { colors } from '../../theme/tokens';

/** The colour comes from API data, so it's applied via attrs rather than generating a class per colour. */
export const IconBadge = styled.span.attrs<{ $size: number; $color: string }>(({ $color }) => ({
  style: { background: $color },
}))`
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 10px;
  color: ${colors.text};
`;
