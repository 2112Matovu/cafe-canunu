// @vitest-environment node
import {test} from 'vitest';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cleanCart,cartTotal,orderMessage,waUrl,openStatus,reservationError,eatParts,esc} from '../src/lib.js';

const c=JSON.parse(fs.readFileSync(new URL('../config.json',import.meta.url))),m=JSON.parse(fs.readFileSync(new URL('../menu.json',import.meta.url)));
const hours=Object.fromEntries(Array.from({length:7},(_,i)=>[i,[{open:'08:00',close:'12:00'},{open:'14:00',close:'20:00'}]]));

test('cart maths and sanitising',()=>{
  const cart=[{id:'rolex',quantity:2},{id:'coffee',quantity:3}];
  assert.equal(cartTotal(cart,m.items),37000);
  assert.deepEqual(cleanCart([{id:'rolex',quantity:90},{id:'rolex',quantity:80},{id:'bad',quantity:1},{id:'coffee',quantity:-2}],m.items),[{id:'rolex',quantity:99}]);
  assert.deepEqual(cleanCart({},m.items),[]);
  assert.equal(cartTotal([{id:'rolex',quantity:0}],m.items),0);
});
test('WhatsApp messages keep special characters',()=>{
  const customer={name:'Jo & Ayo + 🌿',phone:'+256 700 123456',type:'Delivery',address:'Plot 2 / Road #5',notes:'No chilli & extra sauce?'};
  const message=orderMessage([{id:'rolex',quantity:2},{id:'coffee',quantity:3}],m.items,customer,c.name,true),url=waUrl('+256700123456',message);
  assert.equal(new URL(url).searchParams.get('text'),message);
  assert.match(message,/UGX 37,000/);assert.ok(message.includes(customer.name));assert.ok(message.includes(customer.address));assert.ok(message.includes(customer.notes));
  assert.equal(waUrl('[WHATSAPP_NUMBER]',message),'');assert.equal(waUrl('123',message),'');
  assert.equal(esc('<script>"&'),'&lt;script&gt;&quot;&amp;');
});
test('East Africa Time opening status',()=>{
  assert.deepEqual(eatParts(new Date('2026-10-24T22:00:00Z')),{date:'2026-10-25',time:'01:00',day:0});
  for(const [t,status] of [['04:59','Closed'],['05:00','Open now'],['09:00','Closed'],['11:00','Open now'],['17:00','Closed']])assert.equal(openStatus(hours,new Date(`2026-10-25T${t}:00Z`)),status);
  assert.equal(openStatus(c.hours,new Date('2026-10-25T09:00Z')),'Hours to be confirmed');
});
test('reservation boundaries',()=>{
  const now=new Date('2026-10-25T06:00:00Z'),booking={date:'2026-10-26',time:'10:00',guests:'2'};
  assert.equal(reservationError(booking,hours,now),'');
  assert.match(reservationError({...booking,date:'2026-99-99'},hours,now),/calendar/);
  assert.match(reservationError({...booking,date:'2026-02-30'},hours,now),/calendar/);
  assert.match(reservationError({...booking,date:'2026-10-24'},hours,now),/future/);
  assert.match(reservationError({...booking,time:'13:00'},hours,now),/opening hours/);
  assert.match(reservationError({...booking,time:'20:00'},hours,now),/opening hours/);
  assert.match(reservationError({...booking,guests:'1.5'},hours,now),/guests/);
  assert.match(reservationError(booking,c.hours,now),/not been confirmed/);
  assert.match(reservationError(booking,{...hours,1:[]},now),/opening hours/);
});
test('image budgets',()=>{
  const dir=new URL('../public/images/',import.meta.url);
  for(const file of fs.readdirSync(dir).filter(f=>/\.(webp|jpg)$/.test(f)))assert.ok(fs.statSync(new URL(file,dir)).size<=(file.startsWith('hero-')?250000:100000),file+' exceeds image budget');
});
