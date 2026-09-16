import {effectsStore} from './platform-effects.js';
const labels={en:['Adult access','Are you 20 or older?','You must be at least 20 years old to enter ALIEN FARMERS.','Yes, enter','Leave','Remember my choice','Motion effects','Dark mode','Light mode','You can switch modes at any time from the side menu.'], 'zh-CN':['仅限成人访问','您是否已年满 20 岁？','进入 ALIEN FARMERS 前，您必须年满 20 岁。','是，进入网站','否，退出','记住我的选择','开启动态效果','暗色模式','明亮模式','进入网站后，可随时在侧边栏菜单中切换明暗模式。'], 'zh-TW':['僅限成人訪問','您是否已年滿 20 歲？','進入 ALIEN FARMERS 前，您必須年滿 20 歲。','是，進入網站','否，退出','記住我的選擇','開啟動態效果','暗色模式','明亮模式','進入網站後，可隨時在側邊欄選單中切換明暗模式。'],th:['สำหรับผู้ใหญ่','คุณมีอายุ 20 ปีขึ้นไปหรือไม่?','คุณต้องมีอายุอย่างน้อย 20 ปีเพื่อเข้าสู่ ALIEN FARMERS','ใช่ เข้าสู่เว็บไซต์','ออก','จดจำตัวเลือกของฉัน','เอฟเฟกต์เคลื่อนไหว','โหมดมืด','โหมดสว่าง','เปลี่ยนโหมดได้ทุกเมื่อจากเมนูด้านข้าง'],ru:['Для взрослых','Вам уже исполнилось 20 лет?','Для входа в ALIEN FARMERS вам должно быть не менее 20 лет.','Да, войти','Выйти','Запомнить мой выбор','Анимация','Тёмная тема','Светлая тема','Тему можно изменить в боковом меню.']};
const names={en:'English',th:'ไทย','zh-CN':'简体中文','zh-TW':'繁體中文',ru:'Русский'};
export function mountAgeGate({onAccept=()=>{},locale,onLocale=()=>{},accent='lime'}={}){
 const host=location.hostname,domain=host==='staging.alienfarmers.org'||host.endsWith('.staging.alienfarmers.org')?'staging.alienfarmers.org':host==='alienfarmers.org'||host.endsWith('.alienfarmers.org')?'alienfarmers.org':'';
 const cookie=(name,value,remember)=>name+'='+value+'; Path=/; SameSite=Lax'+(domain?'; Domain='+domain:'')+(remember?'; Max-Age=31536000':'')+(location.protocol==='https:'?'; Secure':'');
 const key='alien-farmers-age-verified-v1';
 const hasCookie=document.cookie.split(';').some(s=>s.trim()==='af_age_verified=yes');let accepted=hasCookie,persistent=false;
 try{persistent=localStorage.getItem(key)==='yes';accepted ||=persistent||sessionStorage.getItem(key)==='yes';}catch{}
 if(accepted){if(!hasCookie)document.cookie=cookie('af_age_verified','yes',persistent);onAccept();return()=>{};}
 const raw=locale||document.cookie.match(/(?:^|;\s*)af_locale=([^;]+)/)?.[1]||navigator.language||'en';
 locale=raw.startsWith('zh')?(/TW|HK|Hant/i.test(raw)?'zh-TW':'zh-CN'):raw.slice(0,2);if(!labels[locale])locale='en';
 const gate=document.createElement('main');gate.className='age-gate';gate.dataset.accent=accent;gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-labelledby','age-gate-title');
 let remember=false,motion=true;
 const check=(name,text,checked)=>`<div class="age-gate-motion"><label><input data-${name} type="checkbox" ${checked?'checked':''}><i class="age-gate-check" aria-hidden="true"></i><b>${text}</b></label></div>`;
 function draw(){const c=labels[locale],light=document.documentElement.dataset.theme==='light';gate.innerHTML=`<section class="age-gate-panel"><span class="age-gate-planet motion-toggle active" aria-hidden="true"><svg viewBox="0 0 48 40" fill="none" stroke="currentColor"><circle cx="24" cy="20" r="10"/><ellipse cx="24" cy="20" rx="23" ry="8" transform="rotate(-20 24 20)"/></svg></span><p>${c[0]}</p><h1 id="age-gate-title">${c[1]}</h1><div class="age-gate-rule"></div><p class="age-gate-description">${c[2]}</p><div class="age-gate-actions"><button data-enter>${c[3]}</button><button data-leave>${c[4]}</button></div><div class="age-gate-remember">${check('remember',c[5],remember)}</div><div class="age-gate-options"><div class="age-gate-theme"><button data-theme-toggle class="age-gate-theme-choice" title="${c[9]}">${light?'☀':'☾'} <b>${c[light?8:7]}</b></button></div>${check('motion',c[6],motion)}<label class="age-gate-language"><select aria-label="Language">${Object.entries(names).map(([value,name])=>`<option value="${value}" ${value===locale?'selected':''}>${name}</option>`).join('')}</select></label></div></section>`;
 gate.querySelector('[data-remember]').onchange=e=>remember=e.target.checked;
 gate.querySelector('[data-motion]').onchange=e=>{motion=e.target.checked;gate.classList.toggle('motion-disabled',!motion);};
 gate.querySelector('[data-theme-toggle]').onclick=()=>{document.documentElement.dataset.theme=light?'dark':'light';draw();};
 gate.querySelector('select').onchange=e=>{locale=e.target.value;document.cookie=cookie('af_locale',locale,true);onLocale(locale);draw();};
 gate.querySelector('[data-leave]').onclick=()=>location.replace('about:blank');
 gate.querySelector('[data-enter]').onclick=()=>{document.cookie=cookie('af_age_verified','yes',remember);try{if(remember)localStorage.setItem(key,'yes');else{localStorage.removeItem(key);sessionStorage.setItem(key,'yes');}}catch{}effectsStore.start();if(!motion)effectsStore.set('off');else if(!effectsStore.get().enabled)effectsStore.set('auto');destroy();onAccept();};
 }
 const previous=document.activeElement;
 function destroy(){gate.remove();document.documentElement.classList.remove('age-gate-open');window.removeEventListener('alien-farmers-theme-change',draw);previous?.focus?.();}
 draw();document.body.append(gate);document.documentElement.classList.add('age-gate-open');gate.querySelector('[data-enter]').focus();
 gate.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...gate.querySelectorAll('button,input,select')];const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
 window.addEventListener('alien-farmers-theme-change',draw);return destroy;
}
