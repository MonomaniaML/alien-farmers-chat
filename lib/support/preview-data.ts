export type ContentLanguage='en'|'th'|'zh-CN'|'zh-TW'|'ru';
export type Localized=Record<ContentLanguage,string>;
export type Reply={id:string;title:string;bodies:Localized};
export type KnowledgeResponseType='answer'|'options'|'order_lookup';
export type Article={id:string;title:string;body:string;published:boolean;keywords:string[];autoReply:boolean;responseType:KnowledgeResponseType;options:string[]};
export type SupportSettings={quickReplies:Reply[];articles:Article[];welcome:{enabled:boolean;bodies:Localized};away:{enabled:boolean;bodies:Localized}};
export type VisitorContext={member:boolean;productId:string|null;sourcePage:string;language:ContentLanguage};
export const emptyContext:VisitorContext={member:false,productId:null,sourcePage:'',language:'en'};
export const localized=(en:string,th:string,cn:string,tw:string,ru:string):Localized=>({en,th,'zh-CN':cn,'zh-TW':tw,ru});
export const PRODUCTS=[
 {id:'field-tee',name:'AF / Field Tee',price:890,kind:'Essentials',detail:localized('Heavyweight cotton · Forest black','ผ้าฝ้ายเนื้อหนา · สีดำฟอเรสต์','厚实纯棉 · 森林黑','厚實純棉 · 森林黑','Плотный хлопок · Чёрный'),color:'#29372d',symbol:'AF'},
 {id:'orbit-jar',name:'AF / Orbit Jar',price:420,kind:'Objects',detail:localized('Matte ceramic · 250 ml','เซรามิกเนื้อด้าน · 250 มล.','哑光陶瓷 · 250 毫升','霧面陶瓷 · 250 毫升','Матовая керамика · 250 мл'),color:'#63675b',symbol:'◯'},
];
export const ORDERS=[
 {id:'AF-PREVIEW-1042',total:1310,status:'Preparing',placedAt:'2026-09-05',items:[{productId:'field-tee',quantity:1},{productId:'orbit-jar',quantity:1}]},
 {id:'AF-PREVIEW-0987',total:840,status:'Shipped',placedAt:'2026-08-29',items:[{productId:'orbit-jar',quantity:2}]},
];
export const ORDER=ORDERS[0];
export const CART=[{productId:'orbit-jar',quantity:2}];
export function productUrl(id:string){return 'https://alienfarmers.org/products/'+id;}
export type InteractivePrompt={question:string;options:{label:string;value:string;detail?:string}[]};
const promptPrefix='[af-options:';
export function encodeInteractivePrompt(prompt:InteractivePrompt){return promptPrefix+encodeURIComponent(JSON.stringify(prompt))+']';}
export function interactivePrompt(body:string):InteractivePrompt|null{if(!body.startsWith(promptPrefix)||!body.endsWith(']'))return null;try{const value=JSON.parse(decodeURIComponent(body.slice(promptPrefix.length,-1))) as InteractivePrompt;return value&&typeof value.question==='string'&&Array.isArray(value.options)&&value.options.every(option=>typeof option.label==='string'&&typeof option.value==='string')?value:null;}catch{return null;}}
export function sharedContext(body:string):{kind:'product';id:string}|{kind:'order';id:string}|{kind:'cart'}|null{
 const trimmed=body.trim();const product=PRODUCTS.find(p=>trimmed===productUrl(p.id)||trimmed==='/products/'+p.id);
 if(product)return {kind:'product',id:product.id};
 const order=ORDERS.find(item=>trimmed==='[af-order:'+item.id+']');if(order)return {kind:'order',id:order.id};
 if(trimmed==='[af-cart:preview]')return {kind:'cart'};
 return null;
}
export const DEFAULT_SETTINGS:SupportSettings={
 quickReplies:[
  {id:'welcome',title:'Welcome',bodies:localized('Hi! Thanks for reaching out. How can I help you today?','สวัสดีค่ะ ขอบคุณที่ติดต่อมา วันนี้มีอะไรให้ช่วยดูแลไหมคะ','你好，感谢联系 Alien Farmers，请问有什么可以帮你？','你好，感謝聯絡 Alien Farmers，請問有什麼可以幫你？','Здравствуйте! Спасибо, что написали. Чем можем помочь?')},
  {id:'order',title:'Order check',bodies:localized('Please share your order card here so we can help check its status.','กรุณาแชร์การ์ดคำสั่งซื้อในแชตนี้ เพื่อให้เราช่วยตรวจสอบสถานะค่ะ','请在对话中分享订单卡片，我们会帮你查看进度。','請在對話中分享訂單卡片，我們會幫你查看進度。','Поделитесь карточкой заказа в чате, и мы проверим его статус.')},
 ],
 articles:[
  {id:'shipping',title:'Shipping status / 发货进度',body:'我可以帮你查询发货进度。',published:true,keywords:['什么时候发货','何时发货','发货了吗','发货进度','shipping','ship my order'],autoReply:true,responseType:'order_lookup',options:[]},
  {id:'sharing',title:'Share an order / 分享订单 / แชร์คำสั่งซื้อ',body:'EN: Sign in, open Your details, and choose Ask about this order.\n中文：登录后打开「你的信息」，点击「咨询此订单」。\nไทย: เข้าสู่ระบบ เปิดข้อมูลของคุณ แล้วเลือกสอบถามคำสั่งซื้อนี้',published:true,keywords:['分享订单','share order'],autoReply:false,responseType:'answer',options:[]},
 ],
 welcome:{enabled:false,bodies:localized('Thanks for contacting Alien Farmers. Our team will be with you shortly.','ขอบคุณที่ติดต่อ Alien Farmers ทีมงานจะเข้ามาดูแลคุณในไม่ช้าค่ะ','感谢联系 Alien Farmers，客服团队会尽快为你服务。','感謝聯絡 Alien Farmers，客服團隊會儘快為你服務。','Спасибо, что написали Alien Farmers. Наша команда скоро ответит.')},
 away:{enabled:false,bodies:localized('Our team is currently offline. Your message is saved and we will follow up when we return.','ขณะนี้ทีมงานออฟไลน์ ข้อความของคุณถูกบันทึกแล้ว เราจะติดต่อกลับเมื่อกลับมาค่ะ','客服团队暂时离线，你的消息已保存，我们上线后会为你跟进。','客服團隊暫時離線，你的訊息已儲存，我們上線後會為你跟進。','Наша команда сейчас не в сети. Сообщение сохранено, мы ответим, когда вернёмся.')},
};
