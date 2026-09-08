export type MockIntent='verification'|'delivery'|'store'|'hours'|'lucky_game'|'wholesale'|'human'|'unknown';
const RULES:Array<[MockIntent,string[]]>=[
 ['verification',['verify','verification','authentic','二维码','验证','真伪']],
 ['delivery',['delivery','shipping','track','courier','eta','发货','配送','快递']],
 ['hours',['opening','hours','open today','closing','营业时间','几点开门']],
 ['store',['store','location','address','shop','门店','地址']],
 ['lucky_game',['lucky game','lucky','抽奖','游戏']],
 ['wholesale',['wholesale','bulk','distribution','retailer','partnership','批发','合作']],
 ['human',['staff','human','person','support','人工','客服']],
];
export function mockIntentMatcher(text:string):MockIntent{const normalized=text.toLocaleLowerCase();return RULES.find(([,keywords])=>keywords.some(keyword=>normalized.includes(keyword)))?.[0]||'unknown';}
export const INTENT_REPLIES:Record<Exclude<MockIntent,'unknown'>,string>={
 verification:'Open Product Verification from the ALIEN FARMERS website and enter or scan the verification code on your product. Never share a code publicly.',
 delivery:'For delivery help, contact Customer Support and include your order number.',
 store:'Store details and directions are available from the Store Information section of the ALIEN FARMERS website.',
 hours:'Opening hours can vary by location. Please check the selected store before visiting.',
 lucky_game:'Lucky Game information is available on the ALIEN FARMERS website.',
 wholesale:'For wholesale and business inquiries, please contact Customer Support.',
 human:'I can connect you with Customer Support.',
};
