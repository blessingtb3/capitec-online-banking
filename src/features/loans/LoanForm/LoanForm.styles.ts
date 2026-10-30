import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../../theme/tokens';

export const Form = styled.form`
  display: grid;
  gap: ${space.lg};
`;

export const Fieldset = styled.fieldset`
  display: grid;
  gap: ${space.md};
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Legend = styled.legend`
  margin-bottom: ${space.sm};
  padding: 0;
  font-size: ${fontSizes.lg};
  font-weight: ${fontWeights.heavy};
  color: ${colors.heading};
`;

export const ProductOptions = styled.div`
  display: grid;
  gap: ${space.sm};
  grid-column: 1 / -1;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ProductCard = styled.label<{ $selected: boolean }>`
  display: grid;
  gap: 2px;
  padding: ${space.md};
  border: 2px solid ${({ $selected }) => ($selected ? colors.primaryButtonBackground : colors.border)};
  border-radius: ${radii.md};
  background: ${({ $selected }) => ($selected ? colors.primaryTint : colors.background)};
  cursor: pointer;

  &:focus-within {
    box-shadow: 0 0 0 3px ${colors.focusRing};
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`;

export const ProductName = styled.span`
  font-weight: ${fontWeights.heavy};
`;

export const ProductMeta = styled.span`
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
`;

export const ErrorSummary = styled.p`
  padding: ${space.sm} ${space.md};
  border-radius: ${radii.sm};
  background: ${colors.errorBackground};
  color: ${colors.error};
  font-weight: ${fontWeights.bold};
`;
