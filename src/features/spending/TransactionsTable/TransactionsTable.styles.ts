import styled from 'styled-components';
import { Select } from '../../../components/FormField/FormField.styles';
import { visuallyHidden } from '../../../theme/GlobalStyle.styles';
import { colors, fontSizes, fontWeights, media, space } from '../../../theme/tokens';

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space.sm};
  margin-bottom: ${space.md};
`;

export const ToolbarSelect = styled(Select)`
  width: auto;
  flex: 1 1 200px;

  ${media.tablet} {
    flex: 0 1 220px;
  }
`;

export const HiddenLabel = styled.label`
  ${visuallyHidden}
`;

export const HiddenCaption = styled.caption`
  ${visuallyHidden}
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${fontSizes.md};

  th {
    padding: 0 ${space.sm} 10px;
    border-bottom: 1px solid ${colors.border};
    text-align: left;
    font-size: ${fontSizes.xs};
    font-weight: ${fontWeights.bold};
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${colors.textMuted};
  }

  td {
    padding: 14px ${space.sm};
    border-bottom: 1px solid ${colors.border};
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  /* Mobile: each row becomes a compact two-column card. */
  @media (max-width: 719px) {
    thead {
      display: none;
    }

    tbody tr {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 2px ${space.sm};
      padding: ${space.sm} 0;
      border-bottom: 1px solid ${colors.border};
    }

    tbody td {
      padding: 0;
      border: 0;
    }

    td[data-column='merchant'] {
      grid-row: 1 / 3;
    }

    td[data-column='date'] {
      grid-column: 2;
      text-align: right;
      font-size: ${fontSizes.xs};
      color: ${colors.textMuted};
    }

    td[data-column='category'],
    td[data-column='method'] {
      display: none;
    }
  }
`;

export const Merchant = styled.span`
  display: flex;
  align-items: center;
  gap: ${space.sm};
  font-weight: ${fontWeights.bold};
`;

export const Description = styled.span`
  display: block;
  font-size: ${fontSizes.xs};
  font-weight: ${fontWeights.regular};
  color: ${colors.textMuted};
`;

export const Muted = styled.span`
  color: ${colors.textMuted};
`;

export const AmountHeader = styled.th`
  && {
    text-align: right;
  }
`;

export const AmountCell = styled.td`
  text-align: right;
  font-weight: ${fontWeights.heavy};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${space.sm};
  margin-top: ${space.md};
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;

export const PageButtons = styled.div`
  display: flex;
  gap: ${space.xs};
`;
