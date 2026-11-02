import { colors, fonts, fontSizes, fontWeights, layout, radii, shadows, space } from './tokens';

const TOKEN_GROUPS = {
  color: colors,
  font: fonts,
  'font-size': fontSizes,
  'font-weight': fontWeights,
  space,
  radius: radii,
  shadow: shadows,
  layout,
};

const toKebabCase = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** Publishes the design tokens as CSS variables (e.g. --color-text-muted) for the CSS Modules. */
export function applyTokens(root: HTMLElement = document.documentElement) {
  Object.entries(TOKEN_GROUPS).forEach(([group, tokens]) => {
    Object.entries(tokens).forEach(([name, value]) => {
      root.style.setProperty(`--${group}-${toKebabCase(name)}`, String(value));
    });
  });
}
