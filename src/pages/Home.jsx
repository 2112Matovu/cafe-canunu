import {useCallback,useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {c,m,base} from '../data.js';
import {Button,DishCard,External,Hours,Lines,Location,MenuNotice,Picture} from '../components/parts.jsx';

const pad=n=>String(n).padStart(2,'0');
const SERVICE_ICONS={'Dine-in':'♧',Takeaway:'▱',Delivery:'↗',Catering:'♧',Events:'✧'};
const reducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches||Boolean(navigator.connection?.saveData);

// Only one slide image is in the DOM at a time. Other hero photos load on demand.
function Hero(){
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(reducedMotion);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [hidden,setHidden]=useState(document.hidden);
  const [nudge,setNudge]=useState(0);
  const requested=useRef(0),touchX=useRef(0);
  const slide=c.hero[index];

  const show=useCallback(async next=>{
    const target=(next+c.hero.length)%c.hero.length;requested.current=target;
    const image=new Image();image.src=base+c.hero[target].image+'.webp';
    try{await image.decode();}catch{}
    if(requested.current===target){setIndex(target);setNudge(n=>n+1);}
  },[]);
  useEffect(()=>{const sync=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',sync);return ()=>document.removeEventListener('visibilitychange',sync);},[]);
  useEffect(()=>{
    if(paused||hidden||hovered||focused)return;
    const id=setTimeout(()=>show(index+1),6500);return ()=>clearTimeout(id);
  },[index,paused,hidden,hovered,focused,nudge,show]);

  // Touch devices fake mouse events after a tap; only a real mouse should hold the slideshow.
  const mouseOnly=fn=>event=>{if(event.pointerType==='mouse')fn();};
  return <section className="hero" aria-roledescription="carousel" aria-label="Cafe Canunu highlights"
    onPointerEnter={mouseOnly(()=>setHovered(true))} onPointerLeave={mouseOnly(()=>setHovered(false))}
    onFocus={e=>{if(e.target.matches(':focus-visible'))setFocused(true);}} onBlur={()=>setFocused(false)}
    onTouchStart={e=>{touchX.current=e.changedTouches[0].clientX;}}
    onTouchEnd={e=>{const delta=e.changedTouches[0].clientX-touchX.current;if(Math.abs(delta)>55)show(index+(delta<0?1:-1));}}>
    <div className="hero-image" id="hero-image"><Picture slug={slide.image} alt={slide.alt} hero/></div>
    <div className="hero-shade"></div>
    <div className="hero-content wrap"><p className="eyebrow" id="hero-label">{slide.label}</p><h1 id="hero-heading"><Lines text={slide.heading}/></h1><p id="hero-text">{slide.text}</p><div className="hero-actions"><Button to="/order">Start Order</Button></div></div>
    <div className="hero-controls wrap"><span className="hero-location">{c.locationLabel} <span aria-hidden="true">／</span> Come hungry. Leave happy.</span><div>
      <button id="previous-slide" aria-label="Previous slide" onClick={()=>show(index-1)}>←</button>
      <span id="slide-number">{pad(index+1)} / {pad(c.hero.length)}</span>
      <button id="next-slide" aria-label="Next slide" onClick={()=>show(index+1)}>→</button>
      <button id="pause-slide" aria-label={paused?'Play slideshow':'Pause slideshow'} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?'Play':'Pause'}</button>
    </div></div>
    <span className="hero-disclosure">{c.imageMode==='generated'?'Illustrative AI-generated scene':'Cafe Canunu'}</span>
  </section>;
}

export default function Home(){
  const tableAlt=c.hero.find(h=>h.image==='hero-cafe-table')?.alt||'Cafe table setting';
  return <>
    <Hero/>
    <section className="welcome wrap"><p className="eyebrow">Welcome to Cafe Canunu</p><div className="section-heading"><h2>A little comfort.<br/>A lot to savour.</h2><div><p>For a quick bite, a slow coffee, or time around a table. Explore what’s on the menu and plan your next visit.</p><Link className="text-link" to="/about">Get to know Canunu ↗</Link></div></div>
      <div className="services">{Object.entries(c.services).filter(([,v])=>v).map(([s])=><div key={s}><span aria-hidden="true">{SERVICE_ICONS[s]}</span><h3>{s}</h3></div>)}</div>
      {c.previewMode&&<p className="small muted">{c.servicesNotice}</p>}
    </section>
    <section className="menu-feature section-tint"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">Find your next favourite</p><h2>Meet the menu.</h2></div><Link className="text-link" to="/menu">Explore the full menu ↗</Link></div><MenuNotice/><div className="dish-grid featured">{m.items.filter(i=>i.featured).slice(0,6).map(i=><DishCard key={i.id} item={i}/>)}</div><p className="small muted">Prices are in Uganda Shillings. Images are serving suggestions only.</p></div></section>
    {c.promotion.enabled&&<section className="promo wrap"><p className="eyebrow">Today’s special</p><h2>{c.promotion.title}</h2><p>{c.promotion.text}</p><Button to="/menu">Explore the menu</Button></section>}
    <section className="story-strip wrap"><div className="story-image"><Picture slug="hero-cafe-table" alt={tableAlt}/></div><div><p className="eyebrow">Make a little time</p><h2>Some moments<br/>deserve a table.</h2><p>Bring your people and plan a visit. Send a reservation request and we’ll take it from there.</p>{c.features.reservations?<Button to="/reservations" secondary>Request a table</Button>:<Button to="/contact" secondary>Get in touch</Button>}</div></section>
    {c.features.reviews&&<section className="reviews section-tint"><div className="wrap"><p className="eyebrow">Around the table</p><h2>Words from our guests.</h2>{c.googleRating&&<p className="google-rating"><strong>★ {c.googleRating.score.toFixed(1)}</strong> on Google · {c.googleRating.count.toLocaleString('en-UG')} reviews</p>}{!c.testimonialsConfirmed&&<p className="notice">Placeholder testimonials — these are not real customer reviews.</p>}<div className="review-grid">{c.testimonials.map(t=><figure key={t.name}><span aria-hidden="true">“</span><blockquote>{t.quote}</blockquote><figcaption>{t.name}{t.source&&` · ${t.source}`}{c.testimonialsConfirmed?'':' · Placeholder'}</figcaption></figure>)}</div><External label="Read Google reviews" url={c.reviewsUrl}/></div></section>}
    <section className="wrap visit"><div className="section-heading"><h2>We’ll save you<br/>a little space.</h2><div><Hours/></div></div><Location/></section>
  </>;
}
