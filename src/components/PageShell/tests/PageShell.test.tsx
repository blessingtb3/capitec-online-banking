import { render, screen } from '@testing-library/react';
import { PageShell } from '../PageShell';

describe('PageShell', () => {
  it('renders the heading, lead, tabs and content, and sets the document title', () => {
    render(
      <PageShell documentTitle="Loans · Capitec" title="Loan estimator" lead="Borrow wisely" tabs={<div role="tablist" aria-label="Sections" />}>
        <p>Body</p>
      </PageShell>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Loan estimator' })).toBeInTheDocument();
    expect(screen.getByText('Borrow wisely')).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(document.title).toBe('Loans · Capitec');
  });

  it('puts the tabs above the page heading, straight under the site header', () => {
    render(
      <PageShell documentTitle="Insights" title="Your spending" tabs={<div role="tablist" aria-label="Sections" />}>
        <p>Body</p>
      </PageShell>,
    );
    const tabs = screen.getByRole('tablist', { name: 'Sections' });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(tabs.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
