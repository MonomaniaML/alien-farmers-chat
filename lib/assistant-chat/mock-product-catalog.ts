export type MockCatalogProduct={id:string;name:string;format:string;aliases:string[];available:boolean};
export type MockProductLookup={requested:string;matches:MockCatalogProduct[];similar:MockCatalogProduct[]};

export const MOCK_PRODUCT_CATALOG:MockCatalogProduct[]=[
 {id:'mac-1-flower',name:'MAC 1',format:'Flower · 3.5 g',aliases:['mac','mac 1','miracle alien cookies'],available:true},
 {id:'mac-pre-roll',name:'MAC',format:'Pre-Roll · 1 g',aliases:['mac pre-roll','mac preroll'],available:true},
 {id:'alien-cookies',name:'Alien Cookies',format:'Flower · 3.5 g',aliases:['alien cookies'],available:true},
 {id:'miracle-mints',name:'Miracle Mints',format:'Flower · 3.5 g',aliases:['miracle mints'],available:true},
 {id:'ice-cream-cake',name:'Ice Cream Cake',format:'Flower · 3.5 g',aliases:['ice cream cake'],available:true},
];

const LOOKUP_CUES=['strain','variety','in stock','available','do you have','品种','有货','有没有','有卖','สายพันธุ์','มีไหม','сорт','в наличии'];
function cleanRequested(value:string){return value.trim().replace(/^(the|a|an)\s+/i,'').replace(/(?:strain|variety|品种|產品|产品|有货|嗎|吗|么|ไหม|сорт).*$/i,'').replace(/[?？.!。]+$/,'').trim();}
function requestedFrom(text:string){
 const normalized=text.toLocaleLowerCase();
 if(/(^|[^a-z0-9])mac(?:\s*1)?([^a-z0-9]|$)/i.test(normalized)||normalized.includes('miracle alien cookies'))return 'MAC';
 const known=MOCK_PRODUCT_CATALOG.find(product=>[product.name,...product.aliases].some(alias=>normalized.includes(alias.toLocaleLowerCase())));
 if(known)return known.name;
 if(!LOOKUP_CUES.some(cue=>normalized.includes(cue)))return null;
 const patterns=[/(?:do you have|is there|looking for)\s+(.+?)(?:\s+(?:strain|variety|in stock|available))?[?!.]*$/i,/(?:有没有|有卖|查询|查一下)\s*(.+?)(?:品种|产品|有货|吗|麼|么)?[？?。]*$/i,/(.+?)(?:品种|สายพันธุ์|сорт)/i];
 for(const pattern of patterns){const value=text.match(pattern)?.[1];if(value){const cleaned=cleanRequested(value);if(cleaned)return cleaned;}}
 return null;
}
export function mockProductLookup(text:string):MockProductLookup|null{
 const requested=requestedFrom(text);if(!requested)return null;
 const query=requested.toLocaleLowerCase(),matches=MOCK_PRODUCT_CATALOG.filter(product=>product.available&&[product.name,...product.aliases].some(alias=>alias.toLocaleLowerCase().includes(query)||query.includes(alias.toLocaleLowerCase())));
 const similar=MOCK_PRODUCT_CATALOG.filter(product=>product.available&&!matches.some(match=>match.id===product.id)).slice(0,3);
 return {requested,matches,similar};
}
