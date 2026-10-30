import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, space } from '../../../theme/tokens';

export const Columns = styled.div`
  display: grid;
  gap: ${space.lg};
  align-items: start;

  ${media.desktop} {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  }
`;

/** Keeps the result in view while the form scrolls on large screens. */
export const ResultColumn = styled.div`
  ${media.desktop} {
    position: sticky;
    top: ${space.lg};
  }
`;

export const Placeholder = styled.div`
  display: grid;
  gap: ${space.xs};
  padding: ${space.xl} ${space.md};
  text-align: center;
  color: ${colors.textMuted};
`;

export const ScheduleTitle = styled.h4`
  margin-bottom: ${space.xs};
  font-size: ${fontSizes.md};
  font-weight: ${fontWeights.heavy};
  color: ${colors.heading};
`;
