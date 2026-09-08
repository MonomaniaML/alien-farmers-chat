'use client';
import { useRef } from 'react';
import { ArrowUp, LockKeyhole } from 'lucide-react';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';
export function MessageComposer({assistantId,value,onChange,onSend,privateChannel=false}:{assistantId:string;value:string;onChange:(value:string)=>void;onSend:()=>void;privateChannel?:boolean}){
 const {locale}=useI18n(),copy=(text:string)=>assistantText(text,locale),ref=useRef<HTMLTextAreaElement>(null);
 return <div className="assistant-composer-wrap"><div className="assistant-composer"><label className="sr-only" htmlFor={'assistant-composer-'+assistantId}>{copy('Message')}</label><textarea ref={ref} id={'assistant-composer-'+assistantId} rows={1} maxLength={4000} value={value} placeholder={copy('Write a message…')} onChange={event=>onChange(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();onSend();}}}/><button onClick={onSend} disabled={!value.trim()} aria-label={copy('Send message')}><ArrowUp size={20}/></button></div><div className="assistant-composer-note">{privateChannel?<span><LockKeyhole size={12}/>{copy('Private to management in the future inbox')}</span>:<span>{copy('Enter to send · Shift + Enter for a new line')}</span>}<span>{value.length>3500?value.length+' / 4000':copy('Stored on this device')}</span></div></div>;
}
