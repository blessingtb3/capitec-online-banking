import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, shadows, space } from '../../../theme/tokens';

export const Grid = styled.ul`
  display: grid;
  gap: ${space.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ProductCard = styled.li`
  display: grid;
  gap: ${space.md};
  align-content: start;
  padding: ${space.lg};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};
  background: ${colors.background};
  box-shadow: ${shadows.card};
`;

export const Name = styled.h2`
  font-size: ${fontSizes.xl};
  font-weight: ${fontWeights.heavy};
`;

export const Description = styled.p`
  color: ${colors.textMuted};
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${space.sm};
  margin: 0;

  dt {
    font-size: ${fontSizes.xs};
    font-weight: ${fontWeights.bold};
    color: ${colors.textMuted};
  }

  dd {
    margin: 2px 0 0;
    font-weight: ${fontWeights.heavy};
  }
`;

export const Purposes = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.xs};
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 2px 10px;
    border-radius: ${radii.pill};
    background: ${colors.primaryTint};
    font-size: ${fontSizes.sm};
    font-weight: ${fontWeights.semibold};
  }
`;
