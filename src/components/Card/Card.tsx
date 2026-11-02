import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  subtitle?: ReactNode;
  /** Controls shown on the right of the header (filters, links). */
  actions?: ReactNode;
  children: ReactNode;
  id?: string;
}

export function Card({ title, subtitle, actions, children, id }: CardProps) {
  const { cardSection, cardHeader, cardTitle, cardSubtitle } = styles;
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section className={cardSection} id={id} aria-labelledby={titleId}>
      <header className={cardHeader}>
        <div>
          <h2 className={cardTitle} id={titleId}>{title}</h2>
          {subtitle && <p className={cardSubtitle}>{subtitle}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}
