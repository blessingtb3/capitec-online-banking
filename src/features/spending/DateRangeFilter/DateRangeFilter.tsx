import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button/Button';
import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl';
import type { DateRange, DateRangePreset, Period } from '../../../types/spending';
import { formatDate } from '../../../utils/format';
import { ActiveRange, CustomForm, DateInput, DateLabel, ErrorText, FilterBar } from './DateRangeFilter.styles';

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
      <FilterBar>
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
          <ActiveRange>
            Showing {formatDate(customRange.startDate)} – {formatDate(customRange.endDate)}
          </ActiveRange>
        )}
        {!allowCustom && customRange && <ActiveRange>Your custom dates apply to the Transactions tab only.</ActiveRange>}
      </FilterBar>

      {allowCustom && showCustom && (
        <CustomForm onSubmit={applyCustomRange} aria-label="Custom date range" noValidate>
          <DateLabel>
            From
            <DateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </DateLabel>
          <DateLabel>
            To
            <DateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </DateLabel>
          <Button type="submit" size="sm">
            Apply
          </Button>
          <Button variant="secondary" size="sm" onClick={clearCustomRange}>
            Cancel
          </Button>
          {error && <ErrorText role="alert">{error}</ErrorText>}
        </CustomForm>
      )}
    </div>
  );
}
