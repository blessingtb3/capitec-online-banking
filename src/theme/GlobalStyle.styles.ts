import { createGlobalStyle } from 'styled-components';
import { colors, fonts, fontSizes } from './tokens';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: ${fonts.body};
    font-size: ${fontSizes.md};
    line-height: 1.5;
    color: ${colors.text};
    background: ${colors.background};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, p {
    margin: 0;
  }

  h1, h2, h3 {
    color: ${colors.heading};
  }

  button, input, select {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.focusRing};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/** Visually hidden but available to screen readers. */
export const visuallyHidden = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
