'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AssistantConversation, ChatMessage } from '@/lib/assistant-chat/types';

type WireMessage = { id: string; sender_type: 'visitor' | 'member' | 'staff' | 'system'; body: string; created_at: string };
type WireConversation = { id: string; status: 'waiting' | 'open' | 'closed'; messages: WireMessage[] };
type CloudChannel = 'human_support' | 'delivery' | 'wholesale' | 'feedback_private';
type PendingMessage = { body: string; clientMessageId: string; identityKey: string };

function mapped(value: WireConversation): AssistantConversation {
  return {
    messages: value.messages.map((message): ChatMessage => ({
      id: message.id,
      sender: message.sender_type === 'staff' ? 'staff' : message.sender_type === 'system' ? 'system' : 'user',
      body: message.body,
      createdAt: message.created_at,
    })),
    unread: 0,
    updatedAt: value.messages.at(-1)?.created_at || new Date().toISOString(),
    draft: '',
    conversationStatus: value.status === 'closed' ? 'closed' : value.status === 'waiting' ? 'waiting' : 'active',
  };
}

export function useCloudSupport(locale: string, channel: CloudChannel = 'human_support', enabled = true, identityKey = 'guest') {
  const [wire, setWire] = useState<{ identityKey: string; conversation: WireConversation } | null>(null);
  const [readyIdentity, setReadyIdentity] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const mounted = useRef(false);
  const sequence = useRef(0);
  const currentIdentity = useRef(identityKey);
  const pending = useRef<PendingMessage | null>(null);
  currentIdentity.current = identityKey;

  const refresh = useCallback(async () => {
    if (!enabled) return;
    const requestId = ++sequence.current;
    try {
      const response = await fetch(`/api/support/conversation?locale=${encodeURIComponent(locale)}&channel=${channel}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'Support unavailable');
      if (mounted.current && requestId === sequence.current && currentIdentity.current === identityKey) {
        setWire(payload.data ? { identityKey, conversation: payload.data } : null);
        setReadyIdentity(identityKey);
        setError('');
      }
    } catch (reason) {
      if (mounted.current && requestId === sequence.current && currentIdentity.current === identityKey) {
        setReadyIdentity(null);
        setError(reason instanceof Error ? reason.message : 'Support unavailable');
      }
    }
  }, [locale, channel, enabled, identityKey]);

  useEffect(() => {
    pending.current = null;
    setSending(false);
    setError('');
    setReadyIdentity(null);
    if (!enabled) {
      mounted.current = false;
      sequence.current++;
      setWire(null);
      return;
    }
    mounted.current = true;
    void refresh();
    const timer = setInterval(() => void refresh(), 3000);
    return () => {
      mounted.current = false;
      sequence.current++;
      clearInterval(timer);
    };
  }, [enabled, refresh]);

  const send = useCallback(async (body: string) => {
    if (!enabled || readyIdentity !== identityKey || !body.trim() || sending) return false;
    const text = body.trim();
    const message = pending.current?.identityKey === identityKey && pending.current.body === text
      ? pending.current
      : { body: text, clientMessageId: crypto.randomUUID(), identityKey };
    pending.current = message;
    setSending(true);
    try {
      let conversationId = wire?.identityKey === identityKey ? wire.conversation.id : null;
      if (!conversationId) {
        const created = await fetch('/api/support/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel, locale }),
        });
        const createdPayload = await created.json();
        if (!created.ok || !createdPayload.data?.id) throw new Error(createdPayload.error?.message || 'Conversation could not be opened.');
        conversationId = createdPayload.data.id;
      }
      if (!conversationId) throw new Error('Conversation could not be opened.');
      const response = await fetch(`/api/support/conversation/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: message.body, clientMessageId: message.clientMessageId, locale, sourceSite: 'chat' }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'Message could not be sent.');
      if (pending.current === message) pending.current = null;
      if (currentIdentity.current === identityKey) await refresh();
      return true;
    } catch (reason) {
      if (mounted.current && currentIdentity.current === identityKey) {
        setError(reason instanceof Error ? reason.message : 'Message could not be sent.');
      }
      return false;
    } finally {
      if (mounted.current && currentIdentity.current === identityKey) setSending(false);
    }
  }, [channel, enabled, identityKey, locale, readyIdentity, refresh, sending, wire]);

  return {
    conversation: enabled && wire?.identityKey === identityKey ? mapped(wire.conversation) : null,
    available: enabled && readyIdentity === identityKey && !error,
    error,
    sending,
    refresh,
    send,
  };
}
