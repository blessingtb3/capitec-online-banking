import type { KeyboardEvent, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './Tabs.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  /** Optional icon shown before the label (decorative). */
  icon?: IconName;
}

interface TabsProps<T extends string> {
  tabs: readonly TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  label: string;
  /** Prefix for tab/panel ids so each panel can point at its tab. */
  idPrefix: string;
}

/** Accessible tabs: arrow keys, Home and End move between tabs (WAI-ARIA tabs pattern). */
export function Tabs<T extends string>({ tabs, activeId, onChange, label, idPrefix }: TabsProps<T>) {
  const { tabList, tabButton, tabButtonActive } = styles;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === activeId);
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const next = tabs[targets[event.key]];
    onChange(next.id);
    document.getElementById(`${idPrefix}-tab-${next.id}`)?.focus();
  };

  return (
    <div className={tabList} role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            className={`${tabButton} ${active ? tabButtonActive : ''}`}
            key={tab.id}
            id={`${idPrefix}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <Icon name={tab.icon} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  idPrefix: string;
  id: string;
  activeId: string;
  children: ReactNode;
}

/**
 * Inactive panels stay mounted but hidden, so form input, results and
 * fetched data survive switching tabs.
 */
export function TabPanel({ idPrefix, id, activeId, children }: TabPanelProps) {
  const { panel } = styles;
  return (
    <div
      className={panel}
      id={`${idPrefix}-panel-${id}`}
      role="tabpanel"
      aria-labelledby={`${idPrefix}-tab-${id}`}
      hidden={id !== activeId}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
