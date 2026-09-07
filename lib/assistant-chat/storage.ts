import { createDemoState } from './config';
import type { ConversationCenterState } from './types';
export const CONVERSATION_CENTER_STORAGE_KEY='af-conversation-center:v1';
export function loadConversationCenter():ConversationCenterState{try{const raw=localStorage.getItem(CONVERSATION_CENTER_STORAGE_KEY);if(!raw)return createDemoState();const value=JSON.parse(raw) as ConversationCenterState;if(value?.version!==1||!value.conversations)return createDemoState();const defaults=createDemoState();for(const [id,conversation] of Object.entries(defaults.conversations))if(!value.conversations[id])value.conversations[id]=conversation;return value;}catch{return createDemoState();}}
export function saveConversationCenter(value:ConversationCenterState){try{localStorage.setItem(CONVERSATION_CENTER_STORAGE_KEY,JSON.stringify(value));}catch{/* Keep the in-memory demo usable when browser storage is unavailable. */}}
export function resetConversationCenter(){try{localStorage.removeItem(CONVERSATION_CENTER_STORAGE_KEY);}catch{}return createDemoState();}
