'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/support/i18n';
import { assistantText } from '@/lib/assistant-chat/copy';

const motionSessionKey='alien-farmers-motion-session';
function Planet(){return <span className="motion-planet" aria-hidden="true"><b className="motion-core"/><b className="motion-ring motion-ring-back"/><i className="motion-orbiter"/><b className="motion-ring motion-ring-front"/></span>;}
export function BrandMark({small=false,interactive=true}:{small?:boolean;interactive?:boolean}){
 const {locale}=useI18n(),[enabled,setEnabled]=useState(false),copy=(text:string)=>assistantText(text,locale);
 useEffect(()=>{const stored=sessionStorage.getItem(motionSessionKey),saved=stored===null||stored==='on';queueMicrotask(()=>setEnabled(saved));document.documentElement.dataset.motion=saved?'on':'off';if(stored===null)sessionStorage.setItem(motionSessionKey,'on');},[]);
 function toggle(){const next=!enabled;setEnabled(next);sessionStorage.setItem(motionSessionKey,next?'on':'off');document.documentElement.dataset.motion=next?'on':'off';}
 if(!interactive)return <span className={'af-motion-toggle decorative '+(small?'small':'')}><Planet/></span>;
 return <button className={'af-motion-toggle '+(enabled?'active ':'')+(small?'small':'')} type="button" onClick={toggle} aria-label={copy(enabled?'Turn motion off':'Turn motion on')} aria-pressed={enabled} title={copy(enabled?'Turn motion off':'Turn motion on')}><Planet/></button>;
}
