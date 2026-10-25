import {c} from '../data.js';
import {Intro} from '../components/parts.jsx';
import {CommonFields,FormEnd,useFormSubmit} from '../components/forms.jsx';

function EnquiryForm({kind,submit,label}){
  const {status,busy,onSubmit}=useFormSubmit(kind);
  return <form method="post" className="panel form-grid" onSubmit={onSubmit}><CommonFields/><label>Email<input name="email" type="email" required/></label><label className="full">{label}<textarea name="message" rows={5} maxLength={2000} required/></label><FormEnd submit={submit} status={status} busy={busy}/></form>;
}
export default function Extras(){
  return <>
    <Intro label="A little more" title="More at Canunu." text="Optional services and information."/>
    <section className="wrap content-section">
      {c.features.loyalty&&<article><h2>Loyalty & rewards</h2><p>{c.optional.loyalty}</p></article>}
      {c.features.giftCards&&<article><h2>Gift cards</h2><p>{c.optional.giftCards}</p></article>}
      {c.features.careers&&<article><h2>Careers</h2><p>{c.optional.careers}</p><EnquiryForm kind="careers" submit="Send application" label="Your application"/></article>}
      {c.features.cateringEnquiry&&<article><h2>Catering & events enquiry</h2><EnquiryForm kind="catering" submit="Send enquiry" label="Tell us your date, group size and plans"/></article>}
    </section>
  </>;
}
