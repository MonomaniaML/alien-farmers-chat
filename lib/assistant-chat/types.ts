export type AssistantType='ai'|'support'|'delivery'|'feedback'|'wholesale';
export type ConversationChannel='assistant'|'human_support'|'delivery'|'feedback_private'|'wholesale';
export type AssistantIcon='spark'|'support'|'delivery'|'feedback'|'wholesale';
export type AssistantStatus='online'|'automated'|'private'|'available';
export type PreviewRole='owner'|'admin'|'staff';
export type MessageSender='user'|'assistant'|'staff'|'system';
export type QuickAction={label:string;value:string;action?:'message'|'open_support'|'submit_inquiry'};
export type ChatMessage={id:string;sender:MessageSender;body:string;createdAt:string;localized?:boolean;quickActions?:QuickAction[]};
export interface ChatAssistant{
 id:string;type:AssistantType;channel:ConversationChannel;name:string;description:string;avatar:AssistantIcon;status:string;statusKind:AssistantStatus;automated?:boolean;private?:boolean;visibility?:PreviewRole[];
}
export type WholesaleInquiry={step:'interest'|'quantity'|'location'|'contact'|'review'|'submitted';interest:string;quantity:string;location:string;contact:string};
export type AssistantConversation={messages:ChatMessage[];unread:number;updatedAt:string;draft:string;conversationStatus?:'active'|'waiting'|'closed';inquiry?:WholesaleInquiry};
export type ConversationCenterState={version:1;lastOpened:string;supportOnline:boolean;conversations:Record<string,AssistantConversation>};
