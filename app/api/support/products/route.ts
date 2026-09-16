import {databaseOrigin} from '@/lib/support/cloud-session';
export async function GET(request:Request){
 const params=new URL(request.url).searchParams,type=params.get('type')==='extract'?'extracts':'flowers',page=Math.max(1,Math.min(100,Number(params.get('page'))||1));
 const url=new URL(`${databaseOrigin()}/api/${type}`);url.searchParams.set('page',String(page));url.searchParams.set('limit','25');url.searchParams.set('locale',params.get('locale')||'en');if(params.get('q'))url.searchParams.set('q',params.get('q')!.slice(0,80));
 try{const response=await fetch(url,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();const payload=await response.json();return Response.json({data:(payload.data||[]).map((item:{id:string;name:string;englishName:string})=>({id:item.id,name:item.name||item.englishName,type:type==='flowers'?'flower':'extract'})),meta:payload.meta});}
 catch{return Response.json({error:{code:'PRODUCTS_UNAVAILABLE'}},{status:503});}
}
