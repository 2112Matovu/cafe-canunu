import config from '../config.json';
import menu from '../menu.json';
import {imageBase,pagePath} from './seo.js';
export const c=config;
export const m=menu;
export const base=imageBase(c);
export const enabledPages=['index','menu','about','contact','feedback','privacy','terms','order','location',
  ...(c.features.gallery?['gallery']:[]),
  ...(c.features.reservations?['reservations']:[]),
  ...(['loyalty','giftCards','cateringEnquiry','careers'].some(k=>c.features[k])?['extras']:[])];
export const hasExtras=enabledPages.includes('extras');
export const navPages=['index','menu','location','reservations','gallery','contact','about'].filter(k=>enabledPages.includes(k));
export const pageFromPath=pathname=>{const slug=pathname.replace(/^\/|\/$/g,'');return slug===''?'index':enabledPages.includes(slug)?slug:'notfound';};
export {pagePath};
