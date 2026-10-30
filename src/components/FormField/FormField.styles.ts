import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii, space } from '../../theme/tokens';

export const Field = styled.div`
  display: grid;
  gap: 6px;
  align-content: start;
`;

export const Label = styled.label`
  font-weight: ${fontWeights.bold};
`;

export const Hint = styled.p`
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;

export const ErrorText = styled.p`
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.bold};
  color: ${colors.error};
`;

/** Shared look for <input> and <select>, used by forms across the app. */
export const inputStyles = `
  width: 100%;
  min-height: 46px;
  padding: 10px ${space.md};
  border: 1px solid ${colors.border};
  border-radius: ${radii.pill};
  background-color: ${colors.background};
  font-size: ${fontSizes.md};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primaryButtonBackground};
    box-shadow: 0 0 0 3px ${colors.focusRing};
  }

  &[aria-invalid='true'] {
    border-color: ${colors.error};
  }
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const Select = styled.select`
  ${inputStyles}
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235f6873' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
`;
