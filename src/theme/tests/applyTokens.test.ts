import { applyTokens } from '../applyTokens';
import { colors, space } from '../tokens';

describe('applyTokens', () => {
  it('publishes tokens as kebab-case CSS variables', () => {
    const root = document.createElement('div');
    applyTokens(root);
    expect(root.style.getPropertyValue('--color-text-muted')).toBe(colors.textMuted);
    expect(root.style.getPropertyValue('--space-lg')).toBe(space.lg);
  });
});
