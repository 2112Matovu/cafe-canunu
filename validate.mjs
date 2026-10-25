// Checks config.json, menu.json and images, then writes public/sitemap.xml and public/robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {safeUrl,intervals} from './src/lib.js';
const root=path.dirname(fileURLToPath(import.meta.url));
const c=JSON.parse(fs.readFileSync(path.join(root,'config.json'),'utf8')),m=JSON.parse(fs.readFileSync(path.join(root,'menu.json'),'utf8'));
if(new Set(m.items.map(i=>i.id)).size!==m.items.length)throw Error('Menu item IDs must be unique');
for(const item of m.items){if(!Number.isSafeInteger(item.price)||item.price<0)throw Error(`Invalid price for ${item.id}`);if(!m.categories.some(cat=>cat.id===item.category))throw Error(`Unknown category for ${item.id}`);if(!/^[a-z0-9-]+$/.test(item.image))throw Error('Use simple hyphenated image names');if(!item.alt)throw Error(`Missing alt text for ${item.id}`);}
for(let d=0;d<7;d++){const value=c.hours[d];if(value!==null&&(!Array.isArray(value)||intervals(value).length!==value.length))throw Error(`Invalid hours for day ${d}; use null, [], or same-day open/close intervals`);}
const enabled=['index','menu','about','contact','feedback','privacy','terms','order','location'];
if(c.features.gallery)enabled.push('gallery');if(c.features.reservations)enabled.push('reservations');if(['loyalty','giftCards','cateringEnquiry','careers'].some(k=>c.features[k]))enabled.push('extras');
const directory=c.imageMode==='real'?c.realImageDirectory:'images/';
if(!directory.startsWith('images/')||directory.includes('..'))throw Error('Image directory must stay inside images/');
for(const slug of [...m.items.map(i=>i.image),...c.hero.map(i=>i.image),'hero-cafe-table'])for(const ext of ['webp','jpg'])if(!fs.existsSync(path.join(root,'public',directory,slug+'.'+ext)))throw Error(`Missing image: public/${directory}${slug}.${ext}`);
// No fabricated domain is emitted while siteUrl remains unconfigured.
const base=safeUrl(c.siteUrl),withSlash=u=>u.endsWith('/')?u:u+'/';
const urls=base?enabled.filter(p=>!['order','extras'].includes(p)).map(p=>new URL(p==='index'?'':p,withSlash(base)).href):[];
fs.writeFileSync(path.join(root,'public','sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url.replaceAll('&','&amp;')}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(root,'public','robots.txt'),`User-agent: *\n${c.previewMode?'Disallow: /':'Allow: /'}\n${base?'Sitemap: '+new URL('sitemap.xml',withSlash(base)).href+'\n':''}`);
console.log(`Config OK: ${enabled.length} pages enabled. Preview mode: ${c.previewMode}.`);
