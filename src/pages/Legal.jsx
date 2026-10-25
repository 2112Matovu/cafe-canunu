import {c} from '../data.js';
import {pages} from '../seo.js';
import {Intro} from '../components/parts.jsx';

export default function Legal({page}){
  return <>
    <Intro label="The details" title={pages[page]} text="Placeholder legal text — the restaurant owner must review and replace this before launch."/>
    <section className="wrap legal panel"><p>{c.legal[page]}</p><h2>How this website works</h2><p>Your cart is stored on this device when browser storage is available. Customer form fields are not saved by this website. Submitting a form opens your chosen messaging service or sends to the form provider configured by the owner. The map on the Location and Contact pages loads from Google when you open those pages.</p><p>Orders and reservation messages are requests, pending confirmation by the restaurant.</p></section>
  </>;
}
