import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../../theme/tokens';

export const Layout = styled.div`
  display: grid;
  gap: ${space.lg};
  align-items: start;

  ${media.desktop} {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
`;

/** Loan photo with the repayments card underneath. */
export const ResultColumn = styled.div`
  display: grid;
  gap: ${space.lg};
  align-content: start;
`;

export const Form = styled.form`
  display: grid;
  gap: ${space.md};
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${space.sm};
  margin: 0 0 ${space.lg};

  div {
    padding: ${space.sm} ${space.md};
    border-radius: ${radii.md};
    background: ${colors.surfaceMuted};
  }

  dt {
    font-size: ${fontSizes.xs};
    font-weight: ${fontWeights.bold};
    color: ${colors.textMuted};
  }

  dd {
    margin: 2px 0 0;
    font-size: ${fontSizes.lg};
    font-weight: ${fontWeights.heavy};
    font-variant-numeric: tabular-nums;
  }
`;

export const Placeholder = styled.p`
  padding: ${space.xl} ${space.md};
  text-align: center;
  color: ${colors.textMuted};
`;
