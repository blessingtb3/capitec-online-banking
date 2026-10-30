import styled from 'styled-components';
import { colors, fontSizes, fontWeights, space } from '../../../theme/tokens';

export const ChartArea = styled.div`
  position: relative;
  height: 240px;
`;

export const Details = styled.details`
  margin-top: ${space.md};

  summary {
    cursor: pointer;
    font-weight: ${fontWeights.bold};
    color: ${colors.primaryButtonBackground};
  }
`;

export const ScrollArea = styled.div`
  max-height: 320px;
  margin-top: ${space.sm};
  overflow: auto;
`;

export const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fontSizes.sm};
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 8px ${space.xs};
    border-bottom: 1px solid ${colors.border};
    text-align: right;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  th {
    position: sticky;
    top: 0;
    background: ${colors.background};
    color: ${colors.textMuted};
    font-weight: ${fontWeights.bold};
  }
`;
