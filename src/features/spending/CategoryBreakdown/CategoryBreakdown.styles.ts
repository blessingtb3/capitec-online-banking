import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../../theme/tokens';

export const Layout = styled.div`
  display: grid;
  gap: ${space.lg};
  align-items: center;

  ${media.tablet} {
    grid-template-columns: minmax(160px, 220px) minmax(0, 620px);
    gap: ${space.xl};
  }
`;

export const ChartWrap = styled.div`
  position: relative;
  max-width: 220px;
  width: 100%;
  margin: 0 auto;
  aspect-ratio: 1;
`;

/** The total, printed in the doughnut's hole. */
export const CenterLabel = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
  pointer-events: none;
`;

export const CenterCaption = styled.span`
  font-size: ${fontSizes.xs};
  font-weight: ${fontWeights.bold};
  color: ${colors.textMuted};
`;

export const CenterValue = styled.span`
  font-size: ${fontSizes.lg};
  font-weight: ${fontWeights.heavy};
  color: ${colors.heading};
`;

export const List = styled.ul`
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Row = styled.button<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${space.sm};
  width: 100%;
  padding: ${space.xs} 10px;
  border: 0;
  border-radius: ${radii.sm};
  background: ${({ $selected }) => ($selected ? colors.primaryTint : 'transparent')};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${colors.primaryTint};
  }
`;

export const Name = styled.span`
  font-weight: ${fontWeights.bold};
`;

export const Meta = styled.span`
  display: block;
  font-size: ${fontSizes.xs};
  color: ${colors.textMuted};
`;

export const Amount = styled.span`
  font-weight: ${fontWeights.heavy};
  font-variant-numeric: tabular-nums;
`;
