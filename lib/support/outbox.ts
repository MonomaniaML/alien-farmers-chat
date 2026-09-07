import type { OutboxItem } from './types';
const prefix=(owner:string)=>'af-preview-outbox:'+owner+':';
export function readOutbox(owner:string):OutboxItem[]{
 const result:OutboxItem[]=[];
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key?.startsWith(prefix(owner)))continue;
  try{const value:unknown=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object'&&'id'in value&&'body'in value&&'conversationId'in value&&typeof value.id==='string'&&typeof value.body==='string'&&typeof value.conversationId==='string')result.push(value as OutboxItem);}catch{/* An invalid device-local item is not sent. */}
 }
 return result.sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
}
export function saveOutbox(owner:string,item:OutboxItem){localStorage.setItem(prefix(owner)+item.id,JSON.stringify(item));window.dispatchEvent(new Event('af-outbox'));}
export function removeOutbox(owner:string,id:string){localStorage.removeItem(prefix(owner)+id);window.dispatchEvent(new Event('af-outbox'));}
