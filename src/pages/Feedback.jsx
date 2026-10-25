import {c} from '../data.js';
import {Intro} from '../components/parts.jsx';
import {CommonFields,FormEnd,useFormSubmit} from '../components/forms.jsx';

export default function Feedback(){
  const {status,busy,onSubmit}=useFormSubmit('feedback');
  return <>
    <Intro label="Every little detail matters" title="How was your visit?" text="Tell us what made you smile, or what we could do better."/>
    <section className="wrap form-layout"><aside><h2>We’re listening.</h2><p>{c.forms.confidentiality}</p><p>Your honest feedback helps the team learn. Please avoid sharing payment PINs or other sensitive information.</p></aside>
      <form method="post" className="panel form-grid" onSubmit={onSubmit}><CommonFields contact/><label className="full">Email (provide a phone number or email)<input name="email" type="email" maxLength={254} autoComplete="email"/></label>
        <fieldset className="full rating"><legend>Your rating</legend>{[1,2,3,4,5].map(n=><label key={n}><input type="radio" name="rating" value={n} required/><span aria-hidden="true">★</span><span>{n}</span></label>)}</fieldset>
        <label className="full">Your feedback<textarea name="message" maxLength={2000} rows={5} required/></label><FormEnd submit="Send feedback" status={status} busy={busy}/></form>
    </section>
  </>;
}
