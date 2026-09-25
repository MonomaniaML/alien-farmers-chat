import type { AssistantConversation, ChatAssistant, QuickAction } from '@/lib/assistant-chat/types';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';
import { AssistantHeader } from './assistant-header';
import { MessageList } from './message-list';
import { MessageComposer } from './message-composer';
export function ChatWindow({assistant,conversation,typing,newMessageId,supportConnected,onBack,onDraft,onSend,onAction,onOpenSupport,cloudPersisted=false,sendDisabled=false,noticeKind=null}:{assistant:ChatAssistant;conversation:AssistantConversation;typing:boolean;newMessageId:string|null;supportConnected:boolean;onBack:()=>void;onDraft:(value:string)=>void;onSend:()=>void;onAction:(item:QuickAction)=>void;onOpenSupport:()=>void;cloudPersisted?:boolean;sendDisabled?:boolean;noticeKind?:'unreleased'|'local'|'delivery'|'wholesale'|null}){
 const {locale}=useI18n(),copy=(text:string)=>assistantText(text,locale),unavailable=noticeKind==='unreleased';
 return <section className="assistant-chat-window">
  <AssistantHeader assistant={assistant} conversation={conversation} supportConnected={supportConnected} unavailable={unavailable} onBack={onBack}/>
  {noticeKind&&<div className="assistant-channel-notice" role="status"><span>{copy(unavailable?'This channel is not live yet. Messages here are not sent to our team.':noticeKind==='delivery'?'Delivery messages go to our team. Order status is not checked automatically.':noticeKind==='wholesale'?'Wholesale messages go to management. Prices are not quoted automatically.':'Quick answers on this device; this is not a live AI or staff conversation.')}{unavailable&&conversation.messages.length>0&&<> {copy('Earlier messages here were saved only on this device.')}</>}</span>{unavailable&&<button type="button" onClick={onOpenSupport}>{copy('Talk to Staff')}</button>}</div>}
  <MessageList messages={conversation.messages} typing={typing} onAction={unavailable?undefined:onAction} newMessageId={newMessageId}/>
  <MessageComposer assistantId={assistant.id} value={conversation.draft} onChange={onDraft} onSend={onSend} privateChannel={assistant.private&&!unavailable} cloudChannel={assistant.type!=='ai'&&!unavailable} cloudPersisted={cloudPersisted} sendDisabled={sendDisabled} disabledReason={unavailable?'Message sending is not available in this channel.':undefined}/>
 </section>;
}
