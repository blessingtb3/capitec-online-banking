import { SegmentedControl } from '../../../components/SegmentedControl/SegmentedControl';
import type { DateRangePreset, Period } from '../../../types/spending';

interface DateRangeFilterProps {
  presets: DateRangePreset[];
  period: Period;
  onPeriodChange: (period: Period) => void;
}

/** Quick period presets. */
export function DateRangeFilter({ presets, period, onPeriodChange }: DateRangeFilterProps) {
  return (
    <SegmentedControl
      label="Time period"
      options={presets.map((preset) => ({ value: preset.value, label: preset.label }))}
      value={period}
      onChange={onPeriodChange}
    />
  );
}
