import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii } from '../../theme/tokens';

export const Group = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 3px;
  border-radius: ${radii.pill};
  background: ${colors.surfaceMuted};
`;

export const Option = styled.button<{ $selected: boolean }>`
  min-height: 36px;
  padding: 6px 14px;
  border: 0;
  border-radius: ${radii.pill};
  background: ${({ $selected }) => ($selected ? colors.primaryButtonBackground : 'transparent')};
  color: ${({ $selected }) => ($selected ? colors.onPrimary : colors.text)};
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.bold};
  cursor: pointer;

  &:hover {
    background: ${({ $selected }) => ($selected ? colors.buttonHoverBackground : colors.primaryTint)};
  }
`;
