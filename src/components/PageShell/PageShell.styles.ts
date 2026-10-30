import styled from 'styled-components';
import { colors, fontSizes, fontWeights, layout, media, space } from '../../theme/tokens';

const container = `
  width: 100%;
  max-width: calc(${layout.maxWidth} + 2 * ${space.lg});
  margin: 0 auto;
  padding-left: ${space.md};
  padding-right: ${space.md};

  ${media.tablet} {
    padding-left: ${space.lg};
    padding-right: ${space.lg};
  }
`;

export const Hero = styled.section`
  ${container}
  display: grid;
  gap: ${space.sm};
  padding-top: ${space.xl};
  padding-bottom: ${space.lg};
`;

export const Title = styled.h1`
  font-size: ${fontSizes.display};
  font-weight: ${fontWeights.heavy};
  line-height: 1.1;
`;

export const Lead = styled.p`
  max-width: 40em;
  font-size: ${fontSizes.lg};
`;

/** Full-width grey strip holding the page's tabs. */
export const Band = styled.div`
  background: ${colors.surfaceMuted};
`;

export const BandInner = styled.div`
  ${container}
  padding-top: ${space.sm};
  padding-bottom: ${space.sm};
`;

/** The heading above already provides the top spacing. */
export const Content = styled.div`
  ${container}
  padding-bottom: ${space.xxl};
`;
