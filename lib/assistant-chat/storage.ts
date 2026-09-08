import { createInitialState } from './config';
import type { ConversationCenterState } from './types';
export const CONVERSATION_CENTER_STORAGE_KEY='af-conversation-center:v3';
export function loadConversationCenter():ConversationCenterState{try{const raw=localStorage.getItem(CONVERSATION_CENTER_STORAGE_KEY);if(!raw)return createInitialState();const value=JSON.parse(raw) as ConversationCenterState;if(value?.version!==3||!value.conversations)return createInitialState();const defaults=createInitialState();for(const [id,conversation] of Object.entries(defaults.conversations))if(!value.conversations[id])value.conversations[id]=conversation;return value;}catch{return createInitialState();}}
export function saveConversationCenter(value:ConversationCenterState){try{localStorage.setItem(CONVERSATION_CENTER_STORAGE_KEY,JSON.stringify(value));}catch{/* Keep the in-memory conversation available when browser storage is unavailable. */}}
export function resetConversationCenter(){try{localStorage.removeItem(CONVERSATION_CENTER_STORAGE_KEY);}catch{}return createInitialState();}
