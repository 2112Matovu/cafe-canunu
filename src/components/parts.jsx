import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {c,m,base} from '../data.js';
import {money,safeUrl,intervals,openStatus} from '../lib.js';
import {useShop} from '../context.jsx';

export function Picture({slug,alt,hero=false}){
  return <picture><source srcSet={`${base+slug}.webp`} type="image/webp"/><img src={`${base+slug}.jpg`} alt={alt} width={hero?1280:600} height={hero?720:600} {...(hero?{fetchPriority:'high'}:{loading:'lazy'})} decoding="async"/></picture>;
}
export const Logo=()=><picture><source srcSet="/logo.webp" type="image/webp"/><img className="brand-logo" src="/logo.png" alt={c.name} width={638} height={240}/></picture>;
export const Arrow=()=><span aria-hidden="true">↗</span>;
export const Button=({children,to,href,secondary=false})=>to
  ?<Link className={`button ${secondary?'secondary':''}`} to={to}>{children} <Arrow/></Link>
  :<a className={`button ${secondary?'secondary':''}`} href={href}>{children} <Arrow/></a>;
export const Intro=({label,title,text})=><section className="page-intro wrap"><p className="eyebrow">{label}</p><h1>{title}</h1><p className="lede">{text}</p></section>;
export const MenuNotice=()=>c.menuNotice?<p className="notice">{c.menuNotice}</p>:null;
export const ImageNotice=()=>c.imageNotice?<p className="small muted">{c.imageNotice}</p>:null;
export const Lines=({text})=>text.split('\n').flatMap((line,i)=>i?[<br key={'br'+i}/>,line]:[line]);

export function External({label,url}){
  const href=safeUrl(url);
  return href?<a href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>:<span className="unconfigured">{label} · {url}</span>;
}
export const Socials=()=><div className="socials">{Object.entries(c.socials).map(([name,url])=><External key={name} label={name} url={url}/>)}</div>;

export function DishCard({item}){
  const {addItem}=useShop();
  return <article className="dish"><div className="dish-photo"><Picture slug={item.image} alt={item.alt}/>{m.sample&&<span className="sample-label">Sample dish</span>}</div><div className="dish-body"><div className="tags">{item.tags.map(t=><span key={t}>{t}</span>)}</div><h3>{item.name}</h3><p>{item.description}</p><div className="dish-bottom"><strong>{money(item.price)}{m.sample&&<small>Sample price</small>}</strong><button className="add" onClick={()=>addItem(item.id)} aria-label={`Add ${item.name} to order`}><span aria-hidden="true">＋</span> Add</button></div></div></article>;
}

// Re-evaluated every 30 seconds so the indicator stays current while the page is open.
export function useOpenStatus(){
  const [text,setText]=useState(()=>openStatus(c.hours));
  useEffect(()=>{const id=setInterval(()=>setText(openStatus(c.hours)),30000);return ()=>clearInterval(id);},[]);
  return text;
}
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export function Hours(){
  const status=useOpenStatus();
  return <>
    <p className={`status${status==='Open now'?' is-open':''}`}>{status}</p>
    <p className="small">East Africa Time · UTC+3</p>
    {Object.values(c.hours).every(h=>h===null)
      ?<p>{c.hoursLabel}</p>
      :<dl className="hours">{DAYS.map((d,i)=><div key={d}><dt>{d}</dt><dd>{c.hours[i]===null?'To be confirmed':intervals(c.hours[i]).map(t=>`${t.open}–${t.close}`).join(', ')||'Closed'}</dd></div>)}</dl>}
  </>;
}

function MapPanel({branch}){
  const embed=safeUrl(branch.mapEmbedUrl);
  if(embed&&new URL(branch.mapEmbedUrl).hostname==='www.google.com')
    return <div className="map-panel"><iframe src={embed} title={`Map of ${branch.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div>;
  return <div className="map-panel"><span className="map-pin" aria-hidden="true">⌖</span><h3>Soroti, Uganda</h3><p className="small">Exact restaurant location to be confirmed.<br/>{branch.mapEmbedUrl}</p></div>;
}
export const Location=()=><div className="locations">{c.branches.map(b=><article className="location-grid" key={b.name}><div><p className="eyebrow">Find your way</p><h2>{b.name}</h2><p>{b.address}<br/>{c.locationLabel}</p><p className="small">A good catch-up starts with a place to meet.</p>{b.note&&<p className="notice">{b.note}</p>}{safeUrl(b.mapUrl)?<Button href={safeUrl(b.mapUrl)}>Get Directions</Button>:<p className="notice">Directions await {b.mapUrl}</p>}</div><MapPanel branch={b}/></article>)}</div>;
