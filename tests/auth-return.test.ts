import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import {safeReturnTo,ticketSessionSync} from '../lib/identity/return-path.ts';
const require = createRequire(import.meta.url);

function harness(){
  const env={NODE_ENV:'test',CHAT_SESSION_SECRET:'test-only-session-key-'.repeat(3),IDENTITY_ISSUER:'https://identity.test'};
  let calls=0;
  const fetcher=async(url:string)=>{calls++;return Response.json(url.endsWith('/token')?{access_token:'test',token_type:'Bearer'}:{sub:'11111111-1111-4111-8111-111111111111',email:'qa@example.invalid',locale:'en'});};
  const next={NextResponse:{redirect:(url:URL,status:number)=>new Response(null,{status,headers:{location:String(url)}})}};
  let session:any;
  function load(path:string){
    const code=ts.transpileModule(readFileSync(new URL('../'+path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    const module={exports:{}};
    const localRequire=(name:string)=>name==='server-only'?{}:name==='next/server'?next:name==='./return-path'?{safeReturnTo}:name==='@/lib/identity/session'?session:require(name);
    new Function('require','module','exports','process','fetch',code)(localRequire,module,module.exports,{env},fetcher);
    return module.exports as any;
  }
  session=load('lib/identity/session.ts');
  return{session,login:load('app/auth/login/route.ts'),callback:load('app/auth/callback/route.ts'),get calls(){return calls;}};
}
function request(url:string,cookie=''){const value=new Request(url,{headers:{cookie}});return Object.assign(value,{nextUrl:new URL(url)});}
test('ticket SSO attempts once, preserves query/hash and avoids open redirects',()=>{
  const next=ticketSessionSync('https://chat.alienfarmers.org/tickets?tab=history#reply')!;
  const target=new URL(next,'https://chat.alienfarmers.org');
  assert.equal(target.searchParams.get('prompt'),'none');
  assert.equal(target.searchParams.get('returnTo'),'/tickets?tab=history&af_session_sync=1#reply');
  assert.equal(ticketSessionSync('https://chat.alienfarmers.org/tickets?af_session_sync=1'),null);
  for(const unsafe of ['//evil.example','/\\evil.example','https://evil.example','/\n/evil.example'])assert.equal(safeReturnTo(unsafe),'/');
});
test('silent login keeps S256 and exact application callback',async()=>{
  const h=harness(),result=await h.login.GET(request('https://chat.alienfarmers.org/auth/login?prompt=none&returnTo=%2Ftickets%3Faf_session_sync%3D1'));
  const url=new URL(result.headers.get('location')!);
  assert.equal(url.searchParams.get('prompt'),'none');assert.equal(url.searchParams.get('code_challenge_method'),'S256');assert.equal(url.searchParams.get('redirect_uri'),'https://chat.alienfarmers.org/auth/callback');
});
for(const scenario of ['success','login_required','consent_required','invalid_state'])test('callback '+scenario+' validates state and ends the sync loop',async()=>{
  const h=harness(),base=request('https://chat.alienfarmers.org/auth/callback');
  const tx=h.session.createOidcTransaction(base,'/tickets?af_session_sync=1');
  const cookie=h.session.transactionCookie(tx.encoded,base,600).split(';')[0];
  const query=new URLSearchParams({state:scenario==='invalid_state'?'wrong':tx.transaction.state});
  if(scenario==='success'||scenario==='invalid_state')query.set('code','test-code');else query.set('error',scenario);
  const response=await h.callback.GET(request(base.url+'?'+query,cookie));
  const destination=new URL(response.headers.get('location')!);
  assert.equal(response.headers.get('cache-control'),'no-store');
  if(scenario==='success'){
    assert.equal(destination.pathname,'/tickets');assert.equal(h.calls,2);
    const sessionCookie=response.headers.getSetCookie().find((s:string)=>s.startsWith('af_chat_session='))!.split(';')[0];
    assert.ok(h.session.readAppSession(request('https://chat.alienfarmers.org/api/member/session',sessionCookie)));
  }else{
    assert.equal(h.calls,0);
    assert.equal(destination.pathname,scenario==='consent_required'?'/auth/login':scenario==='invalid_state'?'/':'/tickets');
    if(scenario==='login_required')assert.equal(ticketSessionSync(destination.toString()),null);
  }
});
