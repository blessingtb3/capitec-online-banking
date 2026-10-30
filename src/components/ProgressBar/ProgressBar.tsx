import { Fill, Track, type ProgressTone } from './ProgressBar.styles';

interface ProgressBarProps {
  /** 0–100; values outside are clamped for display. */
  value: number;
  label: string;
  tone?: ProgressTone;
  valueText?: string;
}

export function ProgressBar({ value, label, tone = 'primary', valueText }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <Track
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={valueText}
    >
      <Fill $tone={tone} $percent={clamped} />
    </Track>
  );
}
