import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/support/preview-data';
import { ProductPreview } from '@/components/support/product-preview';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!PRODUCTS.some(p=>p.id===id))notFound();return <ProductPreview id={id}/>;}
