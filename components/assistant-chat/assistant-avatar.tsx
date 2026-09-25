import { Bot, Headphones, Truck, MessageSquareHeart, Handshake } from 'lucide-react';
import type { AssistantIcon } from '@/lib/assistant-chat/types';
const ICONS={spark:Bot,support:Headphones,delivery:Truck,feedback:MessageSquareHeart,wholesale:Handshake};
export function AssistantAvatar({icon,small=false,statusDot=true}:{icon:AssistantIcon;small?:boolean;statusDot?:boolean}){const Icon=ICONS[icon];return <span className={'assistant-avatar '+(small?'small':'')} aria-hidden="true"><Icon size={small?18:22}/>{statusDot&&<i/>}</span>;}
