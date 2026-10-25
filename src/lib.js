export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const configured = value => typeof value === 'string' && value.trim() !== '' && !value.includes('[');
export const safeUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
export const money = value => `UGX ${new Intl.NumberFormat('en-UG').format(value)}`;
export const phoneValid = value => /^\+?[\d ()-]{7,22}$/.test(value) && value.replace(/\D/g,'').length >= 7;
export const waNumber = value => configured(value) && /^\+?[1-9]\d{7,14}$/.test(value.replace(/[ ()-]/g,'')) ? value.replace(/\D/g,'') : '';
export const emailValid = value => configured(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const waUrl = (number, text) => waNumber(number) ? `https://wa.me/${waNumber(number)}?text=${encodeURIComponent(text)}` : '';
export function cleanCart(cart, items) {
  if (!Array.isArray(cart)) return [];
  const combined = new Map();
  for (const row of cart) if (row && items.some(i=>i.id===row.id) && Number.isInteger(row.quantity) && row.quantity>0) combined.set(row.id,Math.min(99,(combined.get(row.id)||0)+row.quantity));
  return [...combined].map(([id,quantity])=>({id,quantity}));
}
export const cartTotal = (cart, items) => cleanCart(cart,items).reduce((sum,row)=>sum+items.find(i=>i.id===row.id).price*row.quantity,0);
export function orderMessage(cart, items, customer, name, sample=false) {
  const rows=cleanCart(cart,items);
  return [`${name} — order request`, sample?'SAMPLE MENU / PRICES — please confirm real availability and prices.':'Please confirm availability, final price and collection/delivery time.', ...rows.map(row=>{const item=items.find(i=>i.id===row.id);return `${row.quantity} × ${item.name} — ${money(item.price*row.quantity)}`;}),`Food subtotal: ${money(cartTotal(rows,items))}`,'Delivery charges, if any, to be confirmed.',`Name: ${customer.name}`,`Phone: ${customer.phone}`,`Order type: ${customer.type}`,customer.type==='Delivery'?`Delivery address: ${customer.address}`:'',`Notes: ${customer.notes||'None'}`].filter(Boolean).join('\n');
}
export function eatParts(now=new Date()) {
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Kampala',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
  return {date:`${parts.year}-${parts.month}-${parts.day}`,time:`${parts.hour}:${parts.minute}`,day:new Date(`${parts.year}-${parts.month}-${parts.day}T12:00:00+03:00`).getUTCDay()};
}
const validTime = s => typeof s==='string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s);
export const intervals = value => Array.isArray(value) ? value.filter(x=>x && validTime(x.open) && validTime(x.close) && x.open<x.close) : [];
export function openStatus(hours,now=new Date()) {
  const p=eatParts(now), value=hours[p.day];
  if (value===null || value===undefined) return 'Hours to be confirmed';
  return intervals(value).some(x=>p.time>=x.open&&p.time<x.close)?'Open now':'Closed';
}
export function reservationError(data,hours,now=new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||!validTime(data.time)) return 'Choose a valid date and time.';
  const booking=new Date(`${data.date}T${data.time}:00+03:00`);
  if (Number.isNaN(booking.getTime())) return 'Choose a valid calendar date.';
  const parts=eatParts(booking);
  if (parts.date!==data.date) return 'Choose a valid calendar date.';
  if (booking<=now) return 'Please choose a future date and time in East Africa Time.';
  if (!Number.isInteger(Number(data.guests))||Number(data.guests)<1||Number(data.guests)>50) return 'Choose between 1 and 50 guests. Contact us for larger groups.';
  const day=hours[parts.day];
  if (day===null||day===undefined) return 'Opening hours for this date have not been confirmed. Please contact the restaurant before requesting a table.';
  if (!intervals(day).some(x=>data.time>=x.open&&data.time<x.close)) return 'Please choose a time within the opening hours shown for that day.';
  return '';
}
