import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { makeStore } from '../store/store';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  /** The URL to start at, e.g. "/loan-estimator?tab=products". */
  route?: string;
}

/**
 * Renders with a fresh Redux store (so the RTK Query cache never leaks
 * between tests) inside an in-memory router.
 */
export function renderWithProviders(ui: ReactElement, { route = '/', ...options }: Options = {}) {
  const store = makeStore();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
