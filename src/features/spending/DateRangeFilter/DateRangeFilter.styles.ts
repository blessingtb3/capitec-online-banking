import styled from 'styled-components';
import { inputStyles } from '../../../components/FormField/FormField.styles';
import { colors, fontSizes, fontWeights, space } from '../../../theme/tokens';

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space.sm};
`;

export const CustomForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: ${space.sm};
  width: 100%;
  margin-top: ${space.xs};
`;

export const DateLabel = styled.label`
  display: grid;
  gap: 4px;
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.bold};
`;

export const DateInput = styled.input`
  ${inputStyles}
  width: auto;
  min-height: 40px;
`;

export const ActiveRange = styled.p`
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.semibold};
  color: ${colors.textMuted};
`;

export const ErrorText = styled.p`
  width: 100%;
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.bold};
  color: ${colors.error};
`;
