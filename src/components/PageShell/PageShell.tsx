import type { ReactNode } from 'react';
import styles from './PageShell.module.css';

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
  const { band, bandInner, hero, pageTitle, pageLead, content } = styles;
  return (
    <>
      <title>{documentTitle}</title>
      {tabs && (
        <div className={band}>
          <div className={bandInner}>{tabs}</div>
        </div>
      )}
      <section className={hero} aria-labelledby="page-title">
        <h1 className={pageTitle} id="page-title">{title}</h1>
        {lead && <p className={pageLead}>{lead}</p>}
      </section>
      <div className={content}>{children}</div>
    </>
  );
}
