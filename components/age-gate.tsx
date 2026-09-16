'use client';
import {useEffect,useState,type ReactNode} from 'react';
import {mountAgeGate} from './platform-shell/platform-age.js';
export function AgeGate({initiallyVerified=false,bypass=false,children}:{initiallyVerified?:boolean;bypass?:boolean;children:ReactNode}){
 const [verified,setVerified]=useState(initiallyVerified||bypass);
 useEffect(()=>{if(verified||bypass)return;return mountAgeGate({onAccept:()=>setVerified(true)});},[verified,bypass]);
 return verified||bypass?children:<div aria-hidden="true"/>;
}
