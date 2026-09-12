'use client';

import { useEffect, useRef, useState, type RefObject, type SyntheticEvent } from 'react';
import Image from 'next/image';
import { Bell, CalendarDays, Eye, EyeOff, LoaderCircle, ShoppingBag } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { clearLocaleOverride, type Locale } from '@/lib/support/i18n';
import type { MemberProfile } from '@/lib/member-navigation';
import { platformOrigins } from '@/lib/platform-environment';

export const MEMBER_AUTH_EVENT = 'alienfarmers:member-auth';

export function openMemberAuth(mode: 'login' | 'register' = 'login') {
  window.dispatchEvent(new CustomEvent(MEMBER_AUTH_EVENT, { detail: { mode } }));
}

const copy = {
  en: { login: 'Sign in', register: 'Register', email: 'Email', password: 'Password', confirmPassword: 'Confirm password', passwordMismatch: 'The passwords do not match.', name: 'Display name', birth: 'Date of birth', birthFormat: 'Enter as YYYY - MM - DD', birthInvalid: 'Enter a valid date of birth in YYYY-MM-DD format.', year: 'Year', month: 'Month', day: 'Day', submitLogin: 'Sign in', submitRegister: 'Create account', loading: 'Connecting…', real: 'Use your ALIEN FARMERS member account.', confirm: 'Account created. Check your email to confirm it, then sign in.', profile: 'Open member profile', notifications: 'Messages and notifications', orders: 'Current orders', showPassword: 'Show password', hidePassword: 'Hide password', failed: 'Please check your details and try again.' },
  th: { login: 'เข้าสู่ระบบ', register: 'สมัครสมาชิก', email: 'อีเมล', password: 'รหัสผ่าน', confirmPassword: 'ยืนยันรหัสผ่าน', passwordMismatch: 'รหัสผ่านไม่ตรงกัน', name: 'ชื่อที่แสดง', birth: 'วันเกิด', birthFormat: 'กรอกแบบ ปปปป - ดด - วว', birthInvalid: 'กรุณากรอกวันเกิดที่ถูกต้องในรูปแบบ ปปปป-ดด-วว', year: 'ปี', month: 'เดือน', day: 'วัน', submitLogin: 'เข้าสู่ระบบ', submitRegister: 'สร้างบัญชี', loading: 'กำลังเชื่อมต่อ…', real: 'ใช้บัญชีสมาชิก ALIEN FARMERS ของคุณ', confirm: 'สร้างบัญชีแล้ว โปรดยืนยันทางอีเมล แล้วเข้าสู่ระบบ', profile: 'เปิดโปรไฟล์สมาชิก', notifications: 'ข้อความและการแจ้งเตือน', orders: 'คำสั่งซื้อปัจจุบัน', showPassword: 'แสดงรหัสผ่าน', hidePassword: 'ซ่อนรหัสผ่าน', failed: 'โปรดตรวจสอบข้อมูลแล้วลองอีกครั้ง' },
  'zh-CN': { login: '登录', register: '注册', email: '邮箱', password: '密码', confirmPassword: '确认密码', passwordMismatch: '两次输入的密码不一致。', name: '显示名称', birth: '出生日期', birthFormat: '请按 年年年年 - 月月 - 日日 输入', birthInvalid: '请输入有效的出生日期，格式为 年年年年-月月-日日。', year: '年', month: '月', day: '日', submitLogin: '登录', submitRegister: '创建账户', loading: '正在连接…', real: '使用你的 ALIEN FARMERS 会员账号。', confirm: '账户已创建，请查收确认邮件，然后登录。', profile: '打开会员主页', notifications: '消息与通知', orders: '当前订单', showPassword: '显示密码', hidePassword: '隐藏密码', failed: '请检查填写内容后重试。' },
  'zh-TW': { login: '登入', register: '註冊', email: '電子郵件', password: '密碼', confirmPassword: '確認密碼', passwordMismatch: '兩次輸入的密碼不一致。', name: '顯示名稱', birth: '出生日期', birthFormat: '請按 年年年年 - 月月 - 日日 輸入', birthInvalid: '請輸入有效的出生日期，格式為 年年年年-月月-日日。', year: '年', month: '月', day: '日', submitLogin: '登入', submitRegister: '建立帳戶', loading: '正在連線…', real: '使用你的 ALIEN FARMERS 會員帳戶。', confirm: '帳戶已建立，請查收確認郵件，然後登入。', profile: '開啟會員主頁', notifications: '訊息與通知', orders: '目前訂單', showPassword: '顯示密碼', hidePassword: '隱藏密碼', failed: '請檢查填寫內容後重試。' },
  ru: { login: 'Войти', register: 'Регистрация', email: 'Эл. почта', password: 'Пароль', confirmPassword: 'Повторите пароль', passwordMismatch: 'Пароли не совпадают.', name: 'Отображаемое имя', birth: 'Дата рождения', birthFormat: 'Введите ГГГГ - ММ - ДД', birthInvalid: 'Введите действительную дату в формате ГГГГ-ММ-ДД.', year: 'Год', month: 'Месяц', day: 'День', submitLogin: 'Войти', submitRegister: 'Создать аккаунт', loading: 'Подключение…', real: 'Используйте свою учётную запись ALIEN FARMERS.', confirm: 'Аккаунт создан. Подтвердите email, затем войдите.', profile: 'Открыть профиль', notifications: 'Сообщения и уведомления', orders: 'Текущие заказы', showPassword: 'Показать пароль', hidePassword: 'Скрыть пароль', failed: 'Проверьте данные и повторите попытку.' },
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
type OrdersResponse = { data?: Array<{ status?: string }>; meta?: { totalPages?: number } };
type NotificationsResponse = { meta?: { unreadCount?: number } };
const activeOrderStatuses = new Set(['new', 'confirmed', 'payment_received', 'preparing', 'shipped']);

function PasswordField({ label, name, autoComplete, words }: { label: string; name: string; autoComplete: string; words: Record<string, string> }) {
  const [visible, setVisible] = useState(false);
  return <label>{label}<span className="member-input-with-action"><input name={name} type={visible ? 'text' : 'password'} minLength={10} autoComplete={autoComplete} required /><button type="button" onClick={() => setVisible(current => !current)} aria-label={visible ? words.hidePassword : words.showPassword} title={visible ? words.hidePassword : words.showPassword}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>;
}

function BirthDateField({ words }: { words: Record<string, string> }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const monthInput = useRef<HTMLInputElement>(null);
  const dayInput = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const value = `${year}-${month}-${day}`;
  const update = (next: string, maxLength: number, setter: (value: string) => void, nextInput?: RefObject<HTMLInputElement | null>) => {
    const digits = next.replace(/\D/g, '').slice(0, maxLength);
    setter(digits);
    if (digits.length === maxLength) nextInput?.current?.focus();
  };
  return <label>{words.birth}<small className="member-birth-format">{words.birthFormat}</small><span className="member-birth-segments"><input aria-label={words.year} inputMode="numeric" autoComplete="bday-year" placeholder="YYYY" pattern="\d{4}" maxLength={4} value={year} onChange={event => update(event.target.value, 4, setYear, monthInput)} required /><i aria-hidden="true">-</i><input ref={monthInput} aria-label={words.month} inputMode="numeric" autoComplete="bday-month" placeholder="MM" pattern="0[1-9]|1[0-2]" maxLength={2} value={month} onChange={event => update(event.target.value, 2, setMonth, dayInput)} required /><i aria-hidden="true">-</i><input ref={dayInput} aria-label={words.day} inputMode="numeric" autoComplete="bday-day" placeholder="DD" pattern="0[1-9]|[12]\d|3[01]" maxLength={2} value={day} onChange={event => update(event.target.value, 2, setDay)} required /><button type="button" onClick={() => { const input = picker.current; if (!input) return; if (typeof input.showPicker === 'function') input.showPicker(); else input.click(); }} aria-label={words.birth} title={words.birth}><CalendarDays size={17} /></button><input name="dateOfBirth" type="hidden" value={value} /><input ref={picker} className="member-hidden-date-picker" type="date" tabIndex={-1} aria-hidden="true" value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''} onChange={event => { const [nextYear, nextMonth, nextDay] = event.target.value.split('-'); setYear(nextYear || ''); setMonth(nextMonth || ''); setDay(nextDay || ''); }} /></span></label>;
}

function isValidBirthDate(value: FormDataEntryValue | null) {
  const text = String(value || '');
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return false;
  const date = new Date(`${text}T00:00:00Z`);
  return date.getUTCFullYear() === Number(match[1]) && date.getUTCMonth() + 1 === Number(match[2]) && date.getUTCDate() === Number(match[3]);
}

export function MemberProfileNavigation({
  locale,
  apiBase = '/api/member',
  memberCenterUrl = platformOrigins.member,
  unreadMessageCount = 0,
  unreadNotificationCount,
  orderCount,
  onSessionChange,
  theme = 'dark',
}: {
  locale: Locale;
  apiBase?: string;
  memberCenterUrl?: string;
  unreadMessageCount?: number;
  unreadNotificationCount?: number;
  orderCount?: number;
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
  const [remoteOrderCount, setRemoteOrderCount] = useState(0);
  const [remoteNotificationCount, setRemoteNotificationCount] = useState(0);
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

  useEffect(() => {
    if (!profile || orderCount !== undefined) return;
    let active = true;
    void (async () => {
      let page = 1, totalPages = 1, count = 0;
      do {
        const response = await fetch(`${apiBase}/orders?page=${page}&limit=50`, { credentials: 'include', cache: 'no-store' });
        if (!response.ok) return;
        const payload = (await response.json()) as OrdersResponse;
        count += (payload.data || []).filter(order => activeOrderStatuses.has(order.status || '')).length;
        totalPages = Math.max(1, payload.meta?.totalPages || 1);
        page += 1;
      } while (page <= totalPages && active);
      if (active) setRemoteOrderCount(count);
    })().catch(() => {});
    return () => { active = false; };
  }, [apiBase, orderCount, profile]);

  useEffect(() => {
    if (!profile || unreadNotificationCount !== undefined) return;
    let active = true;
    fetch(`${apiBase}/notifications?limit=1&unreadOnly=true`, { credentials: 'include', cache: 'no-store' })
      .then(async response => response.ok ? (await response.json()) as NotificationsResponse : null)
      .then(payload => { if (active) setRemoteNotificationCount(Math.max(0, payload?.meta?.unreadCount || 0)); })
      .catch(() => {});
    return () => { active = false; };
  }, [apiBase, profile, unreadNotificationCount]);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === 'login') {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    const form = new FormData(event.currentTarget);
    if (mode === 'register' && form.get('password') !== form.get('confirmPassword')) {
      setError(words.passwordMismatch);
      setBusy(false);
      return;
    }
    if (mode === 'register' && !isValidBirthDate(form.get('dateOfBirth'))) {
      setError(words.birthInvalid);
      setBusy(false);
      return;
    }
    const body = { email: form.get('email'), password: form.get('password'), displayName: form.get('displayName'), dateOfBirth: form.get('dateOfBirth'), preferredLocale: 'auto' };
    try {
      const response = await fetch(`${apiBase}/register`, {
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
        clearLocaleOverride();
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
  const unreadCount = Math.max(0, unreadMessageCount) + Math.max(0, unreadNotificationCount ?? remoteNotificationCount);
  const displayedOrderCount = Math.max(0, orderCount ?? remoteOrderCount);
  const memberUrl = memberCenterUrl.replace(/\/$/, '');
  return (
    <div className="member-profile-navigation">
      {!ready ? <span className="member-nav-loading"><LoaderCircle size={18} /></span> : authenticated ? <>
        <a className="member-order-link" href={memberUrl} aria-label={`${words.orders}: ${displayedOrderCount}`} title={words.orders}>
          <ShoppingBag size={19} />
          {displayedOrderCount > 0 && <span className="member-unread-badge">{displayedOrderCount > 99 ? '99+' : displayedOrderCount}</span>}
        </a>
        <a className="member-bell" href={memberUrl} aria-label={`${words.notifications}: ${unreadCount}`} title={words.notifications}>
          <Bell size={19} />
          {unreadCount > 0 && <span className="member-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </a>
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
            {mode === 'register' ? <>
              <label>{words.name}<input name="displayName" autoComplete="name" required /></label>
              <BirthDateField words={words} />
              <label>{words.email}<input name="email" type="email" autoComplete="email" required /></label>
              <PasswordField label={words.password} name="password" autoComplete="new-password" words={words} />
              <PasswordField label={words.confirmPassword} name="confirmPassword" autoComplete="new-password" words={words} />
            </> : null}
            {notice && <p className="member-auth-notice">{notice}</p>}
            {error && <p className="member-auth-error" role="alert">{error}</p>}
            <button className="member-auth-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={17} />{words.loading}</> : mode === 'login' ? words.submitLogin : words.submitRegister}</button>
          </form>
        </PopoverContent>
      </Popover>}
    </div>
  );
}
