'use client';
import { useI18n } from '@/lib/support/i18n';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SupportSettings } from '@/lib/support/preview-data';
import { ReplyTools } from './reply-tools';
export function Composer({ draftKey, send, onTyping, agent = false, closed = false, disabled = false, settings }: {
    draftKey: string;
    send: (body: string) => Promise<unknown>;
    onTyping: (typing: boolean) => void;
    agent?: boolean;
    closed?: boolean;
    disabled?: boolean;
    settings?: SupportSettings;
}) {
    const { t } = useI18n();
    const [text, setText] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const textarea=useRef<HTMLTextAreaElement>(null);
    function insertReply(body:string){const start=textarea.current?.selectionStart??text.length,end=textarea.current?.selectionEnd??text.length;const next=text.slice(0,start)+body+text.slice(end);if(next.length>4000){setError(t('Write a message of 1–4,000 characters.'));return;}change(next);requestAnimationFrame(()=>{textarea.current?.focus();textarea.current?.setSelectionRange(start+body.length,start+body.length);});}
    useEffect(() => { let cancelled = false; queueMicrotask(() => { if (!cancelled)
        try {
            setText(localStorage.getItem('af-preview-draft:' + draftKey) || '');
        }
        catch { } }); return () => { cancelled = true; if (idleTimer.current)
        clearTimeout(idleTimer.current); }; }, [draftKey]);
    function change(value: string) { setText(value); try {
        localStorage.setItem('af-preview-draft:' + draftKey, value);
    }
    catch {
        setError(t("Draft storage unavailable. Keep this page open."));
    } onTyping(Boolean(value.trim())); if (idleTimer.current)
        clearTimeout(idleTimer.current); idleTimer.current = setTimeout(() => onTyping(false), 3500); }
    async function submit() {
        if (busy || disabled || !text.trim())
            return;
        setBusy(true);
        setError('');
        try {
            await send(text);
            change('');
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : t("Unable to save this message."));
        }
        finally {
            setBusy(false);
        }
    }
    return <div className="composer-wrap">
  {agent && settings && <ReplyTools settings={settings} insert={insertReply}/>}
  {closed && <div className="closed-notice">{t("This conversation is closed. Sending a message will reopen it.")}</div>}
  {error && <p className="inline-error" role="alert">{t(error)}</p>}
  <div className="composer">
   <label className="sr-only" htmlFor={'composer-' + draftKey}>{agent ? t("Reply to visitor") : t("Your message")}</label>
   <textarea ref={textarea} id={'composer-' + draftKey} placeholder={agent ? t("Write a reply\u2026") : t("Type your message\u2026")} value={text} onChange={event => change(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        void submit();
    } }} maxLength={4000} rows={2} disabled={disabled}/>
   <Button className="send-button" disabled={disabled || busy || !text.trim()} onClick={() => void submit()} aria-label={agent ? t("Send reply") : t("Send message")}><ArrowUp size={22}/></Button>
  </div><div className="composer-hint"><span><LockKeyhole size={12}/>{agent ? t("Reply visible to the visitor") : t("Just you and our support team")}</span><span>{text.length > 3500 ? text.length + ' / 4000' : t("Enter to send \u00B7 Shift + Enter for a new line")}</span></div>
 </div>;
}
