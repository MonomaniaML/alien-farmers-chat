'use client';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { I18nProvider, LanguagePicker, useI18n } from '@/lib/support/i18n';
import { PRODUCTS } from '@/lib/support/preview-data';
import { ProductArt } from './commerce';
export function ProductPreview({id}:{id:string}){return <I18nProvider><Product id={id}/></I18nProvider>;}
function Product({id}:{id:string}){const {t,locale}=useI18n(),product=PRODUCTS.find(p=>p.id===id);if(!product)return null;return <main className="product-page"><header className="v2-topbar"><Link className="v2-brand" href="/"><span className="orbit-mark">AF</span><span>ALIEN FARMERS<small>{t('Product page preview')}</small></span></Link><LanguagePicker/></header><Link className="product-back" href="/"><ArrowLeft size={16}/>{t('Back to support')}</Link><div className="product-stage"><ProductArt id={id} large/><div><span className="micro-label">ALIEN FARMERS / {t('Sample')}</span><h1>{product.name}</h1><p>{product.detail[locale]}</p><strong>฿{product.price.toLocaleString(locale)}</strong><Link className="product-chat-button" href={'/?from=website&product='+id}><MessageCircle size={20}/>{t('Ask about this product')}</Link><small>{t('Preview items only. No purchase is made.')}</small></div></div><Link className="floating-support" href={'/?from=website&product='+id} aria-label={t('Support')}><MessageCircle size={23}/>{t('Support')}</Link></main>;}
