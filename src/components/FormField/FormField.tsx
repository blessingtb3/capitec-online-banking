import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { ErrorText, Field, Hint, Input, Label, Select } from './FormField.styles';

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
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      {hint && <Hint id={`${id}-hint`}>{hint}</Hint>}
      {children}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </Field>
  );
}

type TextFieldProps = FieldChrome & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;

export function TextField({ id, label, hint, error, ...inputProps }: TextFieldProps) {
  return (
    <Chrome id={id} label={label} hint={hint} error={error}>
      <Input
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
  return (
    <Chrome id={id} label={label} hint={hint} error={error}>
      <Select
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
      </Select>
    </Chrome>
  );
}
