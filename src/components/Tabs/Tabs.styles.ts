import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../theme/tokens';

/** Chips in the grey band, like the Transact / Save / Insure strip on the brand site. */
export const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.xs};

  ${media.tablet} {
    gap: ${space.sm};
  }
`;

/** Plain white chips: the active tab and a hovered tab are shown by blue text only. */
export const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 7px ${space.sm};
  border: 0;
  border-radius: ${radii.sm};
  background: ${colors.background};
  color: ${({ $active }) => ($active ? colors.linkText : colors.text)};
  font-size: ${fontSizes.md};
  font-weight: ${fontWeights.semibold};
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: ${colors.linkText};
  }

  ${media.tablet} {
    gap: ${space.xs};
    padding: 7px ${space.md};
  }
`;

export const Panel = styled.div`
  &:focus-visible {
    border-radius: ${radii.md};
  }
`;
