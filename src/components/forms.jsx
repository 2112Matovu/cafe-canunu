import {useState} from 'react';
import {c,m} from '../data.js';
import {useShop} from '../context.jsx';
import {orderMessage,reservationError,phoneValid,emailValid,safeUrl} from '../lib.js';
import {Arrow} from './parts.jsx';

// One submit handler for every form, keyed by `kind`. Fields are read from the DOM form.
export function useFormSubmit(kind){
  const {cart,openMessage}=useShop();
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  async function send(endpoint,data,form){
    setBusy(true);setStatus('Sending…');
    try{
      const response=await fetch(endpoint,{method:'POST',body:JSON.stringify(data),headers:{'Content-Type':'application/json','Accept':'application/json'},signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error('Submission failed');
      setStatus('Your message was accepted by the form service. The team will need to confirm any request.');form.reset();
    }catch{setStatus('We couldn’t confirm delivery. Your entries are still here. Try again, or use Email instead.');}
    finally{setBusy(false);}
  }
  function onSubmit(event){
    event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form));Object.keys(data).forEach(k=>{if(typeof data[k]==='string')data[k]=data[k].trim();});
    setStatus('');const channel=event.nativeEvent.submitter?.value==='email'?'email':'whatsapp';
    if(kind==='newsletter'){
      if(!emailValid(data.email)||!data.consent){setStatus('Enter your email and agree to receive news and offers.');return;}
      const endpoint=safeUrl(c.forms.newsletterEndpoint);
      if(!endpoint){setStatus('Email signup is awaiting the restaurant’s mailing-list connection. Your email has not been submitted.');return;}
      send(endpoint,{email:data.email,consent:c.forms.newsletterConsent,consentAt:new Date().toISOString()},form);return;
    }
    if(!data.name){setStatus('Please enter your name.');return;}
    if(data.phone&&!phoneValid(data.phone)){setStatus('Please enter a valid phone number.');return;}
    if(['order','reservation','catering','careers'].includes(kind)&&!phoneValid(data.phone||'')){setStatus('Please enter a valid phone number.');return;}
    if(data.email&&!emailValid(data.email)){setStatus('Please enter a valid email.');return;}
    if(kind==='feedback'&&!data.phone&&!data.email){setStatus('Please provide a phone number or email so we can follow up.');return;}
    if(kind==='feedback'&&![1,2,3,4,5].includes(Number(data.rating))){setStatus('Choose a rating from 1 to 5.');return;}
    if(['feedback','contact','careers','catering'].includes(kind)&&!data.message){setStatus('Please enter your message.');return;}
    if(kind==='reservation'){
      const error=reservationError(data,c.hours);if(error){setStatus(error);return;}
      openMessage([`${c.name} — reservation request`,`Name: ${data.name}`,`Phone: ${data.phone}`,`Date: ${data.date}`,`Time: ${data.time} EAT (UTC+3)`,`Guests: ${data.guests}`,`Special request: ${data.notes||'None'}`,'Please confirm availability.'].join('\n'),channel,'Reservation request');return;
    }
    if(kind==='order'){
      if(!cart.length){setStatus('Please add at least one dish from the menu.');return;}
      if(!['Dine-in','Takeaway','Delivery'].includes(data.type)||!c.services[data.type]){setStatus('Choose an available order type.');return;}
      if(data.type==='Delivery'&&!data.address){setStatus('Please add a delivery area and address.');return;}
      openMessage(orderMessage(cart,m.items,data,c.name,m.sample),'whatsapp','Order request');return;
    }
    const text=[`${c.name} — ${kind}`,`Name: ${data.name}`,`Phone: ${data.phone||'Not provided'}`,`Email: ${data.email||'Not provided'}`,data.rating?`Rating: ${data.rating}/5`:'',`Message: ${data.message}`].filter(Boolean).join('\n');
    if(channel!=='email'&&safeUrl(c.forms.endpoint)){send(safeUrl(c.forms.endpoint),{...data,form:kind},form);return;}
    openMessage(text,channel,`${kind} enquiry`);
  }
  return {status,busy,onSubmit};
}
export const CommonFields=({contact=false})=><>
  <label>Your name<input name="name" autoComplete="name" maxLength={100} required/></label>
  <label>{contact?'Phone (optional)':'Phone number'}<input name="phone" type="tel" autoComplete="tel" maxLength={24} required={!contact}/></label>
</>;

export const FormEnd=({submit,status,busy})=><>
  <p className="small muted">Your request is only confirmed when the restaurant replies. Times are in East Africa Time.</p>
  <div className="form-actions"><button className="button" type="submit" disabled={busy}>{submit} <Arrow/></button><button className="button secondary" type="submit" name="channel" value="email" disabled={busy}>Email instead <Arrow/></button></div>
  <p className="form-status" role="status">{status}</p>
</>;

export function Signup(){
  const {status,busy,onSubmit}=useFormSubmit('newsletter');
  if(!c.features.newsletter)return null;
  return <form method="post" className="signup" onSubmit={onSubmit}><label htmlFor="signup-email">A little good news in your inbox.</label><p>Sign up for news and offers.</p><div className="inline-field"><input id="signup-email" name="email" type="email" autoComplete="email" placeholder="Your email address" maxLength={254} required/><button type="submit" aria-label="Subscribe to news and offers" disabled={busy}>Join ↗</button></div><label className="consent"><input type="checkbox" name="consent" required/> <span>{c.forms.newsletterConsent}</span></label><p className="form-status" role="status">{status}</p></form>;
}
