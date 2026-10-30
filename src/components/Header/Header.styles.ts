import { Link } from 'react-router';
import styled from 'styled-components';
import { colors, fontWeights, layout, media, space } from '../../theme/tokens';

export const HeaderBar = styled.header`
  background: ${colors.background};
  border-bottom: 1px solid ${colors.border};
`;

export const HeaderInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space.sm} ${space.lg};
  max-width: calc(${layout.maxWidth} + 2 * ${space.lg});
  margin: 0 auto;
  padding: ${space.sm} ${space.md};

  ${media.tablet} {
    flex-wrap: nowrap;
    min-height: 76px;
    padding: 0 ${space.lg};
  }
`;

/**
 * capitec-logo.png is a 600×600 transparent canvas with the logo in a
 * 542×81 strip (top-left at 29, 259). We show just that strip, so the logo
 * fills its space and lines up with the page edge.
 */
const LOGO = { canvas: 600, x: 29, y: 259, width: 542, height: 81 } as const;
const LOGO_HEIGHT = { mobile: 24, desktop: 30 } as const;

const logoFrame = (height: number) => {
  const scale = height / LOGO.height;
  return `
    width: ${LOGO.width * scale}px;
    height: ${height}px;

    img {
      width: ${LOGO.canvas * scale}px;
      height: ${LOGO.canvas * scale}px;
      left: ${-LOGO.x * scale}px;
      top: ${-LOGO.y * scale}px;
    }
  `;
};

export const BrandLink = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 4px;
`;

export const LogoFrame = styled.span`
  position: relative;
  display: block;
  overflow: hidden;
  ${logoFrame(LOGO_HEIGHT.mobile)}

  ${media.tablet} {
    ${logoFrame(LOGO_HEIGHT.desktop)}
  }

  img {
    position: absolute;
    max-width: none;
  }
`;

/** Sits on its own row on mobile, inline on wider screens. */
export const NavSlot = styled.div`
  order: 3;
  width: 100%;

  ${media.tablet} {
    order: 0;
    width: auto;
  }
`;

export const Greeting = styled.p`
  margin-left: auto;
  font-weight: ${fontWeights.semibold};
  color: ${colors.text};
  white-space: nowrap;
`;
