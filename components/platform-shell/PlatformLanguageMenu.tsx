"use client";
import {useEffect,useRef,useState} from "react";
import {platformLanguages,type NavigationLocale} from "./platform-language.js";
export function PlatformLanguageMenu({locale,onChange,label="Language",allowedLocales}: {locale: NavigationLocale;onChange:(locale:NavigationLocale)=>void;label?:string;allowedLocales?:NavigationLocale[]}) {
 const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 const options=platformLanguages.filter(o=>!allowedLocales||allowedLocales.includes(o.value));
 const selected=options.find(o=>o.value===locale)||options[0];
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false)};const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus()}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}},[open]);
 return <div className="af-language" ref={root}><button className="af-language__trigger" ref={trigger} type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(!open)}><span>{selected.short}</span><i aria-hidden="true"/></button>{open&&<div className="af-language__menu" role="menu" aria-label={label}>{options.map(o=><button type="button" role="menuitemradio" aria-checked={o.value===locale} className={o.value===locale?'active':''} key={o.value} onClick={()=>{setOpen(false);trigger.current?.focus();onChange(o.value)}}><b>{o.short}</b><span>{o.label}</span></button>)}</div>}</div>;
}
