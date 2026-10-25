import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import {buildSchema,pageTitle,pageUrl,imageBase} from './src/seo.js';
import {safeUrl} from './src/lib.js';
const c=JSON.parse(fs.readFileSync(new URL('./config.json',import.meta.url),'utf8'));
// Page-level metadata that does not depend on the route is written into index.html at build time,
// so crawlers and link previews get it without running JavaScript.
const siteMeta=()=>({
  name:'canunu-site-meta',
  transformIndexHtml:()=>{
    const tags=[
      {tag:'title',children:pageTitle('index',c),injectTo:'head'},
      {tag:'meta',attrs:{name:'description',content:c.description},injectTo:'head'},
      {tag:'meta',attrs:{name:'robots',content:c.previewMode?'noindex, nofollow':'index, follow'},injectTo:'head'},
      {tag:'meta',attrs:{property:'og:title',content:pageTitle('index',c)},injectTo:'head'},
      {tag:'meta',attrs:{property:'og:description',content:c.description},injectTo:'head'},
      {tag:'meta',attrs:{property:'og:type',content:'website'},injectTo:'head'},
      {tag:'script',attrs:{type:'application/ld+json'},children:JSON.stringify(buildSchema(c)).replaceAll('<','\u003c'),injectTo:'head'}
    ];
    const url=pageUrl('index',c);
    if(url){
      tags.push({tag:'link',attrs:{rel:'canonical',href:url},injectTo:'head'},{tag:'meta',attrs:{property:'og:url',content:url},injectTo:'head'},{tag:'meta',attrs:{property:'og:image',content:new URL(imageBase(c).slice(1)+c.hero[0].image+'.jpg',safeUrl(c.siteUrl).replace(/\/?$/,'/')).href},injectTo:'head'});
    }
    return tags;
  }
});
export default defineConfig({
  plugins:[react(),siteMeta()],
  server:{host:'127.0.0.1',port:4173},
  preview:{host:'127.0.0.1',port:4173},
  test:{environment:'jsdom',include:['tests/**/*.test.{js,jsx}']}
});
