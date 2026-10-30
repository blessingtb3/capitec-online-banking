import styled from 'styled-components';
import { colors, fontSizes, fontWeights, radii, shadows, space } from '../../theme/tokens';

export const CardSection = styled.section`
  min-width: 0;
  padding: clamp(18px, 2.4vw, 28px);
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.card};
`;

export const CardHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${space.sm};
  margin-bottom: ${space.md};
`;

export const CardTitle = styled.h2`
  font-size: ${fontSizes.lg};
  font-weight: ${fontWeights.heavy};
`;

export const CardSubtitle = styled.p`
  margin-top: 2px;
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;
