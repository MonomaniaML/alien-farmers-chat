'use client';
import { useState } from 'react';
import { MessageSquareText, Search, UserRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type {
  ChatAssistant,
  ChatMessage,
  ConversationCenterState,
} from '@/lib/assistant-chat/types';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';

type SearchHit = {
  assistant: ChatAssistant;
  message?: ChatMessage;
  kind: 'customer' | 'message';
};
export function InboxSearchDialog({
  open,
  onOpenChange,
  assistants,
  state,
  onSelect,
  theme,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistants: ChatAssistant[];
  state: ConversationCenterState;
  onSelect: (assistant: ChatAssistant, messageId?: string) => void;
  theme: 'light' | 'dark';
}) {
  const { locale } = useI18n(),
    copy = (text: string) => assistantText(text, locale),
    [query, setQuery] = useState('');
  const hits = (() => {
    const value = query.trim().toLocaleLowerCase();
    if (!value) return [] as SearchHit[];
    const result: SearchHit[] = [];
    for (const assistant of assistants) {
      const conversation = state.conversations[assistant.id],
        customerMatch =
          copy('Local Preview Visitor').toLocaleLowerCase().includes(value) ||
          copy(assistant.name).toLocaleLowerCase().includes(value);
      if (customerMatch) result.push({ assistant, kind: 'customer' });
      for (const message of conversation.messages) {
        const body = (
          message.sender === 'user' && !message.localized
            ? message.body
            : copy(message.body)
        ).toLocaleLowerCase();
        if (body.includes(value))
          result.push({ assistant, message, kind: 'message' });
      }
    }
    return result.slice(0, 30);
  })();
  function changeOpen(next: boolean) {
    onOpenChange(next);
    if (!next) setQuery('');
  }
  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className={'assistant-inbox-search theme-' + theme}>
        <DialogHeader>
          <DialogTitle>{copy('Search Inbox')}</DialogTitle>
          <DialogDescription>
            {copy('Search customer names and conversation messages.')}
          </DialogDescription>
        </DialogHeader>
        <label className="assistant-search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy('Type a name or keyword…')}
          />
        </label>
        <div className="assistant-search-results">
          {!query.trim() ? (
            <p>{copy('Start typing to search the local Inbox.')}</p>
          ) : hits.length ? (
            hits.map((hit, index) => (
              <button
                key={`${hit.assistant.id}-${hit.message?.id || 'customer'}-${index}`}
                onClick={() => {
                  onSelect(hit.assistant, hit.message?.id);
                  changeOpen(false);
                }}
              >
                <span className="assistant-search-result-icon">
                  {hit.kind === 'customer' ? (
                    <UserRound size={17} />
                  ) : (
                    <MessageSquareText size={17} />
                  )}
                </span>
                <span>
                  <strong>
                    {hit.kind === 'customer'
                      ? copy('Local Preview Visitor')
                      : hit.message?.sender === 'user'
                        ? copy('Customer')
                        : hit.message?.sender === 'staff'
                          ? copy('Staff')
                          : copy('Automated reply')}
                  </strong>
                  <small>{copy(hit.assistant.name)}</small>
                  <em>
                    {hit.kind === 'customer'
                      ? copy('Open customer conversation')
                      : hit.message?.sender === 'user' && !hit.message.localized
                        ? hit.message.body
                        : copy(hit.message?.body || '')}
                  </em>
                </span>
              </button>
            ))
          ) : (
            <p>{copy('No matching customers or messages.')}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
