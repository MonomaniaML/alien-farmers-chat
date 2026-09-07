'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { assistantById, DELIVERY_ACTIONS, FEEDBACK_ACTIONS, WHOLESALE_ACTIONS, createDemoState } from '@/lib/assistant-chat/config';
import { INTENT_REPLIES, mockIntentMatcher } from '@/lib/assistant-chat/mock-intent';
import { mockProductLookup } from '@/lib/assistant-chat/mock-product-catalog';
import { loadConversationCenter, resetConversationCenter, saveConversationCenter } from '@/lib/assistant-chat/storage';
import type { AssistantConversation, ChatMessage, ConversationCenterState, QuickAction, WholesaleInquiry } from '@/lib/assistant-chat/types';

const makeId=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random();
const userMessage=(body:string,localized=false):ChatMessage=>({id:makeId(),sender:'user',body,createdAt:new Date().toISOString(),...(localized?{localized:true}:{})});
const replyMessage=(body:string,quickActions?:QuickAction[],sender:'assistant'|'staff'|'system'='assistant'):ChatMessage=>({id:makeId(),sender,body,createdAt:new Date().toISOString(),...(quickActions?.length?{quickActions}:{})});
const staffMessage=(body:string):ChatMessage=>({id:makeId(),sender:'staff',body,createdAt:new Date().toISOString()});
type Reply={message:ChatMessage;inquiry?:WholesaleInquiry};

function wholesaleReply(input:string,conversation:AssistantConversation):Reply{
 const inquiry=conversation.inquiry||{step:'interest',interest:'',quantity:'',location:'',contact:''};
 if(input==='Submit Inquiry'&&inquiry.step==='review')return {message:replyMessage('Your inquiry is saved in this browser demo. No information has been submitted to ALIEN FARMERS yet.'),inquiry:{...inquiry,step:'submitted'}};
 if(input==='Start Another Inquiry')return {message:replyMessage('What are you interested in?',WHOLESALE_ACTIONS),inquiry:{step:'interest',interest:'',quantity:'',location:'',contact:''}};
 if(inquiry.step==='interest')return {message:replyMessage('Approximately how many units are you looking for?',[{label:'Under 100',value:'Under 100'},{label:'100–500',value:'100–500'},{label:'500+',value:'500+'}]),inquiry:{...inquiry,interest:input,step:'quantity'}};
 if(inquiry.step==='quantity')return {message:replyMessage('Where should the order be supplied? City and country are enough for this demo.'),inquiry:{...inquiry,quantity:input,step:'location'}};
 if(inquiry.step==='location')return {message:replyMessage('How should our wholesale team contact you? Enter an email address, phone number or preferred contact method. This stays on this device.'),inquiry:{...inquiry,location:input,step:'contact'}};
 if(inquiry.step==='contact'){const next={...inquiry,contact:input,step:'review' as const};return {message:replyMessage(`Please review your inquiry:\n\nProduct: ${next.interest}\nQuantity: ${next.quantity}\nLocation: ${next.location}\nContact: ${next.contact}`,[{label:'Submit Inquiry',value:'Submit Inquiry',action:'submit_inquiry'},{label:'Start Over',value:'Start Another Inquiry'}]),inquiry:next};}
 return {message:replyMessage('This demo inquiry is already saved on this device.',[{label:'Start Another Inquiry',value:'Start Another Inquiry'}])};
}
function buildReply(id:string,input:string,conversation:AssistantConversation,supportOnline:boolean):Reply{
 const assistant=assistantById(id);
 if(assistant?.type==='ai'){
  if(input.includes(' · '))return {message:replyMessage('This item is listed as available in the local demo catalog. Would you like to check store availability or ask our staff?',[{label:'Check store availability',value:'Which store has it available?'},{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
  const product=mockProductLookup(input);
  if(product){
   if(product.matches.length){const options=product.matches.map(item=>({label:`${item.name} · ${item.format}`,value:`${item.name} · ${item.format}`}));return {message:replyMessage(`I found available products for “${product.requested}” in the local demo catalog. What would you like to check next?`,[...options,{label:'Effects & profile',value:'Tell me about effects and profile'},{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};}
   return {message:replyMessage(`I couldn’t find “${product.requested}” in the local demo catalog. Here are some similar options:`,[...product.similar.map(item=>({label:item.name,value:`Do you have ${item.name} strain?`})),{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
  }
  if(input==='Tell me about effects and profile')return {message:replyMessage('Product effects can vary by person and batch. In this local preview, you can ask about a specific item or contact staff for current product details.',[{label:'Ask about MAC 1',value:'Do you have MAC 1 strain?'},{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
  const intent=mockIntentMatcher(input);
  if(intent==='unknown')return {message:replyMessage('I’m not sure about this one. I can connect you with our support team.',[{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])};
  const actions:QuickAction[]=[];
  if(['delivery','wholesale','human'].includes(intent))actions.push({label:intent==='delivery'?'Open Delivery Assistant':intent==='wholesale'?'Open Wholesale Assistant':'Talk to Staff',value:intent,action:intent==='human'?'open_support':'message'});
  return {message:replyMessage(INTENT_REPLIES[intent],actions)};
 }
 if(assistant?.type==='support')return {message:supportOnline?replyMessage('Thanks — a staff member has received your message. This reply is simulated for the local preview.',undefined,'staff'):replyMessage('Our staff are offline right now. Your message is saved on this device and marked as waiting.',undefined,'system')};
 if(assistant?.type==='delivery'){
  const normalized=input.toLocaleLowerCase();
  if(normalized.includes('track')||normalized.includes('order'))return {message:replyMessage('I found two mock orders. Choose one to preview its delivery status.',[{label:'AF-PREVIEW-1042',value:'AF-PREVIEW-1042'},{label:'AF-PREVIEW-0987',value:'AF-PREVIEW-0987'}])};
  if(input==='AF-PREVIEW-1042')return {message:replyMessage('AF-PREVIEW-1042 is preparing. Mock ETA: September 9–10. Courier has not been assigned yet.',DELIVERY_ACTIONS)};
  if(input==='AF-PREVIEW-0987')return {message:replyMessage('AF-PREVIEW-0987 was handed to the courier. Mock ETA: today before 18:00.',DELIVERY_ACTIONS)};
  if(normalized.includes('area'))return {message:replyMessage('This demo shows delivery coverage for central Bangkok. Entering a real address is not required.',DELIVERY_ACTIONS)};
  if(normalized.includes('time'))return {message:replyMessage('Mock delivery windows are 10:00–14:00 and 14:00–18:00.',DELIVERY_ACTIONS)};
  if(normalized.includes('fee'))return {message:replyMessage('Mock delivery fee: ฿80, or free for eligible orders over ฿2,000.',DELIVERY_ACTIONS)};
  return {message:replyMessage('Choose a delivery topic and I’ll show the available mock information.',DELIVERY_ACTIONS)};
 }
 if(assistant?.type==='feedback')return {message:replyMessage(FEEDBACK_ACTIONS.some(action=>action.value===input)?'Please describe what happened or what you would like us to know.':'Thank you. Your message is saved privately in this browser demo for management review. Nothing has been submitted to a server.',FEEDBACK_ACTIONS)};
 return wholesaleReply(input,conversation);
}

export function useAssistantCenter(){
 const [state,setState]=useState<ConversationCenterState>(createDemoState),[ready,setReady]=useState(false),[activeId,setActiveId]=useState<string|null>(null),[mobileOpen,setMobileOpen]=useState(false),[typingId,setTypingId]=useState<string|null>(null),[newMessageId,setNewMessageId]=useState<string|null>(null);
 const stateRef=useRef(state),activeIdRef=useRef(activeId),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>{queueMicrotask(()=>{const loaded=loadConversationCenter(),opened=loaded.conversations[loaded.lastOpened];setState(loaded);setActiveId(loaded.lastOpened);if(opened?.unread)setNewMessageId(opened.messages.at(-1)?.id||null);setReady(true);});},[]);
 useEffect(()=>{stateRef.current=state;if(ready)saveConversationCenter(state);},[state,ready]);
 useEffect(()=>{activeIdRef.current=activeId;},[activeId]);
 useEffect(()=>{const sync=()=>{const loaded=loadConversationCenter(),id=activeIdRef.current;if(id&&loaded.conversations[id]?.messages.at(-1)?.id!==stateRef.current.conversations[id]?.messages.at(-1)?.id)setNewMessageId(loaded.conversations[id].messages.at(-1)?.id||null);setState(loaded);};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 const select=useCallback((id:string)=>{const conversation=stateRef.current.conversations[id];setNewMessageId(conversation.unread?conversation.messages.at(-1)?.id||null:null);setActiveId(id);setMobileOpen(true);setState(current=>({...current,lastOpened:id,conversations:{...current.conversations,[id]:{...current.conversations[id],unread:0}}}));},[]);
 const back=useCallback(()=>{setActiveId(null);setMobileOpen(false);},[]);
 const setDraft=useCallback((id:string,draft:string)=>setState(current=>({...current,conversations:{...current.conversations,[id]:{...current.conversations[id],draft}}})),[]);
 const selectForOps=useCallback((id:string)=>{setActiveId(id);setState(current=>({...current,lastOpened:id}));},[]);
 const staffReply=useCallback((id:string,raw:string)=>{const body=raw.trim();if(!body)return;setState(current=>{const conversation=current.conversations[id];return {...current,conversations:{...current.conversations,[id]:{...conversation,updatedAt:new Date().toISOString(),conversationStatus:'active',unread:conversation.unread+1,messages:[...conversation.messages,staffMessage(body)]}}};});},[]);
 const setConversationStatus=useCallback((id:string,status:'active'|'closed')=>setState(current=>({...current,conversations:{...current.conversations,[id]:{...current.conversations[id],conversationStatus:status}}})),[]);
 const send=useCallback((id:string,raw:string,localized=false)=>{const body=raw.trim();if(!body)return;const before=stateRef.current.conversations[id];const now=new Date().toISOString();setNewMessageId(null);setState(current=>({...current,conversations:{...current.conversations,[id]:{...current.conversations[id],draft:'',updatedAt:now,messages:[...current.conversations[id].messages,userMessage(body,localized)],...(id==='customer-support'?{conversationStatus:'waiting' as const}:{})}}}));setTypingId(id);
  const timer=setTimeout(()=>{const result=buildReply(id,body,before,stateRef.current.supportOnline);if(activeIdRef.current===id)setNewMessageId(result.message.id);setState(current=>{const conversation=current.conversations[id];return {...current,conversations:{...current.conversations,[id]:{...conversation,updatedAt:new Date().toISOString(),messages:[...conversation.messages,result.message],unread:activeIdRef.current===id?0:conversation.unread+1,...(result.inquiry?{inquiry:result.inquiry}:{}),...(id==='customer-support'?{conversationStatus:current.supportOnline?'active' as const:'waiting' as const}:{})}}};});setTypingId(current=>current===id?null:current);},650);timers.current.push(timer);
 },[]);
 const action=useCallback((id:string,item:QuickAction)=>{if(item.action==='open_support'){select('customer-support');return;}if(id==='af-ai'&&item.value==='delivery'){select('delivery');return;}if(id==='af-ai'&&item.value==='wholesale'){select('wholesale');return;}send(id,item.value,true);},[select,send]);
 const toggleSupport=useCallback(()=>setState(current=>({...current,supportOnline:!current.supportOnline,conversations:{...current.conversations,'customer-support':{...current.conversations['customer-support'],conversationStatus:current.supportOnline?'waiting':'active'}}})),[]);
 const reset=useCallback(()=>{timers.current.forEach(clearTimeout);timers.current=[];const fresh=resetConversationCenter();setState(fresh);setActiveId(fresh.lastOpened);setMobileOpen(false);setTypingId(null);setNewMessageId(null);},[]);
 return {state,ready,activeId,mobileOpen,typingId,newMessageId,select,selectForOps,back,setDraft,send,staffReply,setConversationStatus,action,toggleSupport,reset};
}
