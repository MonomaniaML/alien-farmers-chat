import type { Conversation } from './types';
type ToolContext={registerTool:(tool:{name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>void|Promise<void>};
export function registerConversationTools(getConversation:()=>Conversation|undefined,send:(body:string)=>Promise<unknown>){
 const context=(document as Document&{modelContext?:ToolContext}).modelContext;if(!context)return()=>{};
 const lifecycle=new AbortController();
 const tools=[
  {name:'read_support_conversation',description:'Read the currently selected local preview support conversation.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:()=>{const conversation=getConversation();if(!conversation)throw new Error('Choose a conversation.');return {id:conversation.id,status:conversation.status,messages:conversation.messages};}},
  {name:'queue_support_message',description:'Queue a message in the current local support preview. Delivery status appears in the conversation.',inputSchema:{type:'object',properties:{body:{type:'string',minLength:1,maxLength:4000}},required:['body'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:async(input:unknown)=>{if(!input||typeof input!=='object'||!('body'in input)||typeof input.body!=='string'||!input.body.trim()||input.body.length>4000)throw new Error('A message of 1–4000 characters is required.');return {clientMessageId:await send(input.body),status:'queued'};}},
 ];
 for(const tool of tools){try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{/* Optional browser feature. */}}
 return()=>lifecycle.abort();
}
