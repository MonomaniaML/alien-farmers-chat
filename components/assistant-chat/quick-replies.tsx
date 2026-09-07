import type { QuickAction } from '@/lib/assistant-chat/types';
import { assistantText } from '@/lib/assistant-chat/copy';
import { useI18n } from '@/lib/support/i18n';
export function QuickReplies({items,onSelect,disabled=false}:{items:QuickAction[];onSelect?:(item:QuickAction)=>void;disabled?:boolean}){const {locale}=useI18n();return <div className="assistant-quick-replies">{items.map(item=><button key={item.label} disabled={disabled} onClick={()=>onSelect?.(item)}>{assistantText(item.label,locale)}</button>)}</div>;}
