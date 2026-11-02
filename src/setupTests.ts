// Adds DOM matchers such as toBeInTheDocument() and toHaveTextContent()
import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';

/** jsdom has no matchMedia, so tests run as desktop unless they mock it. */
window.matchMedia = (query: string) =>
  ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList;

/**
 * jsdom has no <canvas>, so Chart.js can't draw in tests. Replace the
 * react-chartjs-2 components with a stub that exposes the chart's labels and
 * data as text, so tests can still assert on what would be plotted.
 */
vi.mock('react-chartjs-2', () => {
  const stub =
    (type: string) =>
    ({ data, ...rest }: { data: { labels?: unknown[]; datasets: { label?: string; data: unknown[] }[] } } & Record<string, unknown>) =>
      createElement('div', {
        'data-testid': `${type}-chart`,
        'aria-label': rest['aria-label'] as string | undefined,
        'data-labels': JSON.stringify(data.labels ?? []),
        'data-values': JSON.stringify(data.datasets.map((d) => d.data)),
      });
  return { Bar: stub('bar'), Doughnut: stub('doughnut') };
});
