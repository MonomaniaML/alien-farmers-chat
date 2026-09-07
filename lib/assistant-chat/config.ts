import type { ChatAssistant, ConversationCenterState, PreviewRole, QuickAction } from './types';

export const DELIVERY_ACTIONS:QuickAction[]=[
 {label:'Track My Order',value:'Track My Order'},{label:'Delivery Area',value:'Delivery Area'},{label:'Delivery Time',value:'Delivery Time'},{label:'Delivery Fee',value:'Delivery Fee'},{label:'Contact Support',value:'Contact Support',action:'open_support'},
];
export const FEEDBACK_ACTIONS:QuickAction[]=['Feedback','Complaint','Suggestion','Staff Feedback','Store Experience','Product Feedback','Private Message to Management'].map(label=>({label,value:label}));
export const WHOLESALE_ACTIONS:QuickAction[]=['Flower Wholesale','Rolling Papers','Pre-Roll Cones','Accessories','Partnership','Other Inquiry'].map(label=>({label,value:label}));

export const ASSISTANTS:ChatAssistant[]=[
 {id:'af-ai',type:'ai',channel:'assistant',name:'AF AI Assistant',description:'Products, stores and general questions',avatar:'spark',status:'Automated assistant',statusKind:'automated',automated:true},
 {id:'customer-support',type:'support',channel:'human_support',name:'Customer Support',description:'Talk with the ALIEN FARMERS team',avatar:'support',status:'Staff online',statusKind:'online'},
 {id:'delivery',type:'delivery',channel:'delivery',name:'Delivery Assistant',description:'Order status, ETA and delivery help',avatar:'delivery',status:'Mock tracking',statusKind:'automated',automated:true},
 {id:'feedback',type:'feedback',channel:'feedback_private',name:'Feedback Assistant',description:'Feedback shared privately with management',avatar:'feedback',status:'Management only',statusKind:'private',private:true,visibility:['owner','admin']},
 {id:'wholesale',type:'wholesale',channel:'wholesale',name:'Wholesale Assistant',description:'Wholesale and business inquiries',avatar:'wholesale',status:'Inquiry guide',statusKind:'available',automated:true,visibility:['owner','admin']},
];

const at=(minutes:number)=>new Date(Date.UTC(2026,8,7,5,30+minutes)).toISOString();
const message=(id:string,sender:'assistant'|'staff'|'system'|'user',body:string,minutes:number,quickActions?:QuickAction[])=>({id,sender,body,createdAt:at(minutes),...(quickActions?{quickActions}:{})});
export function createDemoState():ConversationCenterState{return {version:1,lastOpened:'af-ai',supportOnline:true,conversations:{
 'af-ai':{unread:0,updatedAt:at(20),draft:'',messages:[message('ai-welcome','assistant','Hi — I’m the AF AI Assistant. Ask me about product verification, store information, opening hours, Lucky Game, products or navigating the website.',20,[{label:'Product Verification',value:'How do I verify a product?'},{label:'Opening Hours',value:'What are your opening hours?'},{label:'Lucky Game',value:'How does Lucky Game work?'},{label:'Talk to Staff',value:'Talk to Staff',action:'open_support'}])]},
 'customer-support':{unread:1,updatedAt:at(15),draft:'',conversationStatus:'active',messages:[message('support-system','system','Customer Support conversation started',14),message('support-welcome','staff','Hello! Send us a message and a member of the team will reply here.',15,[{label:'Order Help',value:'I need help with an order'},{label:'Product Question',value:'I have a product question'},{label:'Store Question',value:'I have a store question'}])]},
 'delivery':{unread:0,updatedAt:at(10),draft:'',messages:[message('delivery-welcome','assistant','Need help with a delivery? I can help you check order status, ETA and delivery information.',10,DELIVERY_ACTIONS)]},
 'feedback':{unread:0,updatedAt:at(5),draft:'',messages:[message('feedback-private','system','Private channel · Visible to management only',4),message('feedback-welcome','assistant','Your feedback helps us improve. Choose a topic or write your message in your own words.',5,FEEDBACK_ACTIONS)]},
 'wholesale':{unread:0,updatedAt:at(0),draft:'',inquiry:{step:'interest',interest:'',quantity:'',location:'',contact:''},messages:[message('wholesale-welcome','assistant','Looking for wholesale or business cooperation? Tell us what you need.',0,WHOLESALE_ACTIONS)]},
}};}
export const assistantById=(id:string)=>ASSISTANTS.find(assistant=>assistant.id===id);
export const isAnonymousAssistantAvailable=(assistant:ChatAssistant)=>assistant.type==='ai'||assistant.type==='support';
export const canRoleAccess=(assistant:ChatAssistant,role:PreviewRole)=>!assistant.visibility||assistant.visibility.includes(role);
