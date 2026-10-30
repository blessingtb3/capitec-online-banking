import { Svg } from './Icon.styles';

/** Simple 24×24 line icons drawn for this app. */
const ICONS = {
  'pie-chart': (
    <>
      <path d="M12 3a9 9 0 1 0 9 9h-9z" />
      <path d="M15 3.5A9 9 0 0 1 20.5 9H15z" />
    </>
  ),
  'bar-chart': <path d="M4 20V13M10 20V8M16 20v-5M21 20H3M14 6l3-3 3 3M17 3v8" />,
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  'badge-check': (
    <>
      <path d="M12 2.5l2.4 1.7 2.9-.1 1 2.8 2.3 1.8-.8 2.8.8 2.8-2.3 1.8-1 2.8-2.9-.1L12 21.5l-2.4-1.7-2.9.1-1-2.8-2.3-1.8.8-2.8-.8-2.8 2.3-1.8 1-2.8 2.9.1z" />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.8" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
    </>
  ),
  'stacked-cards': (
    <>
      <rect x="3" y="8" width="15" height="11" rx="2" />
      <path d="M6 5h13a2 2 0 0 1 2 2v9M3 12h15" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
}

/** Decorative: hidden from screen readers, so the text beside it carries the meaning. */
export function Icon({ name, size = 20 }: IconProps) {
  return (
    <Svg
      $size={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-icon={name}
    >
      {ICONS[name]}
    </Svg>
  );
}
