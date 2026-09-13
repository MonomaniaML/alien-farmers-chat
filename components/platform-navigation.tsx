'use client';

import { useEffect, useRef, useState } from 'react';
import type { MemberProfile } from '@/lib/member-navigation';
import { platformOrigins } from '@/lib/platform-environment';
import { useI18n, type Locale } from '@/lib/support/i18n';
import { BrandMark } from '@/components/brand-mark';
import { MemberProfileNavigation } from '@/components/member-profile-navigation';
import { PlatformIcon } from '@/components/platform-icon';
import { PlatformShell } from '@/components/platform-shell/PlatformShell';

const localeNames: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' }, th: { short: 'TH', name: 'ไทย' },
  'zh-CN': { short: '简', name: '简体中文' }, 'zh-TW': { short: '繁', name: '繁體中文' }, ru: { short: 'RU', name: 'Русский' },
};

function LanguageMenu() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close); window.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); window.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="platform-global-language" ref={root}>
    <button type="button" aria-label="Language" aria-expanded={open} onClick={() => setOpen(current => !current)}><span>{localeNames[locale].short}</span><i /></button>
    {open ? <div role="menu">{(Object.keys(localeNames) as Locale[]).map(key => <button className={key === locale ? 'active' : ''} type="button" role="menuitem" key={key} onClick={() => { setLocale(key); setOpen(false); }}><b>{localeNames[key].short}</b><span>{localeNames[key].name}</span></button>)}</div> : null}
  </div>;
}

function ThemeButton({ theme, toggle }: { theme: 'dark' | 'light'; toggle: () => void }) {
  return <button className="platform-global-theme" type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}><span data-mode={theme} /></button>;
}

export function PlatformNavigation({ theme, toggleTheme, unreadMessageCount, onSessionChange }: { theme: 'dark' | 'light'; toggleTheme: () => void; unreadMessageCount: number; onSessionChange: (profile: MemberProfile | null) => void }) {
  const { locale } = useI18n();
  return <PlatformShell
    locale={locale}
    activeKey="support"
    className="platform-global-header"
    origins={platformOrigins}
    renderBrandMark={(placement) => <BrandMark interactive={placement === 'header'} />}
    renderFeatureIcon={(key) => <PlatformIcon type={key} />}
    desktopActions={<div className="platform-global-actions"><ThemeButton theme={theme} toggle={toggleTheme} /><LanguageMenu /><MemberProfileNavigation locale={locale} unreadMessageCount={unreadMessageCount} onSessionChange={onSessionChange} theme={theme} /></div>}
    drawerThemeControl={<ThemeButton theme={theme} toggle={toggleTheme} />}
  />;
}
