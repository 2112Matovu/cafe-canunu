import {useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {c,m,base} from '../data.js';
import {money,cartTotal,phoneValid} from '../lib.js';
import {useShop} from '../context.jsx';
import {Intro,MenuNotice} from '../components/parts.jsx';
import {CommonFields,useFormSubmit} from '../components/forms.jsx';

const types=['Dine-in','Takeaway','Delivery'].filter(x=>c.services[x]);
export default function Order(){
  const {cart,changeQuantity,removeItem,openMessage}=useShop();
  const {status,busy,onSubmit}=useFormSubmit('order');
  const [type,setType]=useState(types[0]);
  const addLink=useRef();
  const delivery=type==='Delivery';
  const call=()=>{if(phoneValid(c.phone))location.href=`tel:${c.phone.replace(/[^+\d]/g,'')}`;else openMessage(`Phone: ${c.phone}\nPlease add the restaurant’s confirmed phone number in config.json.`);};
  // Focus has to land somewhere sensible when the button being used disappears or becomes disabled.
  const step=(event,row,delta)=>{
    const next=row.quantity+delta;
    if(next<=0)addLink.current.focus();
    else if(next>=99&&delta>0)event.currentTarget.parentElement.querySelector('[data-delta="-1"]').focus();
    changeQuantity(row.id,delta);
  };
  return <>
    <Intro label="Your next good meal" title="Let’s get your order together." text="Choose your dishes, check the details and send your request to the team."/>
    <section className="wrap order-layout">
      <div className="panel"><h2>Your order</h2>
        <div id="cart-items">{cart.length?cart.map(row=>{const i=m.items.find(x=>x.id===row.id);return <article className="cart-row" key={row.id}><img src={`${base+i.image}.webp`} alt={i.alt} width={62} height={62}/><div><h3>{i.name}</h3><p>{money(i.price)} each · {money(row.quantity*i.price)}{m.sample&&' · Sample price'}</p><div className="quantity"><button type="button" data-delta="-1" aria-label={`Decrease ${i.name} quantity`} onClick={e=>step(e,row,-1)}>−</button><span aria-label="Quantity">{row.quantity}</span><button type="button" data-delta="1" aria-label={`Increase ${i.name} quantity`} disabled={row.quantity>=99} onClick={e=>step(e,row,1)}>+</button><button type="button" className="remove" aria-label={`Remove ${i.name}`} onClick={()=>{addLink.current.focus();removeItem(row.id);}}>Remove</button></div></div></article>;}):<p>Your cart is waiting for something good. Browse the menu to get started.</p>}</div>
        <div className="cart-total"><span>Food subtotal</span><strong id="cart-total">{money(cartTotal(cart,m.items))}</strong></div>
        <p className="small">Delivery charges, if any, are confirmed by the restaurant. Your order is a request until accepted.</p><Link className="text-link" to="/menu" ref={addLink}>Add something from the menu ↗</Link><MenuNotice/></div>
      <form method="post" className="panel form-grid" onSubmit={onSubmit}><CommonFields/>
        <label className="full">Order type<select name="type" id="order-type" value={type} onChange={e=>setType(e.target.value)} required>{types.map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="full" id="delivery-field" hidden={!delivery}>Delivery area / address<textarea name="address" maxLength={600} rows={3} required={delivery}/></label>
        <label className="full">Notes / allergies<textarea name="notes" maxLength={1000} rows={3}/></label>
        <div className="payment full"><strong>{c.payments.text}</strong><p>MTN MoMo: {c.payments.mtn}<br/>Airtel Money: {c.payments.airtel}</p>{!c.payments.confirmed&&<p className="small">Payment methods and merchant details await confirmation.</p>}<p className="small">No payment is taken on this website.</p></div>
        <button className="button full" type="submit" disabled={busy}>Send Order via WhatsApp ↗</button>
        <button className="button secondary full" type="button" onClick={call}>Call to Order ↗</button>
        <p className="form-status" role="status">{status}</p>
      </form>
    </section>
  </>;
}
