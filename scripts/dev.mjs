import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
if(process.env.NODE_ENV==='production'||process.env.VERCEL)throw new Error('Local preview only.');
const children=[
 spawn(process.execPath,['server/serve.ts'],{cwd:root,env:{...process.env,SUPPORT_PREVIEW:'1'},stdio:'inherit'}),
 spawn(process.execPath,['node_modules/vinext/dist/cli.js','dev','--host','127.0.0.1','--port','5173'],{cwd:root,stdio:'inherit'}),
];
let stopping=false;
function stop(){if(stopping)return;stopping=true;for(const child of children)child.kill();}
for(const child of children){child.on('error',error=>{console.error(error.message);stop();process.exitCode=1;});child.on('exit',code=>{if(!stopping){if(code)process.exitCode=code;stop();}});}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
console.log('\nVisitor: http://localhost:5173/\nOperations Inbox: http://localhost:5173/ops\nLocal preview only. Keep this terminal running.\n');
