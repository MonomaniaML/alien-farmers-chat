'use client';
import { useI18n } from '@/lib/support/i18n';
import { sharedContext } from '@/lib/support/preview-data';
import { Search, MessageSquare, Check } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import type { Agent, Conversation } from '@/lib/support/types';
export function unreadCount(c: Conversation) { return c.messages.filter(m => m.senderType === 'visitor' && m.sequence > c.agentReadSequence).length; }
export function ConversationList({ conversations, selectedId, select, actorId, agents }: {
    conversations: Conversation[];
    selectedId: string | null;
    select: (id: string) => void;
    actorId: string;
    agents: Agent[];
}) {
    const { t, locale } = useI18n();
    const [filter, setFilter] = useState('open'), [search, setSearch] = useState('');
    const visible = conversations.filter(c => filter === 'all' || filter === 'closed' ? filter === 'all' || c.status === 'closed' : c.status === 'open' && (filter === 'open' || filter === 'unread' && unreadCount(c) > 0 || filter === 'mine' && c.assignedAgentId === actorId)).filter(c => !search || [c.customer?.displayName, c.visitorId, ...c.messages.map(m => m.body)].some(value => value?.toLowerCase().includes(search.toLowerCase())));
    return <section className="conversation-list">
  <div className="list-heading"><div><h2>{t("Conversations")}<span>{conversations.filter(c => c.status === 'open').length}</span></h2><p>{t("A direct line to your customers.")}</p></div></div>
  <label className="list-search" htmlFor="conversation-search"><Search size={17}/><Input id="conversation-search" placeholder={t("Search conversations")} aria-label={t("Search conversations")} value={search} onChange={event => setSearch(event.target.value)}/></label>
  <Tabs value={filter} onValueChange={value => setFilter(String(value))}><TabsList className="list-tabs" variant="line"><TabsTrigger value="open">{t("Open")}</TabsTrigger><TabsTrigger value="unread">{t("Unread")}</TabsTrigger><TabsTrigger value="mine">{t("Mine")}</TabsTrigger><TabsTrigger value="closed">{t("Closed")}</TabsTrigger><TabsTrigger value="all">{t("All")}</TabsTrigger></TabsList></Tabs>
  <div className="list-items">{visible.map(c => {
            const last = c.messages.filter(m => m.senderType !== 'system').at(-1), unread = unreadCount(c), name = c.customer?.displayName || t('Visitor') + ' ' + c.visitorId.slice(0, 6), agent = agents.find(a => a.id === c.assignedAgentId);
            return <button key={c.id} className={'conversation-row ' + (c.id === selectedId ? 'selected' : '')} onClick={() => select(c.id)} aria-pressed={c.id === selectedId}>
    <span className="row-avatar">{c.customer?.displayName.slice(0, 1) || <MessageSquare size={17}/>}<i className={'status-dot ' + (!c.online ? 'offline' : '')}/></span>
    <span className="row-content"><span className="row-top"><strong>{name}</strong><time>{new Date(c.lastMessageAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</time></span><span className="row-preview">{last?.senderType === 'agent' ? t('You') + ': ' : ''}{last && sharedContext(last.body) ? t(sharedContext(last.body)?.kind === 'product' ? t("Product shared") : sharedContext(last.body)?.kind === 'order' ? t("Order shared") : t("Cart shared")) : last?.body || t('Opened support · waiting for a message')}</span><span className="row-bottom"><span>{c.status === 'closed' ? <><Check size={12}/>{t("Closed")}</> : agent?.name || t("Unassigned")}{c.sample && ' · ' + t('Sample')}</span>{unread > 0 && <b className="unread-count">{unread}</b>}</span></span>
   </button>;
        })}{!visible.length && <div className="list-empty"><MessageSquare size={25}/><strong>{filter === 'unread' ? t("You\u2019re all caught up") : t("No conversations here")}</strong><p>{search ? t("Try another search.") : t("New visitor messages will appear here.")}</p></div>}</div>
  <div className="list-footer"><span className="status-dot"/>{t("LOCAL PREVIEW")}<span>{t("Sample data included")}</span></div>
 </section>;
}
