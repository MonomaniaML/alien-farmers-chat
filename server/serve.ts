import { resolve } from 'node:path';
import { createPreviewServer } from './http.ts';
if(process.env.SUPPORT_PREVIEW!=='1'||process.env.NODE_ENV==='production'||process.env.VERCEL)throw new Error('The isolated preview service must never run in production.');
const app=createPreviewServer(resolve('.preview-data/support.sqlite'));
app.server.listen(4318,'127.0.0.1',()=>console.log('Local support data service: http://127.0.0.1:4318'));
for(const signal of ['SIGINT','SIGTERM'] as const)process.on(signal,()=>{void app.close().then(()=>process.exit(0));});
