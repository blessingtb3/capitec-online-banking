import styled from 'styled-components';
import { media, radii } from '../../../theme/tokens';

/**
 * Both photos sit in the same 16:10 frame, cropped from the centre, so the
 * card below doesn't jump when the loan type changes. Desktop only, like the
 * illustration on the Loan products tab.
 */
export const Photo = styled.img`
  display: none;

  ${media.desktop} {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    object-position: center;
    border-radius: ${radii.lg};
  }
`;
