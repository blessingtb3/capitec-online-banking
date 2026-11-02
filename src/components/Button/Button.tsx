import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', fullWidth = false, type = 'button', className, ...rest }: ButtonProps) {
  const { button, fullWidthButton } = styles;
  return (
    <button
      type={type}
      className={`${button} ${styles[variant]} ${styles[size]} ${fullWidth ? fullWidthButton : ''} ${className ?? ''}`}
      {...rest}
    />
  );
}
