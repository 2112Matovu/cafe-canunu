import {c} from '../data.js';
import {eatParts} from '../lib.js';
import {Hours,Intro} from '../components/parts.jsx';
import {CommonFields,FormEnd,useFormSubmit} from '../components/forms.jsx';

export default function Reservations(){
  const {status,busy,onSubmit}=useFormSubmit('reservation');
  return <>
    <Intro label="We’d love to host you" title="Let’s make a plan." text="Request a table for your next visit. The team will confirm availability directly with you."/>
    <section className="wrap form-layout"><aside><h2>A place for<br/>your people.</h2><Hours/><p>For more than 50 guests, please contact us to discuss your plans.</p><p className="notice">{Object.values(c.hours).some(Array.isArray)?'Please check the day’s opening hours.':'Opening hours must be configured before reservation requests can be sent.'}</p></aside>
      <form method="post" className="panel form-grid" onSubmit={onSubmit}><CommonFields/><label>Date<input name="date" type="date" min={eatParts().date} required/></label><label>Time · EAT<input name="time" type="time" required/></label><label>Number of guests<input name="guests" type="number" min={1} max={50} defaultValue={2} required/></label><label className="full">Special request<textarea name="notes" rows={4} maxLength={1000}/></label><FormEnd submit="Request via WhatsApp" status={status} busy={busy}/></form>
    </section>
  </>;
}
