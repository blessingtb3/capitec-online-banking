import styled from 'styled-components';
import { colors } from '../../theme/tokens';

export type ProgressTone = 'primary' | 'success' | 'warning' | 'error';

const TONE_COLOR: Record<ProgressTone, string> = {
  primary: colors.primaryButtonBackground,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
};

export const Track = styled.div`
  position: relative;
  height: 10px;
  border-radius: 5px;
  background: ${colors.surfaceMuted};
  overflow: hidden;
`;

/** Width changes often, so it goes in an inline style via attrs rather than a new class per value. */
export const Fill = styled.div.attrs<{ $tone: ProgressTone; $percent: number }>(({ $percent }) => ({
  style: { width: `${$percent}%` },
}))`
  height: 100%;
  border-radius: 5px;
  background: ${({ $tone }) => TONE_COLOR[$tone]};
  transition: width 0.4s ease;
`;
