import {Link} from 'react-router-dom';
import {c} from '../data.js';
import {phoneValid} from '../lib.js';
import {useShop} from '../context.jsx';
import {Hours,Intro,Location,Socials} from '../components/parts.jsx';
import {CommonFields,FormEnd,useFormSubmit} from '../components/forms.jsx';

export default function Contact(){
  const {openMessage}=useShop();
  const {status,busy,onSubmit}=useFormSubmit('contact');
  const call=()=>{if(phoneValid(c.phone))location.href=`tel:${c.phone.replace(/[^+\d]/g,'')}`;else openMessage(`Phone: ${c.phone}\nPlease add the restaurant’s confirmed phone number in config.json.`);};
  return <>
    <Intro label="Hello, Soroti" title="Come by. Say hello." text="Find us, plan your visit, or send the team a message."/>
    <section className="wrap contact-section"><Location/>
      <div className="form-layout"><aside><h2>Let’s talk.</h2><p>Phone: <button className="inline-link" onClick={call}>{c.phone}</button><br/>Email: <button className="inline-link" onClick={()=>openMessage('Hello Cafe Canunu,\n','email')}>{c.email}</button></p><button className="button secondary" onClick={()=>openMessage('Hello Cafe Canunu,\nI would like to enquire about a visit.')}>Chat on WhatsApp ↗</button> <Link className="button secondary" to="/feedback">Give feedback ↗</Link><Hours/><Socials/></aside>
        <form method="post" className="panel form-grid" onSubmit={onSubmit}><CommonFields contact/><label className="full">Email<input name="email" type="email" autoComplete="email" maxLength={254} required/></label><label className="full">Your message<textarea name="message" rows={5} maxLength={2000} required/></label><FormEnd submit="Send message" status={status} busy={busy}/></form>
      </div>
    </section>
  </>;
}
