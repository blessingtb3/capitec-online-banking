import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, shadows, space } from '../../../theme/tokens';

/** Cards on the left, illustration on the right (desktop only). */
export const Layout = styled.div`
  display: grid;
  gap: ${space.xl};
  align-items: center;

  ${media.desktop} {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  }
`;

/** One product per row: Personal Loan, then Vehicle Finance under it. */
export const ProductList = styled.ul`
  display: grid;
  gap: ${space.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

/** Decorative, so it's left out on smaller screens where it would crowd the cards. */
export const Illustration = styled.img`
  display: none;

  ${media.desktop} {
    display: block;
    width: 100%;
    max-width: 520px;
    height: auto;
    justify-self: center;
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
