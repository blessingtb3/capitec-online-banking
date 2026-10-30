import type { ButtonHTMLAttributes } from 'react';
import { StyledButton, type ButtonSize, type ButtonVariant } from './Button.styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', fullWidth = false, type = 'button', ...rest }: ButtonProps) {
  return <StyledButton type={type} $variant={variant} $size={size} $fullWidth={fullWidth} {...rest} />;
}
