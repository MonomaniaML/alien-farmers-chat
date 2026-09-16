'use client';

import { PlatformLanguageMenu } from './platform-shell/PlatformLanguageMenu';
import type { MemberProfile } from '@/lib/member-navigation';
import { platformOrigins } from '@/lib/platform-environment';
import { useI18n } from '@/lib/support/i18n';
import { BrandMark } from '@/components/brand-mark';
import { MemberProfileNavigation } from '@/components/member-profile-navigation';
import { PlatformIcon } from '@/components/platform-icon';
import { PlatformShell } from '@/components/platform-shell/PlatformShell';

function LanguageMenu() {const {locale,setLocale}=useI18n();return <PlatformLanguageMenu locale={locale} onChange={setLocale} label={locale==='zh-CN'?'语言':locale==='zh-TW'?'語言':locale==='th'?'ภาษา':locale==='ru'?'Язык':'Language'}/>;}

function ThemeButton({ theme, toggle }: { theme: 'dark' | 'light'; toggle: () => void }) {
  return <button className="platform-global-theme" type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>{theme === 'dark' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></svg>}</button>;
}

export function PlatformNavigation({ theme, toggleTheme, unreadMessageCount, onSessionChange }: { theme: 'dark' | 'light'; toggleTheme: () => void; unreadMessageCount: number; onSessionChange: (profile: MemberProfile | null) => void }) {
  const { locale } = useI18n();
  return <PlatformShell
    locale={locale}
    activeKey="support"
    className="platform-header"
    origins={platformOrigins}
    renderBrandMark={(placement) => <BrandMark interactive={placement === 'header'} />}
    renderFeatureIcon={(key) => <PlatformIcon type={key} />}
    desktopActions={<div className="platform-global-actions"><ThemeButton theme={theme} toggle={toggleTheme} /><LanguageMenu /><MemberProfileNavigation locale={locale} unreadMessageCount={unreadMessageCount} onSessionChange={onSessionChange} theme={theme} /></div>}
    drawerThemeControl={<ThemeButton theme={theme} toggle={toggleTheme} />}
  />;
}
