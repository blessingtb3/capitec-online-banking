/**
 * Design tokens: the single source of truth for colours, spacing and type.
 * Styles files import from here; components never hard-code a hex value.
 */

export const colors = {
  /* ---- Core tokens ---- */
  background: '#FFFFFF',
  text: '#000000',
  heading: '#0133a0',
  primaryButtonBackground: '#2e70ef',
  secondaryButtonBorder: '#2e70ef',
  buttonHoverBackground: '#2259d0',

  /* ---- Supporting tokens (neutrals, surfaces and status) ---- */
  /** Blue for interactive text (active/hovered tabs). Same blue as the button hover:
   *  #2e70ef on white is ~4.49:1, just under WCAG AA's 4.5:1 for normal text; this is ~6.2:1. */
  linkText: '#2259d0',
  textMuted: '#5f6873',
  border: '#e3e6eb',
  surfaceMuted: '#f3f3f3',
  primaryTint: '#eef3fd',
  focusRing: 'rgba(46, 112, 239, 0.35)',
  onPrimary: '#FFFFFF',

  /* Accent tiles, echoing the brand's Insure / Credit tiles */
  accentSlate: '#627480',
  accentRed: '#d63426',

  success: '#1f7a4a',
  successBackground: '#e7f5ee',
  warning: '#9a5b00',
  warningBackground: '#fff3dc',
  error: '#b3261e',
  errorBackground: '#fdecea',
} as const;

export const fonts = {
  body: "'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
} as const;

export const fontSizes = {
  xs: '0.8125rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.375rem',
  xxl: '2rem',
  display: 'clamp(2.25rem, 5vw, 3.5rem)',
} as const;

export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
  heavy: 800,
} as const;

export const space = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

export const radii = {
  sm: '8px',
  md: '14px',
  lg: '20px',
  pill: '999px',
} as const;

export const shadows = {
  card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 16px rgba(16, 24, 40, 0.06)',
} as const;

/** Min-width media queries, mobile first. */
export const media = {
  tablet: '@media (min-width: 720px)',
  desktop: '@media (min-width: 1024px)',
} as const;

export const layout = {
  maxWidth: '1180px',
} as const;
