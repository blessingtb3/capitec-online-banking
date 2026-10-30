import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../../theme/tokens';

export type TileTone = 'blue' | 'navy' | 'slate' | 'red';

const TONE_BACKGROUND: Record<TileTone, string> = {
  blue: colors.primaryButtonBackground,
  navy: colors.heading,
  slate: colors.accentSlate,
  red: colors.accentRed,
};

export const TileGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${space.sm};

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${space.md};
  }

  ${media.desktop} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${space.lg};
  }
`;

/** Big colour tiles, echoing the brand homepage's product tiles. */
export const Tile = styled.div<{ $tone: TileTone }>`
  display: grid;
  gap: 4px;
  align-content: center;
  min-height: 132px;
  padding: ${space.lg};
  border-radius: ${radii.lg};
  background: ${({ $tone }) => TONE_BACKGROUND[$tone]};
  color: ${colors.onPrimary};

  ${media.desktop} {
    min-height: 170px;
    text-align: center;
    justify-items: center;
  }
`;

export const TileLabel = styled.p`
  font-size: ${fontSizes.md};
  font-weight: ${fontWeights.bold};
`;

export const TileValue = styled.p`
  font-size: ${fontSizes.xxl};
  font-weight: ${fontWeights.heavy};
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
`;

export const TileNote = styled.p`
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.semibold};
`;
