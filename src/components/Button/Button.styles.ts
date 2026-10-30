import styled, { css } from 'styled-components';
import { colors, fontSizes, fontWeights, radii } from '../../theme/tokens';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'md' | 'sm';

const variants = {
  primary: css`
    background: ${colors.primaryButtonBackground};
    border-color: ${colors.primaryButtonBackground};
    color: ${colors.onPrimary};

    &:hover:not(:disabled) {
      background: ${colors.buttonHoverBackground};
      border-color: ${colors.buttonHoverBackground};
    }
  `,
  secondary: css`
    background: ${colors.background};
    border-color: ${colors.secondaryButtonBorder};
    color: ${colors.secondaryButtonBorder};

    &:hover:not(:disabled) {
      background: ${colors.buttonHoverBackground};
      border-color: ${colors.buttonHoverBackground};
      color: ${colors.onPrimary};
    }
  `,
};

export const StyledButton = styled.button<{ $variant: ButtonVariant; $size: ButtonSize; $fullWidth: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: ${({ $size }) => ($size === 'sm' ? '36px' : '46px')};
  padding: ${({ $size }) => ($size === 'sm' ? '6px 16px' : '10px 24px')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid;
  border-radius: ${radii.pill};
  font-size: ${({ $size }) => ($size === 'sm' ? fontSizes.sm : fontSizes.md)};
  font-weight: ${fontWeights.bold};
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  ${({ $variant }) => variants[$variant]}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
