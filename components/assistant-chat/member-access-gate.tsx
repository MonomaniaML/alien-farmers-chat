'use client';
import { Cloud, LockKeyhole, UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';

export type VisitorAccess='anonymous'|'member';
export function MemberAccessGate({open,onOpenChange,onContinueAnonymous,onAuthenticate,theme}:{open:boolean;onOpenChange:(open:boolean)=>void;onContinueAnonymous:()=>void;onAuthenticate:()=>void;theme:'dark'|'light'}){
 const {locale}=useI18n(),copy=(text:string)=>assistantText(text,locale);
 return <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className={'assistant-access-dialog theme-'+theme} showCloseButton={false}>
   <DialogHeader><span className="assistant-access-icon"><LockKeyhole size={20}/></span><DialogTitle>{copy('Keep your conversations connected')}</DialogTitle><DialogDescription>{copy('Choose how you want to enter the Conversation Center.')}</DialogDescription></DialogHeader>
   <div className="assistant-access-benefits">
    <div><UserRound size={18}/><span><strong>{copy('Member access')}</strong><small>{copy('Connect orders and member details, unlock every assistant and enable secure account conversations.')}</small></span></div>
    <div><Cloud size={18}/><span><strong>{copy('Optional cloud history')}</strong><small>{copy('When the real account service is connected, members can choose to keep chat history for up to 1 year.')}</small></span></div>
   </div>
   <p className="assistant-anonymous-note">{copy('Anonymous mode keeps messages only in this browser. Clearing site data or changing devices can remove them, and only AI Assistant and Customer Support are available.')}</p>
   <div className="assistant-access-actions"><button className="secondary" onClick={onContinueAnonymous}>{copy('Continue anonymously')}</button><button className="primary" onClick={onAuthenticate}>{copy('Log in or register')}</button></div>
   <small className="assistant-access-preview">{copy(process.env.NODE_ENV === 'production'?'Test environment · Real member accounts are connected; conversations and cloud history remain test-only.':'Local preview · Real member accounts are connected; conversations and cloud history remain test-only.')}</small>
  </DialogContent>
 </Dialog>;
}
