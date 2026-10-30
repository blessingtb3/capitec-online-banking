import type { ReactNode } from 'react';
import { Band, BandInner, Content, Hero, Lead, Title } from './PageShell.styles';

interface PageShellProps {
  /** Shown in the browser tab (React 19 hoists <title> into <head>). */
  documentTitle: string;
  title: string;
  lead?: ReactNode;
  /** The page's tab list, shown in a grey band directly under the site header. */
  tabs?: ReactNode;
  children: ReactNode;
}

/** Common page layout: grey tab band (directly under the header), heading, content. */
export function PageShell({ documentTitle, title, lead, tabs, children }: PageShellProps) {
  return (
    <>
      <title>{documentTitle}</title>
      {tabs && (
        <Band>
          <BandInner>{tabs}</BandInner>
        </Band>
      )}
      <Hero aria-labelledby="page-title">
        <Title id="page-title">{title}</Title>
        {lead && <Lead>{lead}</Lead>}
      </Hero>
      <Content>{children}</Content>
    </>
  );
}
