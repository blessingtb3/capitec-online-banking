import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button/Button';
import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl';
import type { DateRange, DateRangePreset, Period } from '../../../types/spending';
import { formatDate } from '../../../utils/format';
import fieldStyles from '../../../components/FormField/FormField.module.css';
import styles from './DateRangeFilter.module.css';

interface DateRangeFilterProps {
  presets: DateRangePreset[];
  period: Period;
  customRange: DateRange | null;
  onPeriodChange: (period: Period) => void;
  onCustomRangeChange: (range: DateRange | null) => void;
  /** Some views (the overview) only support preset periods. */
  allowCustom?: boolean;
}

/** Quick period presets plus an optional custom date range. */
export function DateRangeFilter({
  presets,
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
  allowCustom = true,
}: DateRangeFilterProps) {
  const { filterBar, activeRange, customForm, dateLabel, dateInput, errorText } = styles;
  const { input } = fieldStyles;
  const [showCustom, setShowCustom] = useState(customRange !== null);
  const [startDate, setStartDate] = useState(customRange?.startDate ?? '');
  const [endDate, setEndDate] = useState(customRange?.endDate ?? '');
  const [error, setError] = useState('');

  const applyCustomRange = (event: FormEvent) => {
    event.preventDefault();
    if (!startDate || !endDate) return setError('Choose both a start and an end date.');
    if (startDate > endDate) return setError('The start date must be on or before the end date.');
    setError('');
    onCustomRangeChange({ startDate, endDate });
  };

  const clearCustomRange = () => {
    setShowCustom(false);
    setStartDate('');
    setEndDate('');
    setError('');
    onCustomRangeChange(null);
  };

  return (
    <div>
      <div className={filterBar}>
        <SegmentedControl
          label="Time period"
          options={presets.map((preset) => ({ value: preset.value, label: preset.label }))}
          value={allowCustom && customRange ? null : period}
          onChange={(value) => {
            clearCustomRange();
            onPeriodChange(value);
          }}
        />
        {allowCustom && !showCustom && (
          <Button variant="secondary" size="sm" onClick={() => setShowCustom(true)}>
            Custom dates
          </Button>
        )}
        {allowCustom && customRange && (
          <p className={activeRange}>
            Showing {formatDate(customRange.startDate)} – {formatDate(customRange.endDate)}
          </p>
        )}
        {!allowCustom && customRange && <p className={activeRange}>Your custom dates apply to the Transactions tab only.</p>}
      </div>

      {allowCustom && showCustom && (
        <form className={customForm} onSubmit={applyCustomRange} aria-label="Custom date range" noValidate>
          <label className={dateLabel}>
            From
            <input className={`${input} ${dateInput}`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className={dateLabel}>
            To
            <input className={`${input} ${dateInput}`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <Button type="submit" size="sm">
            Apply
          </Button>
          <Button variant="secondary" size="sm" onClick={clearCustomRange}>
            Cancel
          </Button>
          {error && <p className={errorText} role="alert">{error}</p>}
        </form>
      )}
    </div>
  );
}
