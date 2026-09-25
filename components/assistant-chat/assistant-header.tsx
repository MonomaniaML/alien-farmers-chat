import { ChevronLeft, LockKeyhole } from 'lucide-react';
import type { AssistantConversation, ChatAssistant } from '@/lib/assistant-chat/types';
import { AssistantAvatar } from './assistant-avatar';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';
export function AssistantHeader({assistant,conversation,supportConnected,unavailable=false,onBack}:{assistant:ChatAssistant;conversation:AssistantConversation;supportConnected:boolean;unavailable?:boolean;onBack:()=>void}){
 const {locale}=useI18n(),copy=(text:string)=>assistantText(text,locale);
 const status=assistant.type==='support'?(supportConnected?(conversation.conversationStatus==='waiting'?'Waiting for staff':'Support connected'):'Support unavailable'):unavailable?'Coming soon':assistant.status;
 const dot=assistant.type==='support'?(supportConnected?'online':''):unavailable?'':assistant.statusKind;
 return <header className="assistant-chat-header"><button className="assistant-back" onClick={onBack} aria-label={copy('Back to conversations')}><ChevronLeft/></button><AssistantAvatar icon={assistant.avatar} statusDot={assistant.type==='support'?supportConnected:!unavailable}/><div><strong>{copy(assistant.name)}</strong><span><i className={'assistant-status-dot '+dot}/>{copy(status)}</span></div>{assistant.private&&!unavailable&&<span className="assistant-private-note"><LockKeyhole size={13}/>{copy('Visible only to Owner and Admin')}</span>}</header>;
}
