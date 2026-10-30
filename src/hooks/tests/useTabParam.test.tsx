import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { useTabParam } from '../useTabParam';

const TAB_IDS = ['summary', 'trends'] as const;

function Probe() {
  const [tab, setTab] = useTabParam(TAB_IDS);
  const location = useLocation();
  return (
    <>
      <p>active: {tab}</p>
      <p>url: {location.search}</p>
      <button onClick={() => setTab('trends')}>Go to trends</button>
    </>
  );
}

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Probe />
    </MemoryRouter>,
  );

describe('useTabParam', () => {
  it('defaults to the first tab', () => {
    renderAt('/page');
    expect(screen.getByText('active: summary')).toBeInTheDocument();
  });

  it('reads the tab from the URL and ignores unknown values', () => {
    renderAt('/page?tab=trends');
    expect(screen.getByText('active: trends')).toBeInTheDocument();
  });

  it('falls back for unknown tabs', () => {
    renderAt('/page?tab=nope');
    expect(screen.getByText('active: summary')).toBeInTheDocument();
  });

  it('writes the tab to the URL, keeping other params', async () => {
    renderAt('/page?mockError=loans');
    await userEvent.click(screen.getByRole('button', { name: 'Go to trends' }));
    expect(screen.getByText('active: trends')).toBeInTheDocument();
    expect(screen.getByText('url: ?mockError=loans&tab=trends')).toBeInTheDocument();
  });
});
