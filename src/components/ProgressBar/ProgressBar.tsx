import styles from './ProgressBar.module.css';

export type ProgressTone = 'primary' | 'success' | 'warning' | 'error' | 'accentRed';

interface ProgressBarProps {
  /** 0–100; values outside are clamped for display. */
  value: number;
  label: string;
  tone?: ProgressTone;
  valueText?: string;
}

export function ProgressBar({ value, label, tone = 'primary', valueText }: ProgressBarProps) {
  const { track, fill } = styles;
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div
      className={track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={valueText}
    >
      <div className={fill} style={{ width: `${clamped}%` }} data-tone={tone} />
    </div>
  );
}
