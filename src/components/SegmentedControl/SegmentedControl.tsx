import { Group, Option } from './SegmentedControl.styles';

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
}

/** A row of mutually exclusive toggle buttons (e.g. 7d / 30d / 90d / 1y). */
export function SegmentedControl<T extends string | number>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <Group role="group" aria-label={label}>
      {options.map((option) => (
        <Option
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          $selected={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Option>
      ))}
    </Group>
  );
}
