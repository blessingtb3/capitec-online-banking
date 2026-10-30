import styled, { keyframes } from 'styled-components';
import { colors, fontSizes, fontWeights, space } from '../../theme/tokens';

export const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: ${space.sm};
  padding: ${space.xl} ${space.md};
  text-align: center;
`;

export const Title = styled.h3`
  font-size: ${fontSizes.lg};
  font-weight: ${fontWeights.heavy};
`;

export const Message = styled.p`
  max-width: 36em;
  color: ${colors.textMuted};
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  width: 32px;
  height: 32px;
  border: 3px solid ${colors.primaryTint};
  border-top-color: ${colors.primaryButtonBackground};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const IconCircle = styled.span<{ $tone: 'error' | 'neutral' }>`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  font-size: 24px;
  font-weight: ${fontWeights.heavy};
  background: ${({ $tone }) => ($tone === 'error' ? colors.errorBackground : colors.primaryTint)};
  color: ${({ $tone }) => ($tone === 'error' ? colors.error : colors.primaryButtonBackground)};
`;
