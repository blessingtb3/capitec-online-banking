import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface FieldChrome {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

/** Ids for aria-describedby: the hint, plus the error when there is one. */
const describedBy = ({ id, hint, error }: FieldChrome) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

function Chrome({ id, label, hint, error, children }: FieldChrome & { children: ReactNode }) {
  const { field, fieldLabel, fieldHint, errorText } = styles;
  return (
    <div className={field}>
      <label className={fieldLabel} htmlFor={id}>{label}</label>
      {hint && <p className={fieldHint} id={`${id}-hint`}>{hint}</p>}
      {children}
      {error && <p className={errorText} id={`${id}-error`}>{error}</p>}
    </div>
  );
}

type TextFieldProps = FieldChrome & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

export function TextField({ id, label, hint, error, ...inputProps }: TextFieldProps) {
  const { input } = styles;
  return (
    <Chrome id={id} label={label} hint={hint} error={error}>
      <input
        className={input}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ id, label, hint, error })}
        {...inputProps}
      />
    </Chrome>
  );
}

type SelectFieldProps = FieldChrome &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function SelectField({ id, label, hint, error, options, placeholder, ...selectProps }: SelectFieldProps) {
  const { select } = styles;
  return (
    <Chrome id={id} label={label} hint={hint} error={error}>
      <select
        className={select}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ id, label, hint, error })}
        {...selectProps}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Chrome>
  );
}
