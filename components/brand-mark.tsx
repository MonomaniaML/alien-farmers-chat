'use client';
import { useEffects } from './platform-shell/EffectsControl';
import { effectsStore } from './platform-shell/platform-effects.js';
import { useI18n } from '@/lib/support/i18n';
import { assistantText } from '@/lib/assistant-chat/copy';
import { platformPlanetMarkup } from './platform-shell/platform-planet.js';


function Planet(){return <span className="motion-planet" aria-hidden="true" dangerouslySetInnerHTML={{ __html: platformPlanetMarkup }}/>;}
export function BrandMark({small=false,interactive=true}:{small?:boolean;interactive?:boolean}){
 const {locale}=useI18n(),{enabled}=useEffects(),copy=(text:string)=>assistantText(text,locale);

 function toggle(){effectsStore.toggle();}
 if(!interactive)return <span className={`af-motion-toggle decorative ${enabled?'active ':''}${small?'small':''}`}><Planet/></span>;
 return <button className={'af-motion-toggle '+(enabled?'active ':'')+(small?'small':'')} type="button" onClick={toggle} aria-label={copy(enabled?'Turn motion off':'Turn motion on')} aria-pressed={enabled} title={copy(enabled?'Turn motion off':'Turn motion on')}><Planet/></button>;
}
