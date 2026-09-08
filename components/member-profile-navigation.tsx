'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import Image from 'next/image';
import { Bell, LoaderCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Locale } from '@/lib/support/i18n';
import type { MemberProfile } from '@/lib/member-navigation';

export const MEMBER_AUTH_EVENT = 'alienfarmers:member-auth';

export function openMemberAuth(mode: 'login' | 'register' = 'login') {
  window.dispatchEvent(new CustomEvent(MEMBER_AUTH_EVENT, { detail: { mode } }));
}

const copy = {
  en: { login: 'Sign in', register: 'Register', email: 'Email', password: 'Password', name: 'Display name', birth: 'Date of birth', submitLogin: 'Sign in', submitRegister: 'Create account', loading: 'Connecting…', real: 'This uses your real ALIEN FARMERS member account. Chat messages are still test data.', confirm: 'Account created. Check your email to confirm it, then sign in.', profile: 'Open member profile', notifications: 'Notifications', failed: 'Please check your details and try again.' },
  th: { login: 'เข้าสู่ระบบ', register: 'สมัครสมาชิก', email: 'อีเมล', password: 'รหัสผ่าน', name: 'ชื่อที่แสดง', birth: 'วันเกิด', submitLogin: 'เข้าสู่ระบบ', submitRegister: 'สร้างบัญชี', loading: 'กำลังเชื่อมต่อ…', real: 'ระบบนี้ใช้บัญชีสมาชิก ALIEN FARMERS จริง ข้อความแชตยังเป็นข้อมูลทดสอบ', confirm: 'สร้างบัญชีแล้ว โปรดยืนยันทางอีเมล แล้วเข้าสู่ระบบ', profile: 'เปิดโปรไฟล์สมาชิก', notifications: 'การแจ้งเตือน', failed: 'โปรดตรวจสอบข้อมูลแล้วลองอีกครั้ง' },
  'zh-CN': { login: '登录', register: '注册', email: '邮箱', password: '密码', name: '显示名称', birth: '出生日期', submitLogin: '登录', submitRegister: '创建账户', loading: '正在连接…', real: '这里使用真实的 ALIEN FARMERS 会员账号；聊天内容仍为测试数据。', confirm: '账户已创建，请查收确认邮件，然后登录。', profile: '打开会员主页', notifications: '通知', failed: '请检查填写内容后重试。' },
  'zh-TW': { login: '登入', register: '註冊', email: '電子郵件', password: '密碼', name: '顯示名稱', birth: '出生日期', submitLogin: '登入', submitRegister: '建立帳戶', loading: '正在連線…', real: '這裡使用真實的 ALIEN FARMERS 會員帳戶；聊天內容仍為測試資料。', confirm: '帳戶已建立，請查收確認郵件，然後登入。', profile: '開啟會員主頁', notifications: '通知', failed: '請檢查填寫內容後重試。' },
  ru: { login: 'Войти', register: 'Регистрация', email: 'Эл. почта', password: 'Пароль', name: 'Отображаемое имя', birth: 'Дата рождения', submitLogin: 'Войти', submitRegister: 'Создать аккаунт', loading: 'Подключение…', real: 'Используется настоящий аккаунт ALIEN FARMERS. Сообщения чата пока тестовые.', confirm: 'Аккаунт создан. Подтвердите email, затем войдите.', profile: 'Открыть профиль', notifications: 'Уведомления', failed: 'Проверьте данные и повторите попытку.' },
} satisfies Record<Locale, Record<string, string>>;

function AlienGlyph({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2.8C9.4 2.8 5.2 8 5.2 14.2c0 7.1 5.9 13.1 10.8 15 4.9-1.9 10.8-7.9 10.8-15C26.8 8 22.6 2.8 16 2.8Z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
      <path d="M9.2 13.3c3.2.1 5.1 1.8 5.4 5-3.4.1-5.4-1.5-5.4-5Zm13.6 0c-3.2.1-5.1 1.8-5.4 5 3.4.1 5.4-1.5 5.4-5Z" fill={filled ? '#132118' : 'currentColor'} />
    </svg>
  );
}

type AuthResponse = { data?: { authenticated?: boolean; profile?: MemberProfile; requiresEmailConfirmation?: boolean }; error?: { message?: string } };

export function MemberProfileNavigation({
  locale,
  apiBase = '/api/member',
  memberCenterUrl = 'https://member.alienfarmers.org',
  unreadCount = 0,
  onSessionChange,
  theme = 'dark',
}: {
  locale: Locale;
  apiBase?: string;
  memberCenterUrl?: string;
  unreadCount?: number;
  onSessionChange?: (profile: MemberProfile | null) => void;
  theme?: 'dark' | 'light';
}) {
  const words = copy[locale];
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [avatarFailed, setAvatarFailed] = useState(false);
  const onSessionChangeRef = useRef(onSessionChange);

  useEffect(() => {
    onSessionChangeRef.current = onSessionChange;
  }, [onSessionChange]);

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
    const listener = (event: Event) => {
      const next = (event as CustomEvent<{ mode?: 'login' | 'register' }>).detail?.mode;
      setMode(next === 'register' ? 'register' : 'login');
      setError('');
      setNotice('');
      setOpen(true);
    };
    window.addEventListener(MEMBER_AUTH_EVENT, listener);
    return () => window.removeEventListener(MEMBER_AUTH_EVENT, listener);
  }, []);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const form = new FormData(event.currentTarget);
    const body = mode === 'login'
      ? { email: form.get('email'), password: form.get('password') }
      : { email: form.get('email'), password: form.get('password'), displayName: form.get('displayName'), dateOfBirth: form.get('dateOfBirth'), preferredLocale: locale };
    try {
      const response = await fetch(`${apiBase}/${mode}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as AuthResponse;
      if (!response.ok) throw new Error(payload.error?.message || words.failed);
      if (mode === 'register' && payload.data?.requiresEmailConfirmation) {
        setNotice(words.confirm);
        setMode('login');
      } else {
        const next = payload.data?.profile || null;
        setProfile(next);
        onSessionChange?.(next);
        setOpen(false);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : words.failed);
    } finally {
      setBusy(false);
    }
  }

  const authenticated = Boolean(profile);
  const avatar = profile?.avatarUrl && !avatarFailed;
  return (
    <div className="member-profile-navigation">
      {!ready ? <span className="member-nav-loading"><LoaderCircle size={18} /></span> : authenticated ? <>
        <button className="member-bell" aria-label={`${words.notifications}: ${unreadCount}`} title={words.notifications}>
          <Bell size={19} />
          <span className="member-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        </button>
        <a className="member-avatar-link" href={memberCenterUrl} aria-label={words.profile} title={words.profile}>
          {avatar ? <Image src={profile!.avatarUrl!} alt="" width={38} height={38} unoptimized onError={() => setAvatarFailed(true)} /> : <AlienGlyph filled />}
        </a>
      </> : <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<button className="member-alien-login" aria-label={words.login} title={words.login} />}><AlienGlyph filled={false} /></PopoverTrigger>
        <PopoverContent className={`member-auth-popover theme-${theme}`} side="bottom" align="end" sideOffset={9}>
          <PopoverHeader>
            <PopoverTitle>{mode === 'login' ? words.login : words.register}</PopoverTitle>
            <PopoverDescription>{words.real}</PopoverDescription>
          </PopoverHeader>
          <div className="member-auth-tabs" role="tablist">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>{words.login}</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>{words.register}</button>
          </div>
          <form className="member-auth-form" onSubmit={submit}>
            {mode === 'register' && <>
              <label>{words.name}<input name="displayName" autoComplete="name" required /></label>
              <label>{words.birth}<input name="dateOfBirth" type="date" autoComplete="bday" required /></label>
            </>}
            <label>{words.email}<input name="email" type="email" autoComplete="email" required /></label>
            <label>{words.password}<input name="password" type="password" minLength={10} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
            {notice && <p className="member-auth-notice">{notice}</p>}
            {error && <p className="member-auth-error" role="alert">{error}</p>}
            <button className="member-auth-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={17} />{words.loading}</> : mode === 'login' ? words.submitLogin : words.submitRegister}</button>
          </form>
        </PopoverContent>
      </Popover>}
    </div>
  );
}
