import {chatVisitor,databaseOrigin,integrationHeaders,isSameOrigin,visitorCookie} from '@/lib/support/cloud-session';
export const dynamic='force-dynamic';
async function proxy(request:Request){
 if(!isSameOrigin(request))return Response.json({error:{code:'ORIGIN_NOT_ALLOWED'}},{status:403});
 try{const visitor=chatVisitor(request),response=await fetch(`${databaseOrigin()}/api/integrations/chat/tickets`,{method:request.method,headers:integrationHeaders(request,visitor.id),body:request.method==='POST'?await request.text():undefined,cache:'no-store',signal:AbortSignal.timeout(15000)});
 const headers=new Headers({'Content-Type':'application/json','Cache-Control':'no-store'});if(visitor.cookie)headers.append('Set-Cookie',visitorCookie(visitor.cookie,request));
 return new Response(await response.text(),{status:response.status,headers});
 }catch{return Response.json({error:{code:'TICKETS_UNAVAILABLE'}},{status:503,headers:{'Cache-Control':'no-store'}});}
}
export const GET=proxy;export const POST=proxy;
