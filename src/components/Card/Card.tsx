import type { ReactNode } from 'react';
import { CardHeader, CardSection, CardSubtitle, CardTitle } from './Card.styles';

interface CardProps {
  title: string;
  subtitle?: ReactNode;
  /** Controls shown on the right of the header (filters, links). */
  actions?: ReactNode;
  children: ReactNode;
  id?: string;
}

export function Card({ title, subtitle, actions, children, id }: CardProps) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <CardSection id={id} aria-labelledby={titleId}>
      <CardHeader>
        <div>
          <CardTitle id={titleId}>{title}</CardTitle>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </div>
        {actions}
      </CardHeader>
      {children}
    </CardSection>
  );
}
