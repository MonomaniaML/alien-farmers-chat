'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  CheckCircle2,
  Inbox,
  LockKeyhole,
  MessagesSquare,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  UserRound,
} from 'lucide-react';
import { ASSISTANTS, canRoleAccess } from '@/lib/assistant-chat/config';
import { assistantText } from '@/lib/assistant-chat/copy';
import type {
  ChatAssistant,
  ConversationChannel,
  PreviewRole,
} from '@/lib/assistant-chat/types';
import { useAssistantCenter } from '@/hooks/use-assistant-center';
import { I18nProvider, LanguagePicker, useI18n } from '@/lib/support/i18n';
import { MessageList } from '@/components/assistant-chat/message-list';
import { BrandMark } from '@/components/brand-mark';
import { InboxSearchDialog } from '@/components/assistant-ops/inbox-search-dialog';

type InboxFilter =
  | 'all'
  | 'waiting'
  | 'active'
  | 'closed'
  | 'private'
  | 'starred';
const channelNames = {
  assistant: 'Assistant',
  human_support: 'Human support',
  delivery: 'Delivery',
  feedback_private: 'Private feedback',
  wholesale: 'Wholesale',
};
export function AssistantOperations() {
  return (
    <I18nProvider>
      <OperationsWorkspace />
    </I18nProvider>
  );
}
function OperationsWorkspace() {
  const { locale } = useI18n(),
    copy = (text: string) => assistantText(text, locale),
    isDevelopment = process.env.NODE_ENV !== 'production',
    center = useAssistantCenter(),
    [role, setRole] = useState<PreviewRole>('owner'),
    [filter, setFilter] = useState<InboxFilter>('all'),
    [channel, setChannel] = useState<'all' | ConversationChannel>('all'),
    [mobileOpen, setMobileOpen] = useState(false),
    [drafts, setDrafts] = useState<Record<string, string>>({}),
    [theme, setTheme] = useState<'light' | 'dark'>('light'),
    [listExpanded, setListExpanded] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [focusMessageId, setFocusMessageId] = useState<string | null>(null),
    [starredIds, setStarredIds] = useState<string[]>([]);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem('af-ops-role:v1');
        if (saved === 'owner' || saved === 'admin' || saved === 'staff')
          setRole(saved);
        setTheme(
          localStorage.getItem('af-ops-theme') === 'dark' ? 'dark' : 'light',
        );
        const savedStars = JSON.parse(
          localStorage.getItem('af-ops-starred:v1') || '[]',
        ) as unknown;
        if (Array.isArray(savedStars))
          setStarredIds(
            savedStars.filter((id): id is string => typeof id === 'string'),
          );
      } catch {}
    });
  }, []);
  const allowed = useMemo(
    () => ASSISTANTS.filter((assistant) => canRoleAccess(assistant, role)),
    [role],
  );
  const filtered = allowed.filter((assistant) => {
    const status =
        center.state.conversations[assistant.id].conversationStatus || 'active',
      managementOnly = Boolean(assistant.visibility?.length);
    return (
      (channel === 'all' || assistant.channel === channel) &&
      (filter === 'all' ||
        (filter === 'private' && managementOnly) ||
        (filter === 'starred' && starredIds.includes(assistant.id)) ||
        filter === status)
    );
  });
  const splitIndex = Math.ceil(filtered.length / 2),
    primaryConversations = listExpanded
      ? filtered.slice(0, splitIndex)
      : filtered,
    secondaryConversations = listExpanded ? filtered.slice(splitIndex) : [];
  const selected =
      allowed.find((assistant) => assistant.id === center.activeId) ||
      allowed[0],
    conversation = center.state.conversations[selected.id],
    draft = drafts[selected.id] || '';
  function changeRole(next: PreviewRole) {
    setRole(next);
    setMobileOpen(false);
    const nextAllowed = ASSISTANTS.filter((assistant) =>
      canRoleAccess(assistant, next),
    );
    if (
      channel !== 'all' &&
      !nextAllowed.some((assistant) => assistant.channel === channel)
    )
      setChannel('all');
    if (!canRoleAccess(selected, next)) center.selectForOps('af-ai');
    try {
      localStorage.setItem('af-ops-role:v1', next);
    } catch {}
  }
  function select(assistant: ChatAssistant, messageId?: string) {
    center.selectForOps(assistant.id);
    setFocusMessageId(messageId || null);
    setMobileOpen(true);
  }
  function send() {
    if (!draft.trim()) return;
    center.staffReply(selected.id, draft);
    setDrafts((current) => ({ ...current, [selected.id]: '' }));
  }
  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('af-ops-theme', next);
      } catch {}
      return next;
    });
  }
  function toggleStar(id: string) {
    setStarredIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      try {
        localStorage.setItem('af-ops-starred:v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  function conversationRow(assistant: ChatAssistant) {
    const item = center.state.conversations[assistant.id],
      last = item.messages.at(-1),
      starred = starredIds.includes(assistant.id);
    return (
      <div
        key={assistant.id}
        className={
          'assistant-ops-row ' +
          (selected.id === assistant.id ? 'selected' : '')
        }
      >
        <button
          className="assistant-ops-row-main"
          onClick={() => select(assistant)}
        >
          <span className="assistant-customer-avatar">
            <UserRound size={17} />
            <i className={'channel-mini channel-' + assistant.type} />
          </span>
          <span>
            <strong>{copy('Local Preview Visitor')}</strong>
            <small>
              {copy('via')} {copy(assistant.name)} ·{' '}
              {copy(channelNames[assistant.channel])}
            </small>
            <em>
              {last?.sender === 'user'
                ? copy('Customer') + ': '
                : last?.sender === 'staff'
                  ? copy('Staff') + ': '
                  : copy('Automated reply') + ': '}
              {last?.sender === 'user' && !last.localized
                ? last.body
                : copy(last?.body || '')}
            </em>
          </span>
          {item.conversationStatus === 'waiting' && <i />}
        </button>
        <button
          className={'assistant-row-star ' + (starred ? 'active' : '')}
          onClick={() => toggleStar(assistant.id)}
          aria-label={copy(
            starred ? 'Remove star' : 'Mark conversation with a star',
          )}
          title={copy(
            starred ? 'Remove star' : 'Mark conversation with a star',
          )}
        >
          <Star size={15} fill={starred ? 'currentColor' : 'none'} />
        </button>
      </div>
    );
  }
  if (!center.ready)
    return (
      <main className="assistant-center-loading">
        <BrandMark interactive={false} />
        <p>{copy('Opening conversations…')}</p>
      </main>
    );
  return (
    <main
      className={
        'assistant-ops ops-theme-' +
        theme +
        ' ' +
        (listExpanded ? 'list-expanded ' : '') +
        (mobileOpen ? 'ops-mobile-chat' : 'ops-mobile-list')
      }
    >
      <header className="assistant-ops-topbar">
        <div className="assistant-ops-brand">
          <BrandMark small />
          <Link href="/ops">
            ALIEN FARMERS<small>{copy('Operations')}</small>
          </Link>
        </div>
        <div className="assistant-ops-actions">
          <span className="assistant-ops-test-data">
            {copy(isDevelopment ? 'Local preview' : 'Test data')}
          </span>
          <LanguagePicker />
          <label>
            {copy('Role preview')}
            <select
              value={role}
              onChange={(event) =>
                changeRole(event.target.value as PreviewRole)
              }
            >
              <option value="owner">{copy('Owner')}</option>
              <option value="admin">{copy('Admin')}</option>
              <option value="staff">{copy('Staff')}</option>
            </select>
          </label>
          <button
            className="assistant-ops-theme"
            onClick={toggleTheme}
            aria-label={copy(theme === 'light' ? 'Dark mode' : 'Light mode')}
            title={copy(theme === 'light' ? 'Dark mode' : 'Light mode')}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <Link
            href={isDevelopment ? '/' : 'https://chat.alienfarmers.org'}
            target="_blank"
          >
            {copy('Open customer view')}
          </Link>
          <Link
            className="assistant-settings-link"
            href="/ops/settings"
            aria-label={copy('Settings')}
            title={copy('Settings')}
          >
            <Settings size={18} />
          </Link>
        </div>
      </header>
      <div className="assistant-ops-layout">
        <aside className="assistant-ops-inbox">
          <header>
            <span className="assistant-eyebrow">{copy('Operations')}</span>
            <div className="assistant-inbox-title">
              <h1>{copy('Unified Inbox')}</h1>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label={copy('Search Inbox')}
                title={copy('Search Inbox')}
              >
                <Search size={18} />
              </button>
            </div>
            <p>{copy('Customer conversations by channel')}</p>
          </header>
          <div className="assistant-ops-summary">
            <span>
              <MessagesSquare size={15} />
              <b>{allowed.length}</b>
              {copy('Visible conversations')}
            </span>
            {role === 'staff' && (
              <span className="private-hidden">
                <LockKeyhole size={13} />
                {copy('Management channels hidden')}
              </span>
            )}
          </div>
          <div className="assistant-ops-filter-panel">
            <label className="assistant-channel-filter">
              <span>{copy('Channel')}</span>
              <select
                value={channel}
                onChange={(event) =>
                  setChannel(event.target.value as 'all' | ConversationChannel)
                }
              >
                <option value="all">{copy('All Channels')}</option>
                {allowed.map((assistant) => (
                  <option key={assistant.channel} value={assistant.channel}>
                    {copy(assistant.name)} ·{' '}
                    {copy(channelNames[assistant.channel])}
                  </option>
                ))}
              </select>
            </label>
            <nav
              className="assistant-ops-filters"
              aria-label={copy('Conversation status')}
            >
              {(['waiting', 'active', 'closed', 'private'] as const).map(
                (item) => (
                  <button
                    key={item}
                    className={filter === item ? 'active' : ''}
                    onClick={() =>
                      setFilter((current) =>
                        current === item ? 'all' : item,
                      )
                    }
                  >
                    {copy(
                      item === 'waiting'
                          ? 'Waiting'
                          : item === 'active'
                            ? 'Active'
                            : item === 'closed'
                              ? 'Closed'
                              : 'Management',
                    )}
                  </button>
                ),
              )}
              <button
                className={
                  'assistant-star-filter ' +
                  (filter === 'starred' ? 'active' : '')
                }
                onClick={() =>
                  setFilter((current) =>
                    current === 'starred' ? 'all' : 'starred',
                  )
                }
                aria-label={copy('Starred conversations')}
                title={copy('Starred conversations')}
              >
                <Star
                  size={16}
                  fill={filter === 'starred' ? 'currentColor' : 'none'}
                />
              </button>
              <button
                className="assistant-list-expand"
                onClick={() => setListExpanded((value) => !value)}
                aria-label={copy(
                  listExpanded
                    ? 'Collapse conversation list'
                    : 'Expand conversation list',
                )}
                title={copy(
                  listExpanded
                    ? 'Collapse conversation list'
                    : 'Expand conversation list',
                )}
              >
                {listExpanded ? (
                  <PanelLeftClose size={16} />
                ) : (
                  <PanelLeftOpen size={16} />
                )}
              </button>
            </nav>
          </div>
          <div className="assistant-ops-list">
            {primaryConversations.map(conversationRow)}
            {!filtered.length && (
              <p className="assistant-ops-empty">
                {copy('No conversations match these filters.')}
              </p>
            )}
          </div>
          {listExpanded && (
            <div className="assistant-ops-list assistant-ops-list-secondary">
              {secondaryConversations.map(conversationRow)}
            </div>
          )}
        </aside>
        <section className="assistant-ops-chat">
          <header>
            <button
              className="assistant-ops-back"
              onClick={() => setMobileOpen(false)}
              aria-label={copy('Back to conversations')}
            >
              <ArrowLeft />
            </button>
            <span className="assistant-customer-avatar large">
              <UserRound size={19} />
              <i className={'channel-mini channel-' + selected.type} />
            </span>
            <div>
              <strong>{copy('Local Preview Visitor')}</strong>
              <span>
                {copy('via')} {copy(selected.name)} ·{' '}
                {copy(
                  conversation.conversationStatus === 'closed'
                    ? 'Closed'
                    : conversation.conversationStatus === 'waiting'
                      ? 'Waiting for staff'
                      : 'Active',
                )}
              </span>
            </div>
            <button
              className="assistant-close-action"
              onClick={() =>
                center.setConversationStatus(
                  selected.id,
                  conversation.conversationStatus === 'closed'
                    ? 'active'
                    : 'closed',
                )
              }
            >
              {conversation.conversationStatus === 'closed' ? (
                <Inbox size={14} />
              ) : (
                <CheckCircle2 size={14} />
              )}{' '}
              {copy(
                conversation.conversationStatus === 'closed'
                  ? 'Reopen conversation'
                  : 'Close conversation',
              )}
            </button>
          </header>
          <MessageList
            messages={conversation.messages}
            typing={false}
            perspective="staff"
            focusMessageId={focusMessageId}
          />
          <div className="assistant-ops-composer">
            <textarea
              rows={1}
              value={draft}
              placeholder={copy('Reply to customer…')}
              onChange={(event) =>
                setDrafts((current) => ({
                  ...current,
                  [selected.id]: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
            />
            <button
              disabled={
                !draft.trim() || conversation.conversationStatus === 'closed'
              }
              onClick={send}
              aria-label={copy('Send reply to customer')}
            >
              <ArrowUp size={19} />
            </button>
          </div>
        </section>
        <aside className="assistant-ops-details">
          <div className="ops-detail-heading">
            <span className="assistant-customer-avatar detail">
              <UserRound size={24} />
            </span>
            <h2>{copy('Local Preview Visitor')}</h2>
            <p>{copy('Customer conversation')}</p>
          </div>
          <section>
            <h3>{copy('Conversation details')}</h3>
            <dl>
              <div>
                <dt>{copy('Entered through')}</dt>
                <dd>{copy(selected.name)}</dd>
              </div>
              <div>
                <dt>{copy('Channel')}</dt>
                <dd>{selected.channel}</dd>
              </div>
              <div>
                <dt>{copy('Status')}</dt>
                <dd>
                  {copy(
                    conversation.conversationStatus === 'closed'
                      ? 'Closed'
                      : conversation.conversationStatus === 'waiting'
                        ? 'Waiting'
                        : 'Active',
                  )}
                </dd>
              </div>
              <div>
                <dt>{copy('Access')}</dt>
                <dd>
                  {copy(
                    selected.visibility?.length
                      ? 'Owner and Admin only'
                      : 'All support roles',
                  )}
                </dd>
              </div>
              <div>
                <dt>{copy('Routing')}</dt>
                <dd>
                  {copy(
                    selected.channel === 'human_support'
                      ? 'Human support queue'
                      : 'Automated workflow',
                  )}
                </dd>
              </div>
            </dl>
          </section>
          {selected.visibility?.length && (
            <section className="ops-policy-note">
              <ShieldCheck size={18} />
              <div>
                <strong>{copy('Owner and Admin only')}</strong>
                <p>{copy('Future server policy required')}</p>
              </div>
            </section>
          )}
          <section className="ops-mock-note">
            <Bot size={17} />
            <p>
              {copy(
                'Assistant messages are automation in this customer thread.',
              )}
            </p>
          </section>
        </aside>
      </div>
      <InboxSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        assistants={allowed}
        state={center.state}
        onSelect={select}
        theme={theme}
      />
    </main>
  );
}
