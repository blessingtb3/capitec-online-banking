import type { CategoryIcon as IconName } from '../../types/spending';
import { IconBadge } from './CategoryIcon.styles';

/** Simple line icons for the API's category icon names. */
const PATHS: Record<IconName, string> = {
  'shopping-cart': 'M3 4h2l2.4 10.2a1 1 0 001 .8h8.9a1 1 0 001-.8L20 8H6.2M9 20h.01M17 20h.01',
  film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4',
  car: 'M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 19v1M17 19v1M5 11h14',
  utensils: 'M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M17 3c-2 2-2 6 0 8v10',
  'shopping-bag': 'M5 8h14l-1 13H6zM9 8V6a3 3 0 016 0v2',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
};

interface CategoryIconProps {
  icon: IconName;
  /** Category colour from the API, used as a tinted background. */
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 36 }: CategoryIconProps) {
  return (
    <IconBadge $size={size} $color={color} aria-hidden="true">
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={PATHS[icon] ?? PATHS['shopping-bag']} />
      </svg>
    </IconBadge>
  );
}
