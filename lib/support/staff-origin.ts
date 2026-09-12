import 'server-only';
export function staffSupportUrl(){const origin=(process.env.STAFF_APP_ORIGIN||(process.env.NODE_ENV==='production'?'https://staff.alienfarmers.org':'http://localhost:3000')).replace(/\/+$/u,'');return `${origin}/manage/support`;}
