import styled from 'styled-components';
import { colors, fontSizes, fontWeights, media, radii, space } from '../../../theme/tokens';
import type { RiskCategory } from '../../../types/loans';

export const Wrapper = styled.div`
  display: grid;
  gap: ${space.lg};
`;

export const Banner = styled.div<{ $eligible: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${space.sm};
  padding: ${space.md} ${space.lg};
  border-radius: ${radii.md};
  background: ${({ $eligible }) => ($eligible ? colors.successBackground : colors.errorBackground)};
`;

export const BannerIcon = styled.span<{ $eligible: boolean }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $eligible }) => ($eligible ? colors.success : colors.error)};
  color: ${colors.onPrimary};
  font-weight: ${fontWeights.heavy};
`;

export const BannerTitle = styled.h3`
  font-size: ${fontSizes.xl};
  font-weight: ${fontWeights.heavy};
  color: ${colors.text};
`;

export const BannerText = styled.p`
  margin-top: 2px;
`;

export const HeroFigure = styled.div`
  text-align: center;
`;

export const HeroLabel = styled.p`
  font-weight: ${fontWeights.bold};
  color: ${colors.textMuted};
`;

export const HeroValue = styled.p`
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: ${fontWeights.heavy};
  line-height: 1.1;
  color: ${colors.heading};
  font-variant-numeric: tabular-nums;
`;

export const HeroNote = styled.p`
  font-size: ${fontSizes.sm};
  color: ${colors.textMuted};
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${space.sm};
  margin: 0;

  ${media.desktop} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  div {
    padding: ${space.sm} ${space.md};
    border-radius: ${radii.md};
    background: ${colors.surfaceMuted};
  }

  dt {
    font-size: ${fontSizes.xs};
    font-weight: ${fontWeights.bold};
    color: ${colors.textMuted};
  }

  dd {
    margin: 2px 0 0;
    font-size: ${fontSizes.lg};
    font-weight: ${fontWeights.heavy};
    font-variant-numeric: tabular-nums;
  }
`;

export const SectionTitle = styled.h4`
  margin-bottom: ${space.xs};
  font-size: ${fontSizes.md};
  font-weight: ${fontWeights.heavy};
  color: ${colors.heading};
`;

export const LikelihoodHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${space.sm};
  margin-bottom: ${space.xs};
  font-weight: ${fontWeights.bold};
`;

const RISK_STYLE: Record<RiskCategory, { color: string; background: string }> = {
  low: { color: colors.success, background: colors.successBackground },
  medium: { color: colors.warning, background: colors.warningBackground },
  high: { color: colors.error, background: colors.errorBackground },
};

export const RiskBadge = styled.span<{ $risk: RiskCategory }>`
  padding: 2px 10px;
  border-radius: ${radii.pill};
  font-size: ${fontSizes.sm};
  font-weight: ${fontWeights.bold};
  color: ${({ $risk }) => RISK_STYLE[$risk].color};
  background: ${({ $risk }) => RISK_STYLE[$risk].background};
`;

export const RiskLine = styled.p`
  margin-top: ${space.xs};
`;

export const Disclaimer = styled.p`
  font-size: ${fontSizes.xs};
  color: ${colors.textMuted};
`;
