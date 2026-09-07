'use client';
import { useI18n } from '@/lib/support/i18n';
import { useEffect, useRef, useState } from 'react';
import { CheckCheck, Clock3, RefreshCw } from 'lucide-react';
import { ProductCard, OrderCard, CartCard } from './commerce';
import { interactivePrompt, sharedContext } from '@/lib/support/preview-data';
import { systemText } from '@/lib/support/i18n';
import { Button } from '@/components/ui/button';
import type { Actor, Conversation, OutboxItem, Agent } from '@/lib/support/types';
export function Messages({ conversation, actor, outbox, agents, onRead, onRetry, onOptionSelect }: {
    conversation: Conversation;
    actor: Actor;
    outbox: OutboxItem[];
    agents: Agent[];
    onRead: (sequence: number) => void;
    onRetry: () => void;
    onOptionSelect?: (value:string) => Promise<unknown>;
}) {
    const { t, locale } = useI18n();
    const container = useRef<HTMLDivElement>(null), lastMarked = useRef(0), nearBottom = useRef(true), [newMessages, setNewMessages] = useState(false);
    const items = outbox.filter(item => item.conversationId === conversation.id && !conversation.messages.some(m => m.clientMessageId === item.id));
    useEffect(() => { lastMarked.current = 0; nearBottom.current = true; }, [conversation.id]);
    useEffect(() => {
        const mark = () => { if (!document.hidden && container.current?.getClientRects().length && nearBottom.current && conversation.sequence > lastMarked.current) {
            lastMarked.current = conversation.sequence;
            onRead(conversation.sequence);
        } };
        if (nearBottom.current) {
            container.current?.scrollTo({ top: container.current.scrollHeight });
            mark();
        }
        else
            setNewMessages(true);
        const observer = new ResizeObserver(mark);
        if (container.current)
            observer.observe(container.current);
        document.addEventListener('visibilitychange', mark);
        return () => { observer.disconnect(); document.removeEventListener('visibilitychange', mark); };
    }, [conversation.id, conversation.sequence, items.length, conversation.typing, onRead]);
    function scroll() { const el = container.current; if (!el)
        return; nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100; if (nearBottom.current) {
        setNewMessages(false);
        if (!document.hidden && conversation.sequence > lastMarked.current) {
            lastMarked.current = conversation.sequence;
            onRead(conversation.sequence);
        }
    } }
    return <div className="messages-frame"><div ref={container} onScroll={scroll} className="message-area" role="log" aria-label={t("Conversation messages")} aria-live="polite">
  <div className="conversation-day">{new Date(conversation.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
  {actor === 'visitor' && !conversation.messages.length && <div className="welcome v2-welcome"><span className="welcome-orbit" aria-hidden="true">✳</span><h2>{t('Here with you.')}</h2><p>{t('Ask a question, share a product, or tell us what you need.')}</p></div>}
  {!conversation.messages.length && actor === 'agent' && <div className="waiting-message">{t('This visitor has opened support.')}<br />{t('Their first message will appear here.')}</div>}
  {conversation.messages.map(message => message.senderType === 'system' ? <div className="system-message" key={message.id}>{systemText(message.body, locale)}</div> : <div key={message.id} className={'message ' + (message.senderType === actor ? 'outgoing' : 'incoming')}>
   <div className="message-author">{message.senderType === 'agent' ? (message.agentId === 'preview-automation' ? t('Automatic reply') : agents.find(a => a.id === message.agentId)?.name || t('Support')) : actor === 'visitor' ? t("You") : conversation.customer?.displayName || t("Visitor")}</div>
   <SharedBody body={message.body} onOptionSelect={actor==='visitor'?onOptionSelect:undefined}/>
   <div className="message-meta"><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</time>{message.senderType === actor && <span><CheckCheck size={13}/>{(actor === 'visitor' ? conversation.agentReadSequence : conversation.visitorReadSequence) >= message.sequence ? t("Read") : t("Sent")}</span>}</div>
  </div>)}
  {items.map(item => <div className="message outgoing" key={item.id}><div className="message-bubble pending">{item.body}</div><div className="message-meta">{item.state === 'failed' ? <button onClick={onRetry} title={item.error?t(item.error):undefined}><RefreshCw size={12}/>{t("Not sent \u00B7 Retry")}</button> : <span><Clock3 size={12}/>{item.state === 'sending' ? t("Sending\u2026") : t("Waiting for connection")}</span>}</div></div>)}
  {conversation.typing && <output className="typing-indicator"><span>● ● ●</span>{actor === 'visitor' ? t("Support is typing\u2026") : t("Visitor is typing\u2026")}</output>}
 </div>{newMessages && <Button onClick={() => { nearBottom.current = true; container.current?.scrollTo({ top: container.current.scrollHeight, behavior: 'smooth' }); }} className="new-messages">{t("New messages \u2193")}</Button>}</div>;
}
function SharedBody({ body, onOptionSelect }: {
    body: string;
    onOptionSelect?: (value:string)=>Promise<unknown>;
}) { const shared = sharedContext(body),prompt=interactivePrompt(body); return prompt?<div className="message-bubble interactive-prompt"><p>{prompt.question}</p><div className="prompt-options">{prompt.options.map(option=><Button key={option.value} variant="outline" disabled={!onOptionSelect} onClick={()=>void onOptionSelect?.(option.value)}><span>{option.label}{option.detail&&<small>{option.detail}</small>}</span></Button>)}</div></div>:shared?.kind === 'product' ? <ProductCard id={shared.id} shared/> : shared?.kind === 'order' ? <OrderCard id={shared.id}/> : shared?.kind === 'cart' ? <CartCard /> : <div className="message-bubble">{body}</div>; }
