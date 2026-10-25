import {configured,safeUrl,intervals} from './lib.js';
export const pages={index:'Home',menu:'Menu',about:'About Us',location:'Location',gallery:'Gallery',reservations:'Reservations',contact:'Contact',feedback:'Feedback',privacy:'Privacy Policy',terms:'Terms of Use',extras:'More at Canunu',order:'Your Order'};
export const imageBase=c=>'/'+(c.imageMode==='real'?c.realImageDirectory:'images/');
export const pagePath=page=>page==='index'?'/':'/'+page;
export const withSlash=url=>url.endsWith('/')?url:url+'/';
export const pageTitle=(page,c)=>page==='index'?`${c.name} | Restaurant in Soroti, Uganda`:`${pages[page]||(page==='order'?'Order':'Page not found')} | ${c.name} · Soroti`;
export const pageUrl=(page,c)=>safeUrl(c.siteUrl)?new URL(pagePath(page).slice(1),withSlash(safeUrl(c.siteUrl))).href:'';
export function buildSchema(c){
  const schema={'@context':'https://schema.org','@type':'Restaurant',name:c.name,description:c.description,address:{'@type':'PostalAddress',addressLocality:'Soroti',addressCountry:'UG'}};
  const site=configured(c.siteUrl)&&safeUrl(c.siteUrl);
  if(site){const base=withSlash(site);schema.url=site;schema.hasMenu=new URL('menu',base).href;schema.image=new URL(imageBase(c).slice(1)+c.hero[0].image+'.jpg',base).href;}
  if(configured(c.phone))schema.telephone=c.phone;
  if(configured(c.email))schema.email=c.email;
  if(configured(c.branches[0].address))schema.address.streetAddress=c.branches[0].address;
  if(c.branches[0].latitude!==null&&c.branches[0].longitude!==null)schema.geo={'@type':'GeoCoordinates',latitude:c.branches[0].latitude,longitude:c.branches[0].longitude};
  schema.openingHoursSpecification=Object.entries(c.hours).flatMap(([d,h])=>intervals(h).map(t=>({'@type':'OpeningHoursSpecification',dayOfWeek:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d],opens:t.open,closes:t.close})));
  schema.sameAs=Object.values(c.socials).filter(safeUrl);
  return schema;
}
