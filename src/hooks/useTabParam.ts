import { useSearchParams } from 'react-router';

/**
 * Keeps the active tab in the URL (?tab=...), so a tab survives a refresh,
 * can be bookmarked or shared, and works with the browser's back button.
 * Unknown or missing values fall back to the first tab.
 */
export function useTabParam<T extends string>(tabIds: readonly T[]): [T, (tab: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('tab');
  const activeTab = tabIds.find((id) => id === requested) ?? tabIds[0];

  const setTab = (tab: T) =>
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('tab', tab);
      return next;
    });

  return [activeTab, setTab];
}
