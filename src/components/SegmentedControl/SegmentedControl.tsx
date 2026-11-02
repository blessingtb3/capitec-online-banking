import styles from './SegmentedControl.module.css';

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
}

/** A row of mutually exclusive toggle buttons (e.g. 7d / 30d / 90d / 1y). */
export function SegmentedControl<T extends string | number>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  const { group, optionButton, optionButtonSelected } = styles;
  return (
    <div className={group} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          className={`${optionButton} ${option.value === value ? optionButtonSelected : ''}`}
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
