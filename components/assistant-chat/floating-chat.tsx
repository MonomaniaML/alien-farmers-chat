'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  ChevronDown,
  MessageCircleMore,
  Moon,
  RefreshCw,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from '@/components/brand-mark';
import { useAssistantCenter } from '@/hooks/use-assistant-center';
import { assistantById } from '@/lib/assistant-chat/config';
import { assistantText } from '@/lib/assistant-chat/copy';
import type { QuickAction } from '@/lib/assistant-chat/types';
import { I18nProvider, useI18n } from '@/lib/support/i18n';
import { MessageComposer } from './message-composer';
import { MessageList } from './message-list';

const openStorageKey = 'af-floating-chat-open:v1';
const themeStorageKey = 'af-floating-chat-theme:v1';

export function FloatingChat({
  initialOpen = false,
  availability = 'ready',
  restoreOpenState = true,
  embedded = false,
}: {
  initialOpen?: boolean;
  availability?: 'ready' | 'error';
  restoreOpenState?: boolean;
  embedded?: boolean;
}) {
  return (
    <I18nProvider>
      <FloatingChatSurface
        initialOpen={initialOpen}
        availability={availability}
        restoreOpenState={restoreOpenState}
        embedded={embedded}
      />
    </I18nProvider>
  );
}

function FloatingChatSurface({
  initialOpen,
  availability,
  restoreOpenState,
  embedded,
}: {
  initialOpen: boolean;
  availability: 'ready' | 'error';
  restoreOpenState: boolean;
  embedded: boolean;
}) {
  const { locale } = useI18n();
  const copy = (text: string) => assistantText(text, locale);
  const center = useAssistantCenter();
  const { ready, select } = center;
  const [open, setOpen] = useState(initialOpen);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const assistantId =
    center.activeId === 'customer-support' ? 'customer-support' : 'af-ai';
  const assistant = assistantById(assistantId);
  const conversation = assistant
    ? center.state.conversations[assistant.id]
    : undefined;
  const unread = ['af-ai', 'customer-support'].reduce(
    (total, id) => total + (center.state.conversations[id]?.unread || 0),
    0,
  );

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedOpen = localStorage.getItem(openStorageKey);
        const savedTheme = localStorage.getItem(themeStorageKey);
        // The in-app preview host also wraps pages, so `parent !== window` is
        // not enough to distinguish a real website embed. Explicit embeds use
        // `?embed=1`; ordinary cross-page embeds also carry a referrer.
        const isEmbedded =
          new URLSearchParams(window.location.search).get('embed') === '1' ||
          (window.parent !== window && document.referrer !== '');
        if (!isEmbedded) setOpen(true);
        else if (
          restoreOpenState &&
          (savedOpen === 'open' || savedOpen === 'closed')
        )
          setOpen(savedOpen === 'open');
        setTheme(savedTheme === 'light' ? 'light' : 'dark');
      } catch {}
    });
  }, [restoreOpenState]);

  useEffect(() => {
    if (window.parent !== window)
      window.parent.postMessage(
        { type: 'alien-farmers-chat:state', open },
        '*',
      );
    const receiveCommand = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.data?.type !== 'alien-farmers-chat:command' ||
        !['open', 'close'].includes(event.data.action)
      )
        return;
      const next = event.data.action === 'open';
      setOpen(next);
      try {
        localStorage.setItem(openStorageKey, next ? 'open' : 'closed');
      } catch {}
    };
    window.addEventListener('message', receiveCommand);
    return () => window.removeEventListener('message', receiveCommand);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (ready) select(assistantId);
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      try {
        localStorage.setItem(openStorageKey, 'closed');
      } catch {}
      queueMicrotask(() => triggerRef.current?.focus());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, ready, select, assistantId]);

  function rememberOpen(next: boolean) {
    setOpen(next);
    try {
      localStorage.setItem(openStorageKey, next ? 'open' : 'closed');
    } catch {}
  }

  function closeChat(returnFocus = false) {
    rememberOpen(false);
    if (returnFocus) queueMicrotask(() => triggerRef.current?.focus());
  }

  function toggleTheme() {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(themeStorageKey, next);
      } catch {}
      return next;
    });
  }

  function handleAction(item: QuickAction) {
    if (item.action === 'open_support') {
      center.select('customer-support');
      return;
    }
    center.send(assistantId, item.value, true);
  }

  const hasError =
    availability === 'error' || (center.ready && (!assistant || !conversation));
  const send = () => {
    if (conversation) center.send(assistantId, conversation.draft);
  };

  return (
    <div
      className={
        'af-floating-chat theme-' + theme + (embedded ? ' is-embedded' : '')
      }
    >
      {open && (
        <dialog
          open
          id="af-floating-chat-panel"
          className="af-floating-panel"
          aria-modal="false"
          aria-labelledby="af-floating-chat-title"
        >
          <header className="af-floating-header">
            <div className="af-floating-brand">
              <BrandMark small interactive={false} />
              <span>
                <strong id="af-floating-chat-title">ALIEN FARMERS</strong>
                <small>{copy('Chat with us')}</small>
              </span>
            </div>
            <div className="af-floating-header-actions">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={copy(theme === 'dark' ? 'Light mode' : 'Dark mode')}
                title={copy(theme === 'dark' ? 'Light mode' : 'Dark mode')}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link
                href="/"
                target="_top"
                aria-label={copy('Open full conversation center')}
                title={copy('Open full conversation center')}
              >
                <ArrowUpRight size={16} />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={() => closeChat(true)}
                aria-label={copy('Minimize chat')}
                title={copy('Minimize chat')}
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </header>

          {assistant && (
            <div className="af-floating-assistant">
              <span className="af-floating-assistant-icon">
                <Sparkles size={16} />
              </span>
              <span>
                <strong>{copy(assistant.name)}</strong>
                <small>
                  <i
                    className={
                      'assistant-status-dot ' +
                      (assistant.type === 'support' && center.state.supportOnline
                        ? 'online'
                        : assistant.statusKind)
                    }
                  />
                  {copy(
                    assistant.type === 'support'
                      ? center.state.supportOnline
                        ? 'Staff online'
                        : 'Staff offline'
                      : assistant.status,
                  )}
                </small>
              </span>
            </div>
          )}

          <div className="af-floating-content">
            {!center.ready && !hasError ? (
              <output className="af-floating-state" aria-live="polite">
                <span className="af-floating-spinner" />
                <strong>{copy('Opening chat…')}</strong>
                <p>{copy('Your conversation will appear here in a moment.')}</p>
              </output>
            ) : hasError ? (
              <div className="af-floating-state is-error" role="alert">
                <X size={22} />
                <strong>{copy('Chat is unavailable')}</strong>
                <p>{copy('Please try again or open the full conversation center.')}</p>
                <button type="button" onClick={() => window.location.reload()}>
                  <RefreshCw size={14} />
                  {copy('Try again')}
                </button>
              </div>
            ) : conversation && conversation.messages.length === 0 ? (
              <div className="af-floating-state is-empty">
                <MessageCircleMore size={24} />
                <strong>{copy('How can we help?')}</strong>
                <p>
                  {copy(
                    'Ask about products, stores, delivery, or contact Customer Support.',
                  )}
                </p>
                <div className="af-floating-empty-actions">
                  <button
                    type="button"
                    onClick={() => center.send('af-ai', 'Opening Hours', true)}
                  >
                    {copy('Opening Hours')}
                  </button>
                  <button
                    type="button"
                    onClick={() => center.select('customer-support')}
                  >
                    {copy('Talk to Staff')}
                  </button>
                </div>
              </div>
            ) : conversation ? (
              <MessageList
                messages={conversation.messages}
                typing={center.typingId === assistantId}
                onAction={handleAction}
                newMessageId={center.newMessageId}
              />
            ) : null}
          </div>

          {center.ready && !hasError && conversation && (
            <MessageComposer
              assistantId={'floating-' + assistantId}
              value={conversation.draft}
              onChange={(value) => center.setDraft(assistantId, value)}
              onSend={send}
            />
          )}
        </dialog>
      )}

      {!embedded && <button
        ref={triggerRef}
        type="button"
        className={'af-floating-launcher ' + (open ? 'is-open' : '')}
        onClick={() => (open ? closeChat(false) : rememberOpen(true))}
        aria-controls="af-floating-chat-panel"
        aria-expanded={open}
        aria-label={copy(open ? 'Close chat' : 'Open chat')}
        title={copy(open ? 'Close chat' : 'Open chat')}
      >
        {open ? <X size={23} /> : <MessageCircleMore size={25} />}
        {!open && unread > 0 && (
          <span className="af-floating-unread" aria-label={copy('Unread messages')}>
            {Math.min(unread, 9)}
          </span>
        )}
      </button>}
    </div>
  );
}
