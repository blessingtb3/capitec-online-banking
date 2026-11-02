import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
  afterEach(() => vi.restoreAllMocks());

  it('follows the media query as it changes', () => {
    const listeners = new Set<() => void>();
    const mediaQuery = {
      matches: false,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery as unknown as MediaQueryList);

    const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 719px)'));
    expect(result.current).toBe(false);

    mediaQuery.matches = true;
    act(() => listeners.forEach((listener) => listener()));
    expect(result.current).toBe(true);

    unmount();
    expect(listeners.size).toBe(0);
  });
});
