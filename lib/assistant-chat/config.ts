import type { ChatAssistant, ConversationCenterState, PreviewRole, QuickAction } from './types';

export const DELIVERY_ACTIONS:QuickAction[]=[
 {label:'Track My Order',value:'Track My Order'},{label:'Delivery Area',value:'Delivery Area'},{label:'Delivery Time',value:'Delivery Time'},{label:'Delivery Fee',value:'Delivery Fee'},{label:'Contact Support',value:'Contact Support',action:'open_support'},
];
export const FEEDBACK_ACTIONS:QuickAction[]=['Feedback','Complaint','Suggestion','Staff Feedback','Store Experience','Product Feedback','Private Message to Management'].map(label=>({label,value:label}));
export const WHOLESALE_ACTIONS:QuickAction[]=['Flower Wholesale','Rolling Papers','Pre-Roll Cones','Accessories','Partnership','Other Inquiry'].map(label=>({label,value:label}));

export const ASSISTANTS:ChatAssistant[]=[
 {id:'af-ai',type:'ai',channel:'assistant',name:'AF AI Assistant',description:'Products, stores and general questions',avatar:'spark',status:'Automated assistant',statusKind:'automated',automated:true},
 {id:'customer-support',type:'support',channel:'human_support',name:'Customer Support',description:'Talk with the ALIEN FARMERS team',avatar:'support',status:'Staff online',statusKind:'online'},
 {id:'delivery',type:'delivery',channel:'delivery',name:'Delivery Assistant',description:'Order status, ETA and delivery help',avatar:'delivery',status:'Automated assistant',statusKind:'automated',automated:true},
 {id:'feedback',type:'feedback',channel:'feedback_private',name:'Feedback Assistant',description:'Feedback shared privately with management',avatar:'feedback',status:'Management only',statusKind:'private',private:true,visibility:['owner','admin']},
 {id:'wholesale',type:'wholesale',channel:'wholesale',name:'Wholesale Assistant',description:'Wholesale and business inquiries',avatar:'wholesale',status:'Inquiry guide',statusKind:'available',automated:true,visibility:['owner','admin']},
];

const emptyConversation=():ConversationCenterState['conversations'][string]=>({unread:0,updatedAt:'',draft:'',messages:[]});
export function createInitialState():ConversationCenterState{return {version:3,lastOpened:'af-ai',supportOnline:false,conversations:{
 'af-ai':emptyConversation(),
 'customer-support':{...emptyConversation(),conversationStatus:'waiting'},
 'delivery':emptyConversation(),
 'feedback':emptyConversation(),
 'wholesale':{...emptyConversation(),inquiry:{step:'interest',interest:'',quantity:'',location:'',contact:''}},
}};}
export const assistantById=(id:string)=>ASSISTANTS.find(assistant=>assistant.id===id);
export const isAnonymousAssistantAvailable=(assistant:ChatAssistant)=>assistant.type==='ai'||assistant.type==='support';
export const canRoleAccess=(assistant:ChatAssistant,role:PreviewRole)=>!assistant.visibility||assistant.visibility.includes(role);
