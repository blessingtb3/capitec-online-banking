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

export const Tab = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: 7px ${space.md};
  border: 1px solid ${({ $active }) => ($active ? colors.primaryButtonBackground : 'transparent')};
  border-radius: ${radii.sm};
  background: ${({ $active }) => ($active ? colors.primaryButtonBackground : colors.background)};
  color: ${({ $active }) => ($active ? colors.onPrimary : colors.text)};
  font-size: ${fontSizes.md};
  font-weight: ${fontWeights.semibold};
  white-space: nowrap;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${colors.primaryButtonBackground};
    background: ${({ $active }) => ($active ? colors.buttonHoverBackground : colors.background)};
  }
`;

export const Panel = styled.div`
  &:focus-visible {
    border-radius: ${radii.md};
  }
`;
