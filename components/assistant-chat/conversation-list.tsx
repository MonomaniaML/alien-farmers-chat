import { LockKeyhole, RotateCcw, Sparkles } from 'lucide-react';
import {
  ASSISTANTS,
  isAnonymousAssistantAvailable,
} from '@/lib/assistant-chat/config';
import type { ConversationCenterState } from '@/lib/assistant-chat/types';
import { AssistantAvatar } from './assistant-avatar';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';
const time = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
const GROUPS = [
  {
    label: 'Help & information',
    ids: ['af-ai', 'customer-support', 'delivery'],
  },
  { label: 'Business & feedback', ids: ['feedback', 'wholesale'] },
];
export function ConversationList({
  state,
  selectedId,
  onSelect,
  onReset,
  anonymous = false,
  onLockedSelect,
}: {
  state: ConversationCenterState;
  selectedId: string;
  onSelect: (id: string) => void;
  onReset: () => void;
  anonymous?: boolean;
  onLockedSelect?: () => void;
}) {
  const { locale } = useI18n(),
    copy = (text: string) => assistantText(text, locale),
    choose = (id: string) => {
      const assistant = ASSISTANTS.find((item) => item.id === id)!;
      if (anonymous && !isAnonymousAssistantAvailable(assistant)) {
        onLockedSelect?.();
        return;
      }
      onSelect(id);
    };
  return (
    <aside className="assistant-conversations">
      <header>
        <div>
          <span className="assistant-eyebrow">ALIEN FARMERS</span>
          <h1>{copy('Conversations')}</h1>
          <p>{copy('Choose the right place to start')}</p>
        </div>
        <span className="assistant-preview-label">
          {copy(process.env.NODE_ENV === 'production' ? 'Test data' : 'Local preview')}
        </span>
      </header>
      <nav
        className="assistant-start-actions"
        aria-label={copy('Choose the right place to start')}
      >
        <button onClick={() => choose('af-ai')}>
          {copy('Ask a question')}
        </button>
        <button
          className={anonymous ? 'locked' : ''}
          onClick={() => choose('delivery')}
          aria-disabled={anonymous}
        >
          {anonymous ? <LockKeyhole size={12} /> : null}
          {copy('Track delivery')}
        </button>
        <button onClick={() => choose('customer-support')}>
          {copy('Talk to staff')}
        </button>
      </nav>
      <div className="assistant-list">
        {GROUPS.map((group) => (
          <section key={group.label}>
            <h2>{copy(group.label)}</h2>
            <ul>
              {group.ids.map((id) => {
                const assistant = ASSISTANTS.find((item) => item.id === id)!,
                  conversation = state.conversations[id],
                  last = conversation.messages.at(-1),
                  locked =
                    anonymous && !isAnonymousAssistantAvailable(assistant);
                return (
                  <li key={id}>
                    <button
                      className={
                        'assistant-row ' +
                        (selectedId === id ? 'selected ' : '') +
                        (conversation.unread ? 'has-unread ' : '') +
                        (locked ? 'locked' : '')
                      }
                      onClick={() => choose(id)}
                      aria-disabled={locked}
                    >
                      <AssistantAvatar icon={assistant.avatar} small />
                      <span className="assistant-row-copy">
                        <span className="assistant-row-top">
                          <strong>{copy(assistant.name)}</strong>
                          <time dateTime={conversation.updatedAt}>
                            {time(conversation.updatedAt)}
                          </time>
                        </span>
                        <span className="assistant-row-description">
                          {copy(assistant.description)}
                        </span>
                        <span
                          className={
                            'assistant-row-preview ' +
                            (locked ? 'locked-copy' : '')
                          }
                        >
                          {locked ? (
                            <>
                              <LockKeyhole size={12} />
                              {copy('Sign in to unlock this conversation')}
                            </>
                          ) : (
                            <>
                              {last?.sender === 'user'
                                ? copy('You') + ': '
                                : ''}
                              {last?.localized
                                ? copy(last.body)
                                : last?.sender === 'user'
                                  ? last.body
                                  : copy(last?.body || '')}
                            </>
                          )}
                        </span>
                        <span className="assistant-row-meta">
                          <span
                            className={
                              'assistant-presence ' +
                              (locked ? 'locked' : assistant.statusKind)
                            }
                          >
                            {locked ? (
                              <LockKeyhole size={11} />
                            ) : assistant.private ? (
                              <LockKeyhole size={11} />
                            ) : assistant.automated ? (
                              <Sparkles size={11} />
                            ) : (
                              <i />
                            )}
                            {locked
                              ? copy('Member access')
                              : assistant.type === 'support'
                                ? copy(
                                    state.supportOnline ? 'Online' : 'Offline',
                                  )
                                : copy(assistant.status)}
                          </span>
                          {!locked && conversation.unread > 0 && (
                            <span className="assistant-unread-label">
                              <b>{conversation.unread}</b>
                              {copy(
                                conversation.unread === 1
                                  ? 'Unread message'
                                  : 'Unread messages',
                              )}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <footer>
          <button onClick={onReset}>
            <RotateCcw size={14} />
            {copy('Reset Demo Data')}
          </button>
          <span>{copy('Stored on this device')}</span>
        </footer>
      )}
    </aside>
  );
}
