'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { PlatformAccountIcon } from '@/components/platform-shell/PlatformShell';
import type { Locale } from '@/lib/support/i18n';
import type { MemberProfile } from '@/lib/member-navigation';
import { platformOrigins } from '@/lib/platform-environment';

export function openMemberAuth(mode: 'login' | 'register' = 'login') {
  const target = new URL(platformOrigins.member);
  if (mode === 'register') target.searchParams.set('mode', 'register');
  window.location.assign(target.toString());
}

const copy = {
  en: { login: 'Sign in', profile: 'Member center', notifications: 'Notifications', messages: 'Messages', openCenter: 'Open member center', signOut: 'Sign out' },
  th: { login: 'เข้าสู่ระบบ', profile: 'ศูนย์สมาชิก', notifications: 'การแจ้งเตือน', messages: 'ข้อความ', openCenter: 'เปิดศูนย์สมาชิก', signOut: 'ออกจากระบบ' },
  'zh-CN': { login: '登录', profile: '会员中心', notifications: '提醒', messages: '消息', openCenter: '进入会员中心', signOut: '退出登录' },
  'zh-TW': { login: '登入', profile: '會員中心', notifications: '提醒', messages: '訊息', openCenter: '進入會員中心', signOut: '登出' },
  ru: { login: 'Войти', profile: 'Центр участника', notifications: 'Уведомления', messages: 'Сообщения', openCenter: 'Открыть центр', signOut: 'Выйти' },
} satisfies Record<Locale, Record<string, string>>;

function AlienGlyph() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.8C9.4 2.8 5.2 8 5.2 14.2c0 7.1 5.9 13.1 10.8 15 4.9-1.9 10.8-7.9 10.8-15C26.8 8 22.6 2.8 16 2.8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" /><path d="M9.2 13.3c3.2.1 5.1 1.8 5.4 5-3.4.1-5.4-1.5-5.4-5Zm13.6 0c-3.2.1-5.1 1.8-5.4 5 3.4.1 5.4-1.5 5.4-5Z" fill="#132118" /></svg>;
}

type AuthResponse = { data?: { authenticated?: boolean; profile?: MemberProfile } };
type NotificationsResponse = { meta?: { unreadCount?: number } };
type Shortcut = 'messages' | 'notifications' | 'profile';

export function MemberProfileNavigation({ locale, apiBase = '/api/member', memberCenterUrl = platformOrigins.member, unreadMessageCount = 0, unreadNotificationCount, onSessionChange, theme = 'dark' }: {
  locale: Locale;
  apiBase?: string;
  memberCenterUrl?: string;
  unreadMessageCount?: number;
  unreadNotificationCount?: number;
  onSessionChange?: (profile: MemberProfile | null) => void;
  theme?: 'dark' | 'light';
}) {
  const words = copy[locale];
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [quickOpen, setQuickOpen] = useState<Shortcut | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [remoteNotificationCount, setRemoteNotificationCount] = useState(0);
  const onSessionChangeRef = useRef(onSessionChange);

  useEffect(() => { onSessionChangeRef.current = onSessionChange; }, [onSessionChange]);

  useEffect(() => {
    let active = true;
    fetch(`${apiBase}/session`, { credentials: 'include', cache: 'no-store' })
      .then(async response => response.ok ? (await response.json()) as AuthResponse : null)
      .then(payload => {
        if (!active) return;
        const next = payload?.data?.authenticated ? payload.data.profile || null : null;
        setProfile(next);
        onSessionChangeRef.current?.(next);
      })
      .catch(() => {})
      .finally(() => active && setReady(true));
    return () => { active = false; };
  }, [apiBase]);

  useEffect(() => {
    if (!profile || unreadNotificationCount !== undefined) return;
    let active = true;
    fetch(`${apiBase}/notifications?limit=1&unreadOnly=true`, { credentials: 'include', cache: 'no-store' })
      .then(async response => response.ok ? (await response.json()) as NotificationsResponse : null)
      .then(payload => { if (active) setRemoteNotificationCount(Math.max(0, payload?.meta?.unreadCount || 0)); })
      .catch(() => {});
    return () => { active = false; };
  }, [apiBase, profile, unreadNotificationCount]);

  const authenticated = Boolean(profile);
  const avatar = profile?.avatarUrl && !avatarFailed;
  const messageCount = Math.max(0, unreadMessageCount);
  const notificationCount = Math.max(0, unreadNotificationCount ?? remoteNotificationCount);
  const memberUrl = memberCenterUrl.replace(/\/$/, '');
  const buttonClass = (kind: Shortcut) => kind === 'messages' ? 'member-message-link' : kind === 'notifications' ? 'member-bell' : 'member-avatar-link';
  const label = (kind: Shortcut) => kind === 'messages' ? words.messages : kind === 'notifications' ? words.notifications : words.profile;
  const count = (kind: Shortcut) => kind === 'messages' ? messageCount : kind === 'notifications' ? notificationCount : undefined;
  const icon = (kind: Shortcut) => kind === 'profile'
    ? avatar ? <Image src={profile!.avatarUrl!} alt="" width={38} height={38} unoptimized onError={() => setAvatarFailed(true)} /> : <AlienGlyph />
    : <PlatformAccountIcon kind={kind} />;

  const badge = (kind: Shortcut) => {
    const value = count(kind);
    return value !== undefined && value > 0 ? <span className="member-unread-badge">{value > 99 ? '99+' : value}</span> : null;
  };

  const signedOutButton = (kind: Shortcut) => <button key={kind} type="button" className={buttonClass(kind)} aria-label={label(kind)} title={label(kind)} onClick={() => openMemberAuth()}>{icon(kind)}{badge(kind)}</button>;

  const signedInButton = (kind: Shortcut, itemIcon: ReactNode) => <Popover key={kind} open={quickOpen === kind} onOpenChange={next => setQuickOpen(next ? kind : null)}>
    <PopoverTrigger render={<button type="button" className={buttonClass(kind)} aria-label={label(kind)} title={label(kind)} />}>
      {itemIcon}{badge(kind)}
    </PopoverTrigger>
    <PopoverContent className={`member-summary-popover theme-${theme}`} side="bottom" align="end" sideOffset={9}>
      <PopoverHeader><PopoverTitle>{label(kind)}</PopoverTitle><PopoverDescription>{kind === 'profile' ? profile?.displayName || profile?.email : String(count(kind) || 0)}</PopoverDescription></PopoverHeader>
      <a href={memberUrl}>{words.openCenter}<span>→</span></a>
      {kind === 'profile' ? <Link href="/auth/logout">{words.signOut}<span>→</span></Link> : null}
    </PopoverContent>
  </Popover>;

  const shortcuts: Shortcut[] = ['messages', 'notifications', 'profile'];
  return <div className="member-profile-navigation">
    {!ready
      ? <button className="member-nav-loading" type="button" aria-label={words.login} title={words.login} onClick={() => openMemberAuth()}><LoaderCircle size={18} /></button>
      : authenticated ? shortcuts.map(kind => signedInButton(kind, icon(kind))) : shortcuts.map(signedOutButton)}
  </div>;
}
