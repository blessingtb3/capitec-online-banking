import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../../theme/tokens';
import type { GoalStatus } from '../../../types/spending';

export const GoalList = styled.ul`
  display: grid;
  gap: ${space.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const GoalItem = styled.li`
  display: grid;
  gap: ${space.xs};
`;

export const GoalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${space.sm};
`;

export const GoalName = styled.span`
  font-weight: ${fontWeights.heavy};
`;

const STATUS_STYLE: Record<GoalStatus, { color: string; background: string }> = {
  on_track: { color: colors.success, background: colors.successBackground },
  warning: { color: colors.warning, background: colors.warningBackground },
  exceeded: { color: colors.error, background: colors.errorBackground },
};

export const StatusBadge = styled.span<{ $status: GoalStatus }>`
  padding: 2px 10px;
  border-radius: ${radii.pill};
  font-size: ${fontSizes.xs};
  font-weight: ${fontWeights.bold};
  color: ${({ $status }) => STATUS_STYLE[$status].color};
  background: ${({ $status }) => STATUS_STYLE[$status].background};
`;

export const GoalMeta = styled.p`
  display: flex;
  justify-content: space-between;
  gap: ${space.sm};
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;
